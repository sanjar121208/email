const path = require('path');
const sqlite3 = require('sqlite3').verbose();

const dbPath = path.join(__dirname, 'memorial.db');
const db = new sqlite3.Database(dbPath);

function initDb() {
  db.serialize(() => {
    db.run(`
      CREATE TABLE IF NOT EXISTS monuments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        material TEXT NOT NULL,
        price INTEGER NOT NULL,
        image_url TEXT
      )
    `);

    db.run(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        customer_name TEXT NOT NULL,
        phone TEXT NOT NULL,
        monument_id INTEGER NOT NULL,
        comment TEXT,
        created_at TEXT DEFAULT (datetime('now')),
        FOREIGN KEY(monument_id) REFERENCES monuments(id)
      )
    `);

    db.get('SELECT COUNT(*) as total FROM monuments', (err, row) => {
      if (err) {
        console.error('Database seed check error:', err.message);
        return;
      }

      if (row.total === 0) {
        const seed = db.prepare(
          'INSERT INTO monuments (name, material, price, image_url) VALUES (?, ?, ?, ?)'
        );

        seed.run('Классический памятник', 'Гранит', 65000, 'https://images.unsplash.com/photo-1600488990586-7f6f31d5f11d?auto=format&fit=crop&w=800&q=80');
        seed.run('Семейный мемориал', 'Мрамор', 120000, 'https://images.unsplash.com/photo-1564760055775-d63b17a55c44?auto=format&fit=crop&w=800&q=80');
        seed.run('Мини-стела', 'Габбро-диабаз', 38000, 'https://images.unsplash.com/photo-1523419409543-4f603fbf7e65?auto=format&fit=crop&w=800&q=80');
        seed.finalize();
      }
    });
  });
}

module.exports = { db, initDb };
