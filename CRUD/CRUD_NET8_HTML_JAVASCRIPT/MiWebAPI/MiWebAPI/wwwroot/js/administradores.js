const API_URL_ADMINISTRADOR = "api/Administrador";

const formulario = document.getElementById("formAdministrador");
const tabla = document.getElementById("tablaAdministradores");
const filtro = document.getElementById("txtFiltro");
const mensaje = document.getElementById("mensaje");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");

let administradores = [];
let modalInstancia = null;

document.addEventListener("DOMContentLoaded", () => {
    modalInstancia = new bootstrap.Modal(document.getElementById('modalRegistro'));
    obtenerAdministradores();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerAdministradores);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerAdministradores() {
    cambiarEstadoCarga(true);
    try {
        administradores = await solicitar(API_URL_ADMINISTRADOR);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de administradores.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarAdministradores(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((a) => {
        const fila = document.createElement("tr");
        const nivelBadge = (a.nivelAcceso ?? "").toLowerCase() === 'total' ? 'bg-danger' : 'bg-warning text-dark';
        fila.innerHTML = `
            <td class="fw-semibold text-white py-3">${escaparHtml(a.nombreUsuario)}</td>
            <td>${escaparHtml(a.correo)}</td>
            <td><span class="badge ${nivelBadge} bg-opacity-75">${escaparHtml(a.nivelAcceso)}</span></td>
            <td>${escaparHtml(a.fechaCreacion ?? '')}</td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarAdministrador(${a.adminId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="eliminarAdministrador(${a.adminId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("adminId").value = "0";
    tituloFormulario.textContent = "Nuevo Administrador";
    btnGuardar.textContent = "Guardar";
    modalInstancia.show();
}

async function cargarAdministrador(id) {
    try {
        const a = await solicitar(`${API_URL_ADMINISTRADOR}/${id}`);
        document.getElementById("adminId").value = a.adminId;
        document.getElementById("nombreUsuario").value = a.nombreUsuario ?? "";
        document.getElementById("correo").value = a.correo ?? "";
        document.getElementById("contrasena").value = "";
        document.getElementById("nivelAcceso").value = a.nivelAcceso ?? "Total";

        tituloFormulario.textContent = "Editar Administrador";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener el administrador.", "danger");
        console.error(error);
    }
}

async function guardarAdministrador() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const admin = {
        adminId: Number(document.getElementById("adminId").value),
        nombreUsuario: document.getElementById("nombreUsuario").value.trim(),
        correo: document.getElementById("correo").value.trim(),
        contrasena: document.getElementById("contrasena").value.trim(),
        nivelAcceso: document.getElementById("nivelAcceso").value
    };

    const esNuevo = admin.adminId === 0;

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNuevo ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_ADMINISTRADOR, {
            method: esNuevo ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(admin)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerAdministradores();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar el administrador.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("adminId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

async function eliminarAdministrador(id) {
    try {
        const resultado = await solicitar(`${API_URL_ADMINISTRADOR}/${id}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Administrador eliminado correctamente", "success");
        await obtenerAdministradores();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar el administrador.", "danger");
        console.error(error);
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = administradores.filter((a) =>
        (a.nombreUsuario ?? "").toLowerCase().includes(texto) ||
        (a.correo ?? "").toLowerCase().includes(texto)
    );
    mostrarAdministradores(resultados);
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