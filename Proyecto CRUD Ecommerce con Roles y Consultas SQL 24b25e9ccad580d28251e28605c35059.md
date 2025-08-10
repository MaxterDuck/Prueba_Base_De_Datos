# Proyecto CRUD Ecommerce con Roles y Consultas SQL

Este proyecto implementa un sistema básico CRUD para un ecommerce con roles de usuarios (admin y usuario normal), con base de datos MySQL, backend en Node.js y un frontend simple.

---

## Contenido

- `backend/` - Código del servidor Node.js
- `frontend/` - Archivos del cliente web (HTML, CSS, JS)
- Base de datos MySQL con tablas, triggers, procedimientos y vistas

---

## Requisitos

- MySQL o MariaDB instalado (recomendado versión 8+)
- Node.js y npm instalados
- Cliente REST (Postman o similar) para probar API
- Navegador web para frontend

---

## Configuración y ejecución paso a paso

### 1. Crear y preparar la base de datos

1. Abre tu gestor de base de datos (DBeaver, MySQL Workbench, etc.)
2. Ejecuta el script SQL completo proporcionado para crear la base de datos `ecommerce` y todas las tablas, datos iniciales, triggers, procedimientos y vistas.

El script incluye:

- Creación de la base de datos y tablas: `roles`, `usuarios`, `productos`, `pedidos`, `detalle_pedido`, `historial_stock`
- Inserción de datos iniciales para roles, usuarios y productos
- Trigger para registrar historial de stock
- Procedimiento almacenado para insertar pedidos
- Vista para consultar pedidos con información de usuario y rol
- Varias consultas adicionales para reportes y análisis

---

### 2. Configurar el backend (servidor)

1. Abre una terminal y navega a la carpeta `backend`
2. Instala las dependencias con:

```bash

npm install

```

1. Configura los datos de conexión a MySQL en el archivo `db.js` (usuario, contraseña, host, puerto, nombre de base de datos).
2. Inicia el servidor:

```bash

node server.js

```

El servidor escuchará en `http://localhost:3000`

---

### 3. Probar la API REST

Con Postman u otra herramienta similar, prueba las rutas disponibles:

- Obtener productos: `GET http://localhost:3000/productos`
- Crear producto: `POST http://localhost:3000/productos`
- Actualizar producto: `PUT http://localhost:3000/productos/:id`
- Eliminar producto: `DELETE http://localhost:3000/productos/:id`

Puedes consultar el archivo `routes.js` para ver todas las rutas disponibles.

---

### 4. Ejecutar el frontend

1. Abre la carpeta `frontend`
2. Abre el archivo `index.html` en tu navegador (doble click o `Live Server` si usas VSCode)

Desde la interfaz web podrás visualizar y manipular productos conectándote al backend.

---

## Estructura de carpetas y archivos

```
bash
CopyEdit
backend/
├── db.js          # Configuración y conexión a MySQL
├── routes.js      # Definición de rutas API
├── server.js      # Archivo principal del servidor
├── package.json   # Dependencias Node.js
└── uploads/       # Carpeta para archivos estáticos (si aplica)

frontend/
├── app.js         # Lógica del frontend con JS
├── index.html     # Página principal
└── style.css      # Estilos CSS

```

---

## Base de datos

- Base de datos: `ecommerce`
- Tablas principales: `roles`, `usuarios`, `productos`, `pedidos`, `detalle_pedido`, `historial_stock`
- Roles: `admin`, `usuario`
- Usuarios de prueba incluidos con contraseñas simples
- Trigger para historial de stock y procedimiento para insertar pedidos

---

---

## Notas

- Recuerda cambiar las credenciales en `db.js` según tu configuración local.
- El procedimiento `insertar_pedido` debe invocarse desde MySQL para simular la inserción de pedidos.
- El trigger `after_stock_update` registra automáticamente los cambios en el stock.
- Puedes ampliar el frontend para integrar otras funcionalidades.