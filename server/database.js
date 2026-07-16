// server/database.js
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'babyplanet.db');

const db = new sqlite3.Database(DB_PATH);

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
      created_at TEXT DEFAULT (datetime('now'))
    )
  `);
});

module.exports = db;
