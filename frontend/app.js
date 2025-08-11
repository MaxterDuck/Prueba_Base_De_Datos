const contenedor = document.getElementById('productos');
const form = document.getElementById('formProducto');
const inputId = document.getElementById('productoId');
const inputNombre = document.getElementById('nombre');
const inputDescripcion = document.getElementById('descripcion');
const inputPrecio = document.getElementById('precio');
const inputStock = document.getElementById('stock');
const btnCancelar = document.getElementById('btnCancelar');

const formCSV = document.getElementById('formCSV');
const mensajeCarga = document.getElementById('mensajeCarga');

// Función para cargar los productos
function cargarProductos() {
    fetch('/productos')
        .then(res => res.json())
        .then(data => {
            if (!Array.isArray(data)) {
                console.error('❌ Respuesta inesperada del servidor:', data);
                contenedor.innerHTML = '<p style="color:red;">❌ Error al cargar productos.</p>';
                return;
            }

            contenedor.innerHTML = '';
            data.forEach(producto => {
                const div = document.createElement('div');
                div.className = 'producto';
                div.innerHTML = `
                    <h3>${producto.nombre}</h3>
                    <p>${producto.descripcion}</p>
                    <p>Precio: $${producto.precio}</p>
                    <p>Stock: ${producto.stock}</p>
                    <button onclick="editarProducto(${producto.id})">Editar</button>
                    <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                `;
                contenedor.appendChild(div);
            });
        })
        .catch(err => {
            console.error('❌ Error al obtener productos:', err);
            contenedor.innerHTML = '<p style="color:red;">❌ Error al obtener productos.</p>';
        });
}

// Manejo de formulario de productos (Agregar o Editar)
form.addEventListener('submit', e => {
    e.preventDefault();
    const id = inputId.value;
    const producto = {
        nombre: inputNombre.value,
        descripcion: inputDescripcion.value,
        precio: parseFloat(inputPrecio.value),
        stock: parseInt(inputStock.value)
    };

    const url = id ? `/productos/${id}` : '/productos';
    const method = id ? 'PUT' : 'POST';

    fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(producto)
    })
    .then(res => {
        if (!res.ok) throw new Error('❌ Error en la operación');
        return res.json();
    })
    .then(() => {
        limpiarFormulario();
        cargarProductos();
    })
    .catch(err => alert(err.message));
});

// Función para cancelar y limpiar el formulario
btnCancelar.addEventListener('click', limpiarFormulario);

// Función para editar un producto
function editarProducto(id) {
    fetch(`/productos/${id}`)
        .then(res => res.json())
        .then(producto => {
            inputId.value = producto.id;
            inputNombre.value = producto.nombre;
            inputDescripcion.value = producto.descripcion;
            inputPrecio.value = producto.precio;
            inputStock.value = producto.stock;
            btnCancelar.style.display = 'inline';
        })
        .catch(err => {
            console.error('❌ Error al obtener producto para editar:', err);
            alert('❌ Error al cargar el producto.');
        });
}

// Función para eliminar un producto
function eliminarProducto(id) {
    if (confirm('¿Seguro que quieres eliminar este producto?')) {
        fetch(`/productos/${id}`, { method: 'DELETE' })
            .then(res => {
                if (!res.ok) throw new Error('❌ Error eliminando producto');
                cargarProductos();
            })
            .catch(err => alert(err.message));
    }
}

// Función para limpiar el formulario
function limpiarFormulario() {
    inputId.value = '';
    inputNombre.value = '';
    inputDescripcion.value = '';
    inputPrecio.value = '';
    inputStock.value = '';
    btnCancelar.style.display = 'none';
}

// Manejo de carga CSV
formCSV.addEventListener('submit', e => {
    e.preventDefault();
    const fileInput = document.getElementById('csvFile');
    if (!fileInput.files.length) {
        alert('Selecciona un archivo CSV o TXT');
        return;
    }
    const file = fileInput.files[0];
    const formData = new FormData();
    formData.append('file', file);

    fetch('/upload-csv', {
        method: 'POST',
        body: formData
    })
    .then(res => res.json())
    .then(data => {
        if (data.error) {
            mensajeCarga.innerText = '❌ Error: ' + data.error;
            mensajeCarga.style.color = 'red';
        } else {
            mensajeCarga.innerText = '✅ ' + data.mensaje;
            mensajeCarga.style.color = 'green';
            cargarProductos();  // Refrescar la lista de productos
            formCSV.reset();
        }
    })
    .catch(() => {
        mensajeCarga.innerText = '❌ Error al subir archivo';
        mensajeCarga.style.color = 'red';
    });
});

// Cargar productos al inicio
cargarProductos();
