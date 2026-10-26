// server/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'babyplanet.db');

const db = new sqlite3.Database(DB_PATH);

// Seed the storefront diaper range without replacing the local database file.
const diaperPackSeeds = [
  ['Pampers Skin Comfort Diapers Size 4 (50 Pcs)', 'Pampers', 2850, 'https://bebambi.com/cdn/shop/files/Pamperssize450pcs.png?v=1742108792', 'Pampers'],
  ['Molfix Maxi Diapers Size 4 (72 Pcs)', 'Molfix', 3649, 'https://media.naheed.pk/catalog/product/cache/ff36c7bc52e2e5dbc63cd67fba513679/1/2/1272656-rpl-1.jpg', 'Molfix'],
  ['Canbebe Maxi Diapers Size 4 (50 Pcs)', 'Canbebe', 2850, 'https://bebambi.com/cdn/shop/files/Canbebesize470.png?v=1742108832', 'Canbebe'],
  ['Huggies Dry Diapers XL (62 Pcs)', 'Huggies', 3200, 'https://www.cartpk.com/media/catalog/product/cache/ccf016c098f64509830f131aff46d4ef/h/u/huggies_dry_diapers_xl_pack_of_62_.png', 'Huggies'],
  ['Bona Papa Magic Diapers Size 4 Large (80 Pcs)', 'Bona Papa', 2595, 'https://static-01.daraz.pk/p/cd212e45b4e8fa0d28bd8038d52f5289.jpg', 'Bona Papa'],
  ['Good Care Baby Diapers Size 4 Large (40 Pcs)', 'Good Care', 1200, 'https://www.myvitaminstore.pk/cdn/shop/files/good-care-baby-diaper-size-4-large-40-ct-863207.jpg?v=1713779607&width=1445', 'Good Care'],
  ['Shield Premium Baby Diapers Size 4 Large (54 Pcs)', 'Shield', 1699, 'https://cdn.shopify.com/s/files/1/0673/3008/1007/files/Mega-Premium-Diaper-Large.jpg?v=1709881459', 'Shield'],
];

db.serialize(() => {
  // Products table
  db.run(`
    CREATE TABLE IF NOT EXISTS products (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      brand TEXT NOT NULL,
      price INTEGER NOT NULL,
      old_price INTEGER,
      image TEXT NOT NULL,
      category TEXT NOT NULL,
      vendor TEXT NOT NULL,
      is_sale INTEGER DEFAULT 0,
      is_new INTEGER DEFAULT 0,
      stock INTEGER DEFAULT 100
    )
  `);

  diaperPackSeeds.forEach(([name, brand, price, image, vendor]) => {
    db.run(
      `INSERT INTO products (name, brand, price, image, category, vendor, is_sale, is_new, stock)
       SELECT ?, ?, ?, ?, 'diapering', ?, 0, 1, 10
       WHERE NOT EXISTS (SELECT 1 FROM products WHERE brand = ? AND name = ?)`,
      [name, brand, price, image, vendor, brand, name],
      (err) => { if (err) console.error(`Could not seed ${brand} diaper pack:`, err.message); }
    );
  });

  // Add stock column if it doesn't exist (migration for existing DB)
  db.run(`ALTER TABLE products ADD COLUMN stock INTEGER DEFAULT 100`, () => {
    // Ignore error if column already exists
  });

  // Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL UNIQUE,
      password TEXT NOT NULL,
      role TEXT NOT NULL DEFAULT 'user',
      addresses TEXT NOT NULL DEFAULT '[]',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Keep existing databases compatible with profile and checkout updates.
  db.run(`ALTER TABLE users ADD COLUMN addresses TEXT NOT NULL DEFAULT '[]'`, () => {});

  db.run(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      items TEXT NOT NULL,
      shipping_address TEXT NOT NULL,
      subtotal INTEGER NOT NULL,
      shipping INTEGER NOT NULL,
      total INTEGER NOT NULL,
      payment_method TEXT NOT NULL,
      payment_status TEXT NOT NULL DEFAULT 'pending',
      status TEXT NOT NULL DEFAULT 'processing',
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

module.exports = db;
