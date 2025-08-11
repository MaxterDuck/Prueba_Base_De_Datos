// db.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',   // Usa tu contraseña real de MySQL
  database: 'ecommerce', // Cambié a la base de datos correcta
  port: 3307            // Puerto correcto
});

connection.connect(err => {
    if (err) {
        console.error('❌ Error conectando a MySQL:', err);
        return;
    }
    console.log('✅ Conectado a MySQL');
});

module.exports = connection;
