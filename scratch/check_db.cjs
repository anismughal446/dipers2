const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const dbPath = path.join(__dirname, 'server', 'babyplanet.db');
const db = new sqlite3.Database(dbPath);

db.all('SELECT category, COUNT(*) as count FROM products GROUP BY category', [], (err, rows) => {
  if (err) throw err;
  console.log("Categories in DB:");
  rows.forEach(r => console.log(`${r.category}: ${r.count} products`));
  db.close();
});
