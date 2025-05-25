require('dotenv').config();
const express = require('express');
const { Pool } = require('pg');
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.SERVER_PORT || 3000;

// Настройка подключения к PostgreSQL
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, '../client')));

// API endpoint для получения кинотеатров
app.get('/api/cinemas', async (req, res) => {
    try {
        const result = await pool.query('SELECT cinema_id, name, address, phone FROM cinemas');
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching cinemas:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve cinema.html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/cinema.html'));
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});