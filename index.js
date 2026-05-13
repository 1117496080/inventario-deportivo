// index.js - Login usando JavaScript puro y backend en localhost:8080/api

const BASE_URL = 'http://localhost:8080/api';
const loginForm = document.getElementById('login-form');
const correoLogin = document.getElementById('correo-login');
const passwordLogin = document.getElementById('password-login');
const loginError = document.getElementById('login-error');

loginForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    loginError.textContent = '';

    const correo = correoLogin.value.trim();
    const contraseña = passwordLogin.value.trim();

    if (!correo || !contraseña) {
        loginError.textContent = 'Correo y contraseña son obligatorios.';
        return;
    }

    try {
        const response = await fetch(`${BASE_URL}/usuarios/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ correo, contraseña })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            loginError.textContent = errorData?.message || 'Credenciales inválidas o backend inaccesible.';
            return;
        }

        const data = await response.json();
        localStorage.setItem('usuarioLogin', JSON.stringify(data));
        window.location.href = 'dashboard.html';
    } catch (error) {
        console.error('Error en login:', error);
        loginError.textContent = 'No se pudo conectar con el backend.';
    }
});
