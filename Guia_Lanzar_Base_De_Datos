# 🚀 Guía para instalar y configurar Docker + MySQL + DBeaver en Ubuntu

Este documento explica paso a paso cómo instalar **Docker**, correr un contenedor de **MySQL** y conectarlo a **DBeaver** para pruebas o desarrollo.

---

## **1️⃣ Instalar Docker**

```bash
# Actualizamos la lista de paquetes disponibles
sudo apt update

# Instalamos dependencias necesarias para que apt pueda usar repositorios HTTPS
sudo apt install apt-transport-https ca-certificates curl software-properties-common -y
```

---

## **2️⃣ Descargar e instalar la clave GPG oficial de Docker**

```bash
# Descargamos la clave GPG oficial de Docker y la guardamos en la carpeta de llaves del sistema
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo gpg --dearmor -o /usr/share/keyrings/docker.gpg
```

---

## **3️⃣ Añadir el repositorio oficial de Docker a APT**

```bash
# Agregamos el repositorio estable de Docker para Ubuntu a nuestra lista de fuentes
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable" | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null
```

---

## **4️⃣ Instalar Docker Engine**

```bash
# Actualizamos nuevamente la lista de paquetes para incluir Docker
sudo apt update

# Instalamos Docker CE (Community Edition), su CLI y containerd
sudo apt install docker-ce docker-ce-cli containerd.io -y
```

---

## **5️⃣ Verificar instalación de Docker**

```bash
# Mostramos la versión instalada de Docker
docker --version
```

---

## **6️⃣ Instalar DBeaver**

> Asegúrate de tener DBeaver instalado.  
> Puedes abrirlo con el comando:
```bash
dbeaver-ce
# o
dbeaver
# o (dependiendo de la versión instalada)
dbeaver-le
```

---

## **7️⃣ Ejecutar contenedor MySQL con Docker**

```bash
# Ejecutamos un contenedor MySQL llamado "mysql-crud" en segundo plano
# -e MYSQL_ROOT_PASSWORD=admin  → Contraseña del usuario root
# -e MYSQL_DATABASE=crud_exam   → Base de datos inicial
# -p 3307:3306                  → Mapeo de puertos (local:contenedor)
# -d mysql:8.0                  → Imagen de MySQL versión 8.0
sudo docker run --name mysql-crud -e MYSQL_ROOT_PASSWORD=admin -e MYSQL_DATABASE=crud_exam -p 3307:3306 -d mysql:8.0
```

---

## **8️⃣ Dar permisos para usar Docker sin sudo (opcional)**

```bash
# Añadimos el usuario actual al grupo "docker"
sudo usermod -aG docker $USER

# Aplicamos los cambios sin necesidad de reiniciar sesión
newgrp docker
```

---

## **9️⃣ Probar que Docker funciona correctamente**

```bash
# Lista de contenedores activos
docker ps
```

Si no te pide permisos de `sudo`, ya está listo.

---

## **🔟 Solución al error "Public Key Retrieval is not allowed" en DBeaver**

Si al conectar MySQL en DBeaver te sale este error, sigue estos pasos:

1. Abre **Driver Properties** en DBeaver.
2. Busca la propiedad `allowPublicKeyRetrieval`:
   - Si no existe, créala.
   - Ponla en `true`.

```properties
allowPublicKeyRetrieval=true
```

3. Busca la propiedad `useSSL` y ponla en `false`:

```properties
useSSL=false
```

---

✅ Con estos pasos ya tendrás **Docker**, **MySQL** y **DBeaver** funcionando para tu entorno de desarrollo.

---
