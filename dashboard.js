// dashboard.js - Obtiene datos del backend en localhost:8080/api usando JavaScript puro

const BASE_URL = 'http://localhost:8080/api';
const productosCount = document.getElementById('productos-count');
const usuariosCount = document.getElementById('usuarios-count');
const apiStatus = document.getElementById('api-status');

document.addEventListener('DOMContentLoaded', cargarDashboard);

async function apiGet(endpoint) {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(`Error GET ${endpoint}: ${response.status}`);
    return response.json();
}

async function cargarDashboard() {
    try {
        const productos = await apiGet('/productos');
        productosCount.textContent = `${productos.length} registrados`;
    } catch (error) {
        console.error('Error cargando productos:', error);
        productosCount.textContent = 'Error al cargar';
    } 

    try {
        const usuarios = await apiGet('/usuarios');
        usuariosCount.textContent = `${usuarios.length} activos`;
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        usuariosCount.textContent = 'Error al cargar';
    }

    try {
        const health = await apiGet('/health');
        apiStatus.textContent = health.status ? 'API disponible' : 'API sin estado';
    } catch (error) {
        console.error('Error health:', error);
        apiStatus.textContent = 'Backend inaccesible';
    }
}
