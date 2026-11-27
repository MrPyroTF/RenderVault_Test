const API_URL_USUARIO = "api/Usuario";

const formulario = document.getElementById("formUsuario");
const tabla = document.getElementById("tablaUsuarios");
const filtro = document.getElementById("txtFiltro");
const mensaje = document.getElementById("mensaje");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");

let usuarios = [];
let modalInstancia = null;

document.addEventListener("DOMContentLoaded", () => {
    modalInstancia = new bootstrap.Modal(document.getElementById('modalRegistro'));
    obtenerUsuarios();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerUsuarios);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerUsuarios() {
    cambiarEstadoCarga(true);
    try {
        usuarios = await solicitar(API_URL_USUARIO);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de usuarios.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarUsuarios(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((u) => {
        const fila = document.createElement("tr");
        const tipoBadge = (u.tipoUsuario ?? "").toLowerCase() === 'vendedor' ? 'bg-primary' : 'bg-secondary';
        fila.innerHTML = `
            <td class="fw-semibold text-white py-3">${escaparHtml(u.nombreCompleto)}</td>
            <td>${escaparHtml(u.nombreUsuario)}</td>
            <td>${escaparHtml(u.correo)}</td>
            <td><span class="badge ${tipoBadge} bg-opacity-75">${escaparHtml(u.tipoUsuario)}</span></td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarUsuario(${u.usuarioId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="eliminarUsuario(${u.usuarioId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("usuarioId").value = "0";
    tituloFormulario.textContent = "Nuevo Usuario";
    btnGuardar.textContent = "Guardar";
    modalInstancia.show();
}

async function cargarUsuario(id) {
    try {
        const u = await solicitar(`${API_URL_USUARIO}/${id}`);
        document.getElementById("usuarioId").value = u.usuarioId;
        document.getElementById("nombreCompleto").value = u.nombreCompleto ?? "";
        document.getElementById("nombreUsuario").value = u.nombreUsuario ?? "";
        document.getElementById("correo").value = u.correo ?? "";
        document.getElementById("telefono").value = u.telefono ?? "";
        document.getElementById("contrasena").value = "";
        document.getElementById("tipoUsuario").value = u.tipoUsuario ?? "Comprador";

        tituloFormulario.textContent = "Editar Usuario";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener el usuario.", "danger");
        console.error(error);
    }
}

async function guardarUsuario() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const usuario = {
        usuarioId: Number(document.getElementById("usuarioId").value),
        nombreCompleto: document.getElementById("nombreCompleto").value.trim(),
        nombreUsuario: document.getElementById("nombreUsuario").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        telefono: document.getElementById("telefono").value.trim(),
        contrasena: document.getElementById("contrasena").value.trim(),
        tipoUsuario: document.getElementById("tipoUsuario").value
    };

    const esNuevo = usuario.usuarioId === 0;

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNuevo ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_USUARIO, {
            method: esNuevo ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(usuario)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerUsuarios();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar el usuario.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("usuarioId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

async function eliminarUsuario(id) {
    try {
        const resultado = await solicitar(`${API_URL_USUARIO}/${id}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Usuario eliminado correctamente", "success");
        await obtenerUsuarios();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar el usuario.", "danger");
        console.error(error);
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = usuarios.filter((u) =>
        (u.nombreCompleto ?? "").toLowerCase().includes(texto) ||
        (u.correo ?? "").toLowerCase().includes(texto)
    );
    mostrarUsuarios(resultados);
}

function cambiarEstadoCarga(cargando) {
    btnRecargar.disabled = cargando;
    btnRecargar.textContent = cargando ? "Cargando..." : "Recargar";
}

function mostrarMensaje(texto, tipo) {
    mensaje.textContent = texto;
    mensaje.className = `alert alert-${tipo} shadow-sm`;
    window.clearTimeout(mostrarMensaje.temporizador);
    mostrarMensaje.temporizador = window.setTimeout(() => mensaje.classList.add("d-none"), 4500);
}

function escaparHtml(valor) {
    return String(valor ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}