// server.js
const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.json()); // JSON formatındaki POST isteklerini işler
app.use(cors()); // CORS politikalarını etkinleştir
app.use(express.static('public')); // Statik dosyaları (index.html gibi) sunmak için

// SQLite veritabanı bağlantısı
const db = new sqlite3.Database('./employees.db', (err) => {
    if (err) {
        console.error('Veritabanı bağlantı hatası:', err.message);
    } else {
        console.log('SQLite veritabanına başarıyla bağlanıldı.');
    }
});

// Veritabanı tablo oluşturma (eğer yoksa)
db.run(`
    CREATE TABLE IF NOT EXISTS employees (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        first_name TEXT,
        last_name TEXT,
        email TEXT,
        phone TEXT,
        fin_code TEXT
    )
`, (err) => {
    if (err) {
        console.error('Tablo oluşturulurken hata oluştu:', err.message);
    } else {
        console.log('Tablo başarıyla oluşturuldu veya zaten mevcut.');
    }
});

// Ana sayfa rotası
app.get('/', (req, res) => {
    res.send('Employee Search API is running. Use POST /employees to add data.');
});

// Çalışan ekleme rotası
app.post('/employees', (req, res) => {
    const { first_name, last_name, email, phone, fin_code } = req.body;

    if (!first_name || !last_name || !email || !phone || !fin_code) {
        return res.status(400).send('Tüm alanlar doldurulmalıdır!');
    }

    const query = `
        INSERT INTO employees (first_name, last_name, email, phone, fin_code)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [first_name, last_name, email, phone, fin_code], function (err) {
        if (err) {
            console.error('Veri eklenirken hata oluştu:', err.message);
            res.status(500).send('Bir hata oluştu!');
        } else {
            res.status(201).send({ message: 'Çalışan başarıyla eklendi!', id: this.lastID });
        }
    });
});

// Çalışanları arama rotası
app.get('/employees', (req, res) => {
    const { name } = req.query;

    const query = `
        SELECT * FROM employees
        WHERE first_name LIKE ? OR last_name LIKE ?
    `;

    db.all(query, [`%${name}%`, `%${name}%`], (err, rows) => {
        if (err) {
            console.error('Veri sorgulanırken hata oluştu:', err.message);
            res.status(500).send('Bir hata oluştu!');
        } else {
            res.status(200).json(rows);
        }
    });
});

// Sunucuyu başlat
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
