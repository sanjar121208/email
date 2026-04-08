const path = require('path');
const express = require('express');
const { db, initDb } = require('./db/database');

const app = express();
const PORT = process.env.PORT || 3000;

initDb();

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/monuments', (_, res) => {
  db.all('SELECT * FROM monuments ORDER BY id DESC', (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка получения памятников' });
    }
    return res.json(rows);
  });
});

app.post('/api/orders', (req, res) => {
  const { customerName, phone, monumentId, comment } = req.body;

  if (!customerName || !phone || !monumentId) {
    return res.status(400).json({ error: 'Заполните обязательные поля' });
  }

  const sql = `
    INSERT INTO orders (customer_name, phone, monument_id, comment)
    VALUES (?, ?, ?, ?)
  `;

  db.run(sql, [customerName, phone, monumentId, comment || ''], function onInsert(err) {
    if (err) {
      return res.status(500).json({ error: 'Ошибка сохранения заявки' });
    }

    return res.status(201).json({
      message: 'Заявка принята',
      orderId: this.lastID
    });
  });
});

app.get('/api/orders', (_, res) => {
  const sql = `
    SELECT o.id, o.customer_name, o.phone, o.comment, o.created_at, m.name AS monument_name
    FROM orders o
    JOIN monuments m ON m.id = o.monument_id
    ORDER BY o.id DESC
  `;

  db.all(sql, (err, rows) => {
    if (err) {
      return res.status(500).json({ error: 'Ошибка получения заявок' });
    }

    return res.json(rows);
  });
});

app.listen(PORT, () => {
  console.log(`Server started: http://localhost:${PORT}`);
});
