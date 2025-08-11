// routes.js
const express = require("express");
const router = express.Router();
const db = require("./db");

// Obtener todos los productos
router.get("/productos", (req, res) => {
    db.query("SELECT * FROM productos", (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// Agregar producto
router.post("/productos", (req, res) => {
    const { nombre, precio, stock } = req.body;
    db.query(
        "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
        [nombre, precio, stock],
        (err, result) => {
            if (err) throw err;
            res.json({ mensaje: "✅ Producto agregado" });
        }
    );
});

// Eliminar producto
router.delete("/productos/:id", (req, res) => {
    const { id } = req.params;
    db.query("DELETE FROM productos WHERE id = ?", [id], (err, result) => {
        if (err) throw err;
        res.json({ mensaje: "🗑️ Producto eliminado" });
    });
});

module.exports = router;
