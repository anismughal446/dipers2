// server/index.js
const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./database');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'littlenest_super_secret_key_2024';

app.use(cors({ exposedHeaders: ['X-Total-Count'] }));
app.use(express.json());

// ─── JWT Middleware ───────────────────────────────────────────────────────────
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied. Please login.' });
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ error: 'Invalid or expired token.' });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required.' });
  }
  next();
}

// ─── Seed Default Admin ───────────────────────────────────────────────────────
db.get('SELECT id FROM users WHERE email = ?', ['admin@littlenest.com'], async (err, row) => {
  if (!row) {
    const hashed = await bcrypt.hash('admin123', 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      ['Admin', 'admin@littlenest.com', hashed, 'admin'],
      (err) => {
        if (!err) console.log('✅ Default admin created: admin@littlenest.com / admin123');
      }
    );
  }
});

// ─── Auth Routes ──────────────────────────────────────────────────────────────
app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ error: 'All fields are required.' });
  if (password.length < 6)
    return res.status(400).json({ error: 'Password must be at least 6 characters.' });

  try {
    const hashed = await bcrypt.hash(password, 10);
    db.run(
      'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
      [name, email, hashed, 'user'],
      function (err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(409).json({ error: 'Email already in use.' });
          }
          return res.status(500).json({ error: 'Registration failed.' });
        }
        const token = jwt.sign(
          { id: this.lastID, name, email, role: 'user' },
          JWT_SECRET,
          { expiresIn: '7d' }
        );
        res.json({ token, user: { id: this.lastID, name, email, role: 'user' } });
      }
    );
  } catch {
    res.status(500).json({ error: 'Server error.' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).json({ error: 'Email and password are required.' });

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err || !user)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid)
      return res.status(401).json({ error: 'Invalid email or password.' });

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({ token, user: { id: user.id, name: user.name, email: user.email, role: user.role } });
  });
});

app.get('/api/auth/me', authenticateToken, (req, res) => {
  res.json({ user: req.user });
});

app.patch('/api/auth/profile', authenticateToken, (req, res) => {
  const { name, addresses } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Name is required.' });
  const safeAddresses = Array.isArray(addresses) ? addresses.slice(0, 10) : [];
  db.run('UPDATE users SET name = ?, addresses = ? WHERE id = ?',
    [name.trim(), JSON.stringify(safeAddresses), req.user.id], function (err) {
      if (err) return res.status(500).json({ error: 'Could not update profile.' });
      res.json({ user: { ...req.user, name: name.trim(), addresses: safeAddresses } });
    });
});

app.get('/api/orders', authenticateToken, (req, res) => {
  db.all('SELECT * FROM orders WHERE user_id = ? ORDER BY created_at DESC', [req.user.id], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Could not load orders.' });
    res.json(rows.map(row => ({ ...row, items: JSON.parse(row.items), shipping_address: JSON.parse(row.shipping_address) })));
  });
});

app.post('/api/orders', authenticateToken, (req, res) => {
  const { items, shipping_address, payment_method } = req.body;
  const methods = ['cod', 'stripe', 'jazzcash', 'easypaisa'];
  if (!Array.isArray(items) || !items.length || !shipping_address?.address || !methods.includes(payment_method))
    return res.status(400).json({ error: 'Order details are incomplete.' });
  const requestedItems = items.map(item => ({ id: Number(item.id), quantity: Number(item.quantity) }));
  if (requestedItems.some(item => !Number.isInteger(item.id) || !Number.isInteger(item.quantity) || item.quantity < 1) || requestedItems.length > 100)
    return res.status(400).json({ error: 'Invalid order items.' });
  const ids = [...new Set(requestedItems.map(item => item.id))];
  db.all(`SELECT id, name, image, price, stock FROM products WHERE id IN (${ids.map(() => '?').join(',')})`, ids, (lookupErr, products) => {
    if (lookupErr) return res.status(500).json({ error: 'Could not verify products.' });
    if (products.length !== ids.length) return res.status(400).json({ error: 'A product in this cart is no longer available.' });
    const byId = new Map(products.map(product => [product.id, product]));
    const cleanItems = requestedItems.map(item => {
      const product = byId.get(item.id);
      return { id: product.id, name: product.name, image: product.image, price: product.price, quantity: item.quantity };
    });
    if (cleanItems.some(item => item.quantity > Number(byId.get(item.id).stock)))
      return res.status(409).json({ error: 'There is not enough stock for one or more items.' });
    const computedSubtotal = cleanItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const computedShipping = computedSubtotal > 3000 ? 0 : 250;
    const paymentStatus = payment_method === 'cod' ? 'pay_on_delivery' : 'pending_provider_setup';
    db.run(`INSERT INTO orders (user_id, items, shipping_address, subtotal, shipping, total, payment_method, payment_status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [req.user.id, JSON.stringify(cleanItems), JSON.stringify(shipping_address), computedSubtotal, computedShipping, computedSubtotal + computedShipping, payment_method, paymentStatus],
      function (err) {
        if (err) return res.status(500).json({ error: 'Could not save your order.' });
        res.status(201).json({ order: { id: this.lastID, status: 'processing', payment_status: paymentStatus, total: computedSubtotal + computedShipping } });
      });
  });
});

// ─── Product Routes (Public) ──────────────────────────────────────────────────
app.get('/api/products', (req, res) => {
  const { category, vendor, brand, minPrice, maxPrice, availability, sort, page = 1, limit = 12 } = req.query;
  let query = 'SELECT * FROM products';
  const conditions = [];
  const params = [];

  if (category) { conditions.push('category = ?'); params.push(category); }
  if (brand || vendor) { conditions.push('brand = ?'); params.push(brand || vendor); }
  if (minPrice) { conditions.push('price >= ?'); params.push(parseInt(minPrice)); }
  if (maxPrice) { conditions.push('price <= ?'); params.push(parseInt(maxPrice)); }
  if (availability === 'in_stock') conditions.push('stock > 0');
  if (availability === 'out_of_stock') conditions.push('stock = 0');
  if (req.query.is_sale === '1') conditions.push('is_sale = 1');
  if (req.query.is_new === '1') conditions.push('is_new = 1');

  if (conditions.length > 0) query += ' WHERE ' + conditions.join(' AND ');

  if (sort === 'price_asc') query += ' ORDER BY price ASC';
  else if (sort === 'price_desc') query += ' ORDER BY price DESC';
  else if (sort === 'newest') query += ' ORDER BY id DESC';

  const offset = (page - 1) * limit;
  query += ` LIMIT ? OFFSET ?`;
  params.push(parseInt(limit), offset);

  const countQuery = `SELECT COUNT(*) AS total FROM products${conditions.length ? ` WHERE ${conditions.join(' AND ')}` : ''}`;
  db.get(countQuery, params.slice(0, params.length - 2), (countErr, countRow) => {
    if (countErr) return res.status(500).json({ error: 'Database error' });
    db.all(query, params, (err, rows) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.set('X-Total-Count', String(countRow.total));
      res.json(rows);
    });
  });
});

app.get('/api/categories', (req, res) => {
  db.all('SELECT DISTINCT category FROM products', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows.map(r => r.category));
  });
});

app.get('/api/brands', (req, res) => {
  const { category, is_sale, is_new } = req.query;
  const conditions = [];
  const params = [];
  if (category) { conditions.push('category = ?'); params.push(category); }
  if (is_sale === '1') conditions.push('is_sale = 1');
  if (is_new === '1') conditions.push('is_new = 1');
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  db.all(`SELECT brand, COUNT(*) AS count FROM products ${where} GROUP BY brand ORDER BY brand`, params, (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

app.get('/api/filter-options', (req, res) => {
  const { category, is_sale, is_new } = req.query;
  const conditions = [];
  const params = [];
  if (category) { conditions.push('category = ?'); params.push(category); }
  if (is_sale === '1') conditions.push('is_sale = 1');
  if (is_new === '1') conditions.push('is_new = 1');
  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  db.all(`SELECT brand, COUNT(*) AS count FROM products ${where} GROUP BY brand ORDER BY brand`, params, (brandErr, brands) => {
    if (brandErr) return res.status(500).json({ error: 'Could not load brand filters.' });
    db.get(`SELECT COUNT(*) AS total, COALESCE(SUM(CASE WHEN stock > 0 THEN 1 ELSE 0 END), 0) AS in_stock,
      COALESCE(SUM(CASE WHEN stock = 0 THEN 1 ELSE 0 END), 0) AS out_of_stock FROM products ${where}`, params, (stockErr, availability) => {
      if (stockErr) return res.status(500).json({ error: 'Could not load availability filters.' });
      res.json({ brands, availability });
    });
  });
});

app.get('/api/products/:id', (req, res) => {
  db.get('SELECT * FROM products WHERE id = ?', [req.params.id], (err, row) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    if (!row) return res.status(404).json({ error: 'Product not found' });
    res.json(row);
  });
});

// ─── Admin Routes (Protected) ─────────────────────────────────────────────────
// Get all products for admin (includes stock)
app.get('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT * FROM products ORDER BY category, name', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// Add product
app.post('/api/admin/products', authenticateToken, requireAdmin, (req, res) => {
  const { name, brand, price, old_price, image, category, vendor, is_sale, is_new, stock } = req.body;
  if (!name || !brand || !price || !image || !category || !vendor)
    return res.status(400).json({ error: 'Required fields missing.' });

  db.run(
    `INSERT INTO products (name, brand, price, old_price, image, category, vendor, is_sale, is_new, stock)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [name, brand, parseInt(price), old_price ? parseInt(old_price) : null, image, category, vendor,
     is_sale ? 1 : 0, is_new ? 1 : 0, parseInt(stock) || 100],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to add product.' });
      res.json({ id: this.lastID, message: 'Product added successfully.' });
    }
  );
});

// Delete product
app.delete('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  db.run('DELETE FROM products WHERE id = ?', [req.params.id], function (err) {
    if (err) return res.status(500).json({ error: 'Failed to delete product.' });
    if (this.changes === 0) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product deleted successfully.' });
  });
});

// Update stock
app.patch('/api/admin/products/:id/stock', authenticateToken, requireAdmin, (req, res) => {
  const { delta, stock } = req.body; // delta: +/- amount, or stock: absolute value
  if (stock !== undefined) {
    // Set absolute stock
    db.run('UPDATE products SET stock = ? WHERE id = ?', [Math.max(0, parseInt(stock)), req.params.id], function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update stock.' });
      res.json({ message: 'Stock updated.' });
    });
  } else if (delta !== undefined) {
    // Relative adjustment
    db.run(
      'UPDATE products SET stock = MAX(0, stock + ?) WHERE id = ?',
      [parseInt(delta), req.params.id],
      function (err) {
        if (err) return res.status(500).json({ error: 'Failed to update stock.' });
        res.json({ message: 'Stock updated.' });
      }
    );
  } else {
    res.status(400).json({ error: 'Provide delta or stock value.' });
  }
});

// Update product details
app.put('/api/admin/products/:id', authenticateToken, requireAdmin, (req, res) => {
  const { name, brand, price, old_price, image, category, vendor, is_sale, is_new } = req.body;
  db.run(
    `UPDATE products SET name=?, brand=?, price=?, old_price=?, image=?, category=?, vendor=?, is_sale=?, is_new=?
     WHERE id = ?`,
    [name, brand, parseInt(price), old_price ? parseInt(old_price) : null, image, category, vendor,
     is_sale ? 1 : 0, is_new ? 1 : 0, req.params.id],
    function (err) {
      if (err) return res.status(500).json({ error: 'Failed to update product.' });
      res.json({ message: 'Product updated.' });
    }
  );
});

// Admin: get all users
app.get('/api/admin/users', authenticateToken, requireAdmin, (req, res) => {
  db.all('SELECT id, name, email, role, created_at FROM users ORDER BY created_at DESC', [], (err, rows) => {
    if (err) return res.status(500).json({ error: 'Database error' });
    res.json(rows);
  });
});

// ─── Server Start ─────────────────────────────────────────────────────────────
const server = app.listen(PORT, () => {
  console.log(`Backend server listening on http://localhost:${PORT}`);
});

server.on('error', (err) => {
  console.error('Server error:', err);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
});

setInterval(() => {}, 1000000);
