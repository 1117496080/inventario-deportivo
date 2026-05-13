// usuario.js - CRUD de usuarios usando JavaScript puro y backend en localhost:8080/api

const BASE_URL = 'http://localhost:8080/api';
const usuariosBody = document.getElementById('usuarios-body');
const btnAgregarUsuario = document.getElementById('btn-agregar-usuario');

document.addEventListener('DOMContentLoaded', cargarUsuarios);
btnAgregarUsuario.addEventListener('click', agregarUsuario);
usuariosBody.addEventListener('click', async (event) => {
    const button = event.target;
    if (button.classList.contains('btn-actualizar')) {
        await actualizarUsuario(button.dataset.id);
    } else if (button.classList.contains('btn-eliminar')) {
        await eliminarUsuario(button.dataset.id);
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

async function cargarUsuarios() {
    try {
        const usuarios = await apiGet('/usuarios');
        usuariosBody.innerHTML = '';

        usuarios.forEach(usuario => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td><input type="text" value="${usuario.nombre}" data-field="nombre"></td>
                <td><input type="email" value="${usuario.correo}" data-field="correo"></td>
                <td><input type="number" value="${usuario.edad}" data-field="edad"></td>
                <td><input type="text" value="${usuario.rol}" data-field="rol"></td>
                <td>
                    <select data-field="estado">
                        <option value="true" ${usuario.estado ? 'selected' : ''}>Activo</option>
                        <option value="false" ${!usuario.estado ? 'selected' : ''}>Inactivo</option>
                    </select>
                </td>
                <td>
                    <button class="btn-actualizar" data-id="${usuario.id}">Actualizar</button>
                    <button class="btn-eliminar" data-id="${usuario.id}">Eliminar</button>
                </td>
            `;
            usuariosBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        alert('No se pudieron cargar los usuarios. Revisa la conexión con el backend.');
    }
}

async function agregarUsuario(event) {
    event.preventDefault();

    const nombre = document.getElementById('nuevo-nombre-usuario').value.trim();
    const correo = document.getElementById('nuevo-correo').value.trim();
    const edad = parseInt(document.getElementById('nuevo-edad').value, 10);
    const rol = document.getElementById('nuevo-rol').value.trim();
    const estado = document.getElementById('nuevo-estado').value === 'true';
    const contraseña = document.getElementById('nuevo-contraseña').value.trim();

    if (!nombre || !correo || isNaN(edad) || !rol || !contraseña) {
        alert('Todos los campos son requeridos y válidos.');
        return;
    }

    try {
        await apiPost('/usuarios', { nombre, correo, edad, rol, estado, contraseña });
        document.getElementById('nuevo-nombre-usuario').value = '';
        document.getElementById('nuevo-correo').value = '';
        document.getElementById('nuevo-edad').value = '';
        document.getElementById('nuevo-rol').value = '';
        document.getElementById('nuevo-estado').value = 'true';
        document.getElementById('nuevo-contraseña').value = '';
        await cargarUsuarios();
    } catch (error) {
        console.error('Error agregando usuario:', error);
        alert('Error agregando el usuario. Revisa el backend.');
    }
}

async function actualizarUsuario(id) {
    const row = document.querySelector(`button[data-id="${id}"]`).closest('tr');
    const inputs = row.querySelectorAll('input[data-field], select[data-field]');
    const data = {};

    inputs.forEach(input => {
        const field = input.dataset.field;
        if (field === 'edad') {
            data[field] = parseInt(input.value, 10);
        } else if (field === 'estado') {
            data[field] = input.value === 'true';
        } else {
            data[field] = input.value.trim();
        }
    });

    if (!data.nombre || !data.correo || isNaN(data.edad) || !data.rol) {
        alert('Todos los campos son requeridos y válidos.');
        return;
    }

    try {
        await apiPut(`/usuarios/${id}`, data);
        await cargarUsuarios();
    } catch (error) {
        console.error('Error actualizando usuario:', error);
        alert('Error actualizando el usuario. Revisa el backend.');
    }
}

async function eliminarUsuario(id) {
    if (!confirm('¿Estás seguro de eliminar este usuario?')) return;

    try {
        await apiDelete(`/usuarios/${id}`);
        await cargarUsuarios();
    } catch (error) {
        console.error('Error eliminando usuario:', error);
        alert('Error eliminando el usuario. Revisa el backend.');
    }
}
