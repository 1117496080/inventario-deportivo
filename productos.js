// productos.js - CRUD de productos usando JavaScript puro y backend en localhost:8080/api

const BASE_URL = 'http://localhost:8080/api';
const productosBody = document.getElementById('productos-body');
const btnAgregarProducto = document.getElementById('btn-agregar');

document.addEventListener('DOMContentLoaded', cargarProductos);
btnAgregarProducto.addEventListener('click', agregarProducto);
productosBody.addEventListener('click', async (event) => {
    const button = event.target;
    if (button.classList.contains('btn-actualizar')) {
        await actualizarProducto(button.dataset.id);
    } else if (button.classList.contains('btn-eliminar')) {
        await eliminarProducto(button.dataset.id);
    }
});

async function apiGet(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Error GET ${endpoint}: ${response.status}`);
    return response.json();
}

async function apiPost(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Error POST ${endpoint}: ${response.status}`);
    return response.json();
}

async function apiPut(endpoint, data) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error(`Error PUT ${endpoint}: ${response.status}`);
    return response.json();
}

async function apiDelete(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
        method: 'DELETE'
    });
    if (!response.ok) throw new Error(`Error DELETE ${endpoint}: ${response.status}`);
    return response;
}

async function cargarProductos() {
    try {
        const productos = await apiGet('/productos');
        productosBody.innerHTML = '';

        productos.forEach(producto => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${producto.nombre}" data-field="nombre"></td>
                <td><input type="number" value="${producto.stock}" data-field="stock"></td>
                <td><input type="number" step="0.01" value="${producto.precio}" data-field="precio"></td>
                <td><input type="text" value="${producto.categoria}" data-field="categoria"></td>
                <td>
                    <button class="btn-actualizar" data-id="${producto.id}">Actualizar</button>
                    <button class="btn-eliminar" data-id="${producto.id}">Eliminar</button>
                </td>
            `;
            productosBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando productos:', error);
        alert('No se pudieron cargar los productos. Revisa la conexión con el backend.');
    }
}

async function agregarProducto() {
    const nombre = document.getElementById('nuevo-nombre').value.trim();
    const stock = parseInt(document.getElementById('nuevo-stock').value, 10);
    const precio = parseFloat(document.getElementById('nuevo-precio').value);
    const categoria = document.getElementById('nuevo-categoria').value.trim();

    if (!nombre || isNaN(stock) || isNaN(precio) || !categoria) {
        alert('Todos los campos son requeridos e inválidos.');
        return;
    }

    try {
        await apiPost('/productos', { nombre, precio, stock, categoria });
        document.getElementById('nuevo-nombre').value = '';
        document.getElementById('nuevo-stock').value = '';
        document.getElementById('nuevo-precio').value = '';
        document.getElementById('nuevo-categoria').value = '';
        await cargarProductos();
    } catch (error) {
        console.error('Error agregando producto:', error);
        alert('Error agregando el producto. Revisa el backend.');
    }
}

async function actualizarProducto(id) {
    const row = document.querySelector(`button[data-id="${id}"]`).closest('tr');
    const inputs = row.querySelectorAll('input[data-field]');
    const data = {};

    inputs.forEach(input => {
        const field = input.dataset.field;
        const value = input.type === 'number' ? parseFloat(input.value) : input.value.trim();
        data[field] = value;
    });

    if (!data.nombre || isNaN(data.stock) || isNaN(data.precio) || !data.categoria) {
        alert('Todos los campos son requeridos y deben ser válidos.');
        return;
    }

    try {
        await apiPut(`/productos/${id}`, data);
        await cargarProductos();
    } catch (error) {
        console.error('Error actualizando producto:', error);
        alert('Error actualizando el producto. Revisa el backend.');
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;

    try {
        await apiDelete(`/productos/${id}`);
        await cargarProductos();
    } catch (error) {
        console.error('Error eliminando producto:', error);
        alert('Error eliminando el producto. Revisa el backend.');
    }
}
