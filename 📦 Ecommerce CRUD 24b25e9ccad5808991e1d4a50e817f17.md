# 📦 Ecommerce CRUD

Este proyecto es un CRUD de productos para un sistema de **ecommerce**, compuesto por un **backend en Node.js + Express** y un **frontend** independiente.

La base de datos se ejecuta en un contenedor **MySQL 8.0** usando Docker.

---

## 🚀 Tecnologías utilizadas

- **Backend:** Node.js, Express, CORS, MySQL, Multer, CSV Parser
- **Frontend:** HTML, CSS, JavaScript (puro o framework según implementación existente)
- **Base de datos:** MySQL 8.0 (Docker)
- **Dependencias globales:** npm

---

## 📂 Estructura del proyecto

```
go
CopyEdit
ecommerce-crud/
│
├── backend/
│   ├── db.js
│   ├── routes.js
│   ├── server.js
│   ├── uploads/
│   ├── package.json
│   └── node_modules/
│
├── frontend/
│   ├── index.html
│   ├── css/
│   ├── js/
│   └── ...
│
├── package.json
└── README.md

```

---

## ⚙️ Instalación y configuración

### 1️⃣ Clonar el repositorio

```bash

git clone <URL_DEL_REPO>
cd ecommerce-crud

```

---

### 2️⃣ Iniciar base de datos en Docker

Ejecuta el contenedor de MySQL:

```bash

sudo docker run --name mysql-crud \
-e MYSQL_ROOT_PASSWORD=admin \
-e MYSQL_DATABASE=crud_exam \
-p 3307:3306 \
-d mysql:8.0

```

---

### 3️⃣ Instalar dependencias del backend

```bash

cd backend
npm install express cors mysql multer csv-parser

```

---

### 4️⃣ Configurar la base de datos

En el archivo **`db.js`** del backend, asegúrate de que la configuración coincida con el contenedor Docker:

```jsx

const mysql = require('mysql');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'crud_exam',
  port: 3307
});

connection.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a la base de datos MySQL');
});

module.exports = connection;

```

---

### 5️⃣ Iniciar el servidor backend

```bash

cd backend
node server.js

```

Por defecto se ejecutará en:

📍 [**http://localhost:3000**](http://localhost:3000/)

---

### 6️⃣ Ejecutar el frontend

Abre el archivo `index.html` del frontend en tu navegador o usa un servidor local como **Live Server** en VSCode.

---

## 📤 Subida de CSV

Para importar datos mediante CSV:

```bash

curl -F "file=@ruta/archivo.csv" http://localhost:3000/upload-csv

```

---

## 📦 Dependencias necesarias

En el backend:

```bash
npm install express cors mysql multer csv-parser

```

Si quieres instalarlas de una vez:

```bash

npm install

```

*(Si `package.json` ya las tiene registradas)*

---

## 🗃 Scripts útiles

```bash

# Iniciar contenedor MySQL
sudo docker start mysql-crud

# Detener contenedor MySQL
sudo docker stop mysql-crud

# Revisar contenedores activos
docker ps

```

---

## ✨ Notas

- El puerto de la base de datos es **3307** para evitar conflictos con MySQL local.
- La carpeta `uploads/` guarda temporalmente los archivos CSV cargados.
- Si modificas la estructura de la base de datos, actualiza el script SQL inicial y el backend en consecuencia.

---

Si quieres, puedo agregarte **el comando exacto para crear la tabla** que usa tu proyecto en MySQL y dejar el README con eso incluido.

¿Quieres que lo deje así completo con el script SQL también?