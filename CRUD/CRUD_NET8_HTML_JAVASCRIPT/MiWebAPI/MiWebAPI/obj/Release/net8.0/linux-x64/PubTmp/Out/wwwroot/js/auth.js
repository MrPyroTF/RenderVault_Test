const LOGIN_URL = "https://delightful-beach-088839910-preview.centralus.6.azurestaticapps.net/";
const ADMIN_SESSION_KEY = "rendervault_admin_session";
const LEGACY_SESSION_KEY = "rendervault_usuario";

function obtenerUsuario() {
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
    const valor = localStorage.getItem(ADMIN_SESSION_KEY);
    try {
        return valor ? JSON.parse(valor) : null;
    } catch {
        localStorage.removeItem(ADMIN_SESSION_KEY);
        return null;
    }
}

function protegerPagina() {
    if (!obtenerUsuario()) {
        window.location.replace(LOGIN_URL);
    }
}

function mostrarUsuario(elementId) {
    const usuario = obtenerUsuario();
    const elemento = document.getElementById(elementId);
    if (usuario && elemento) {
        elemento.textContent = usuario.nombre || usuario.nombreUsuario || usuario.correo || "Administrador";
    }
}

function cerrarSesion() {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    sessionStorage.removeItem(LEGACY_SESSION_KEY);
    window.location.replace(LOGIN_URL);
}