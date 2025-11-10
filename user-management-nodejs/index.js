const express = require('express');
const mysql = require('mysql2');

const PORT = 3000; // البورت اللي باش يشغل عليه السيرفر

// إعداد الاتصال بـ MySQL
const connection = mysql.createConnection({
    host: 'localhost',      // أو IP السيرفر متاعك
    user: 'root',           // اسم المستخدم متاع MySQL
    password: '',           // كلمة السر
    database: 'userdb'      // اسم قاعدة البيانات
});

// الاتصال بـ MySQL
connection.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        process.exit(1);
    }
    console.log('Connected to MySQL database');
});

const app = express();
app.use(express.json()); // باش نستقبل JSON في الريكوست

// مثال route باش نشوفوا السيرفر شغال
app.get('/', (req, res) => {
    res.send('User management service is running!');
});

app.listen(PORT, () => {
    console.log(`User management service running on port ${PORT}`);
});
