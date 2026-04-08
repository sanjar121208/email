# Сайт компании по изготовлению памятников

Простой full-stack проект:
- **Frontend**: HTML/CSS/JS
- **Backend**: Node.js + Express
- **База данных**: SQLite

## Структура проекта

```
.
├── package.json
├── README.md
└── src
    ├── server.js
    ├── db
    │   ├── database.js
    │   └── memorial.db (создаётся автоматически)
    └── public
        ├── index.html
        ├── script.js
        └── styles.css
```

## Запуск

```bash
npm install
npm start
```

Откройте: `http://localhost:3000`

## API

- `GET /api/monuments` — список памятников
- `POST /api/orders` — создать заявку
- `GET /api/orders` — список заявок
