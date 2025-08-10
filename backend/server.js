const express = require('express');
const cors = require('cors');
const db = require('./db');
const path = require('path');
const multer = require('multer');
const fs = require('fs');
const csv = require('csv-parser');

const app = express();

app.use(cors());
app.use(express.json());

// Servir archivos del frontend
app.use(express.static(path.join(__dirname, '../frontend')));

// ========== RUTAS CRUD ==========

// GET todos los productos
app.get('/productos', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener productos' });
        res.json(results);
    });
});

// GET producto por ID
app.get('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al obtener producto' });
        res.json(results[0]);
    });
});

// POST nuevo producto
app.post('/productos', (req, res) => {
    const { nombre, descripcion, precio, stock } = req.body;
    db.query(
        'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES (?, ?, ?, ?)',
        [nombre, descripcion, precio, stock],
        (err, result) => {
            if (err) return res.status(500).json({ error: 'Error creando producto' });
            res.json({ id: result.insertId, ...req.body });
        }
    );
});

// PUT actualizar producto
app.put('/productos/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, descripcion, precio, stock } = req.body;
    db.query(
        'UPDATE productos SET nombre = ?, descripcion = ?, precio = ?, stock = ? WHERE id = ?',
        [nombre, descripcion, precio, stock, id],
        (err) => {
            if (err) return res.status(500).json({ error: 'Error actualizando producto' });
            res.json({ id, ...req.body });
        }
    );
});

// DELETE producto
app.delete('/productos/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: 'Error eliminando producto' });
        res.status(204).send();
    });
});

// ========== CARGA DE CSV ==========

const upload = multer({ dest: 'uploads/' });

app.post('/upload-csv', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ error: 'No se recibió ningún archivo' });
    }
    const filePath = req.file.path;
    const productos = [];

    fs.createReadStream(filePath)
        .pipe(csv())
        .on('data', (row) => {
            if (
                row.nombre && row.descripcion &&
                !isNaN(parseFloat(row.precio)) &&
                !isNaN(parseInt(row.stock))
            ) {
                productos.push({
                    nombre: row.nombre,
                    descripcion: row.descripcion,
                    precio: parseFloat(row.precio),
                    stock: parseInt(row.stock)
                });
            }
        })
        .on('end', () => {
            fs.unlinkSync(filePath);
            if (productos.length === 0) {
                return res.status(400).json({ error: 'El archivo CSV no contiene productos válidos.' });
            }
            const insertQuery = 'INSERT INTO productos (nombre, descripcion, precio, stock) VALUES ?';
            const values = productos.map(p => [p.nombre, p.descripcion, p.precio, p.stock]);

            db.query(insertQuery, [values], (err) => {
                if (err) return res.status(500).json({ error: 'Error al importar CSV' });
                res.json({ mensaje: '✅ CSV importado exitosamente' });
            });
        })
        .on('error', (error) => {
            fs.unlinkSync(filePath);
            return res.status(500).json({ error: 'Error leyendo archivo CSV' });
        });
});

// ========== FRONTEND ==========

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

// ========== START ==========

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`✅ Servidor backend corriendo en http://localhost:${PORT}`);
});
