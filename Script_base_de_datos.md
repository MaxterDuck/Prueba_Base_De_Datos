# Script base de datos sql

```jsx
# Vamos a combinar el primer script (base ecommerce) con el segundo script (roles, consultas, subconsultas)
# para generar un único script final que el usuario pueda ejecutar directamente en DBeaver.

# Script final
final_sql = """
-- ===================================================
-- SCRIPT COMPLETO PARA CREAR BASE DE DATOS ECOMMERCE
-- CON ROLES, USUARIOS, CRUD BÁSICO Y CONSULTAS
-- ===================================================

-- 1. Crear base de datos
DROP DATABASE IF EXISTS ecommerce;
CREATE DATABASE ecommerce;
USE ecommerce;

-- 2. Tabla de roles
CREATE TABLE roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(50) NOT NULL
);

INSERT INTO roles (nombre) VALUES ('admin'), ('usuario');

-- 3. Tabla de usuarios
CREATE TABLE usuarios (
	id INT PRIMARY KEY AUTO_INCREMENT,
	nombre VARCHAR(100) NOT NULL,
	email VARCHAR(100) UNIQUE NOT NULL,
	usuario VARCHAR(50) UNIQUE NOT NULL,
	contraseña VARCHAR (255) NOT NULL,
	rol_id INT NOT NULL,
	FOREIGN KEY (rol_id) REFERENCES roles(id)
);

INSERT INTO usuarios (nombre, email, usuario, contraseña, rol_id) VALUES
('Administrador General', 'admin@ecommerce.com', 'admin', 'admin123', 1),
('Juan Pérez', 'juan@correo.com', 'juanp', '1234', 2),
('Ana López', 'ana@correo.com', 'anal', '5678', 2);

-- 4. Tabla de productos
CREATE TABLE productos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT,
    precio DECIMAL(10,2) NOT NULL,
    stock INT NOT NULL
);

INSERT INTO productos (nombre, descripcion, precio, stock) VALUES
('Laptop', 'Laptop de alto rendimiento', 3500.00, 10),
('Teléfono', 'Teléfono inteligente 128GB', 1200.00, 20),
('Audífonos', 'Audífonos inalámbricos', 300.00, 50);

-- 5. Tabla de pedidos
CREATE TABLE pedidos (
    id INT PRIMARY KEY AUTO_INCREMENT,
    usuario_id INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- 6. Tabla detalle de pedido
CREATE TABLE detalle_pedido (
    id INT PRIMARY KEY AUTO_INCREMENT,
    pedido_id INT NOT NULL,
    producto_id INT NOT NULL,
    cantidad INT NOT NULL,
    precio_unitario DECIMAL(10,2) NOT NULL,
    FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- 7. Tabla historial de cambios de stock
CREATE TABLE historial_stock (
    id INT PRIMARY KEY AUTO_INCREMENT,
    producto_id INT NOT NULL,
    cambio INT NOT NULL,
    fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

-- TRIGGER para registrar cambios de stock
DELIMITER //
CREATE TRIGGER after_stock_update
AFTER UPDATE ON productos
FOR EACH ROW
BEGIN
    INSERT INTO historial_stock (producto_id, cambio)
    VALUES (NEW.id, NEW.stock - OLD.stock);
END //
DELIMITER ;

-- PROCEDIMIENTO para insertar pedido
DELIMITER //
CREATE PROCEDURE insertar_pedido(
    IN p_usuario_id INT,
    IN p_producto_id INT,
    IN p_cantidad INT
)
BEGIN
    DECLARE v_precio DECIMAL(10,2);
    DECLARE v_pedido_id INT;

    SELECT precio INTO v_precio FROM productos WHERE id = p_producto_id;

    INSERT INTO pedidos (usuario_id) VALUES (p_usuario_id);
    SET v_pedido_id = LAST_INSERT_ID();

    INSERT INTO detalle_pedido (pedido_id, producto_id, cantidad, precio_unitario)
    VALUES (v_pedido_id, p_producto_id, p_cantidad, v_precio);

    UPDATE productos SET stock = stock - p_cantidad WHERE id = p_producto_id;
END //
DELIMITER ;

-- VISTA para mostrar pedidos con usuario y rol
CREATE VIEW vista_pedidos AS
SELECT p.id AS pedido_id, u.nombre AS usuario, r.nombre AS rol, p.fecha
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
JOIN roles r ON u.rol_id = r.id;

-- ===================================================
-- CONSULTAS DE PRUEBA
-- ===================================================

-- Todos los productos
SELECT * FROM productos;

-- Usuarios con su rol
SELECT u.nombre, u.email, r.nombre AS rol
FROM usuarios u
JOIN roles r ON u.rol_id = r.id;

-- Subconsulta: productos con precio mayor al promedio
SELECT * FROM productos
WHERE precio > (SELECT AVG(precio) FROM productos);

-- Reporte de ventas por usuario
SELECT u.nombre, SUM(dp.cantidad * dp.precio_unitario) AS total_gastado
FROM pedidos p
JOIN detalle_pedido dp ON p.id = dp.pedido_id
JOIN usuarios u ON p.usuario_id = u.id
GROUP BY u.nombre;

-- Productos con stock menor a 15
SELECT nombre, stock FROM productos WHERE stock < 15;

-- Vista de pedidos
SELECT * FROM vista_pedidos;
"""

-- ===================================================
-- CONSULTAS ADICIONALES
-- ===================================================

-- 1. Últimos 5 pedidos realizados (ordenados por fecha)
SELECT p.id AS pedido_id, u.nombre AS cliente, p.fecha
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
ORDER BY p.fecha DESC
LIMIT 5;

-- 2. Total de productos vendidos por cada producto
SELECT pr.nombre, SUM(dp.cantidad) AS total_vendidos
FROM detalle_pedido dp
JOIN productos pr ON dp.producto_id = pr.id
GROUP BY pr.nombre
ORDER BY total_vendidos DESC;

-- 3. Usuarios que no han hecho pedidos
SELECT u.nombre, u.email
FROM usuarios u
LEFT JOIN pedidos p ON u.id = p.usuario_id
WHERE p.id IS NULL;

-- 4. Pedidos con total calculado (precio * cantidad)
SELECT p.id AS pedido_id, u.nombre AS cliente, 
       SUM(dp.cantidad * dp.precio_unitario) AS total_pedido
FROM pedidos p
JOIN detalle_pedido dp ON p.id = dp.pedido_id
JOIN usuarios u ON p.usuario_id = u.id
GROUP BY p.id, u.nombre;

-- 5. Subconsulta correlacionada: productos más caros que cualquier producto de menos de $500
SELECT *
FROM productos p
WHERE precio > ALL (SELECT precio FROM productos WHERE precio < 500);

-- 6. Stock histórico por producto
SELECT p.nombre, hs.cambio, hs.fecha
FROM historial_stock hs
JOIN productos p ON hs.producto_id = p.id
ORDER BY hs.fecha DESC;

-- 7. Productos nunca pedidos
SELECT pr.nombre
FROM productos pr
LEFT JOIN detalle_pedido dp ON pr.id = dp.producto_id
WHERE dp.id IS NULL;

-- 8. Pedidos realizados en el último mes
SELECT p.id AS pedido_id, u.nombre, p.fecha
FROM pedidos p
JOIN usuarios u ON p.usuario_id = u.id
WHERE p.fecha >= DATE_SUB(CURDATE(), INTERVAL 1 MONTH);

-- 9. Total gastado por cada usuario ordenado de mayor a menor
SELECT u.nombre, SUM(dp.cantidad * dp.precio_unitario) AS total_gastado
FROM pedidos p
JOIN detalle_pedido dp ON p.id = dp.pedido_id
JOIN usuarios u ON p.usuario_id = u.id
GROUP BY u.nombre
ORDER BY total_gastado DESC;

-- 10. Producto más vendido
SELECT pr.nombre, SUM(dp.cantidad) AS total_vendidos
FROM detalle_pedido dp
JOIN productos pr ON dp.producto_id = pr.id
GROUP BY pr.nombre
ORDER BY total_vendidos DESC
LIMIT 1;

```
