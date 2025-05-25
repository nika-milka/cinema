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

app.get('/api/sessions/:cinemaId', async (req, res) => {
    try {
        const { cinemaId } = req.params;
        const result = await pool.query(`
            SELECT 
                s.session_id, 
                s.start_time, 
                s.end_time,
                s.price,
                m.movie_id,
                m.title as movie_title, 
                m.duration,
                m.age_restriction,
                g.name as genre_name,
                h.hall_id,
                h.hall_code,
                h.seats,
                ht.type_name as hall_type_name
            FROM sessions s
            JOIN movies m ON s.movie_id = m.movie_id
            JOIN genres g ON m.genre_id = g.genre_id
            JOIN halls h ON s.hall_id = h.hall_id
            LEFT JOIN hall_types ht ON h.type_id = ht.type_id
            WHERE h.cinema_id = $1
            ORDER BY s.start_time
        `, [cinemaId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sessions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/sessions/:cinemaId', async (req, res) => {
    try {
        const { cinemaId } = req.params;
        const result = await pool.query(`
            SELECT 
                s.session_id, 
                s.start_time, 
                s.end_time,
                s.price,
                m.movie_id,
                m.title as movie_title, 
                m.duration,
                m.age_restriction,
                g.name as genre_name,
                h.hall_id,
                h.hall_code,
                h.seats,
                ht.type_name as hall_type_name
            FROM sessions s
            JOIN movies m ON s.movie_id = m.movie_id
            JOIN genres g ON m.genre_id = g.genre_id
            JOIN halls h ON s.hall_id = h.hall_id
            LEFT JOIN hall_types ht ON h.type_id = ht.type_id
            WHERE h.cinema_id = $1
            ORDER BY s.start_time
        `, [cinemaId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sessions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.get('/api/sessions/:cinemaId', async (req, res) => {
    try {
        const { cinemaId } = req.params;
        const result = await pool.query(`
            SELECT s.session_id, s.start_time, s.end_time, 
                   m.title as movie_title, m.duration, m.genre
            FROM sessions s
            JOIN movies m ON s.movie_id = m.movie_id
            WHERE s.cinema_id = $1
            ORDER BY s.start_time
        `, [cinemaId]);
        
        res.json(result.rows);
    } catch (err) {
        console.error('Error fetching sessions:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Serve session.html
app.get('/session.html', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/session.html'));
});