const API_URL_ENLACE = "api/EnlaceDescarga";

const formulario = document.getElementById("formEnlaceDescarga");
const tabla = document.getElementById("tablaEnlacesDescarga");
const filtro = document.getElementById("txtFiltro");
const mensaje = document.getElementById("mensaje");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");
const resumenEliminar = document.getElementById("resumenEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

let enlaces = [];
let modalInstancia = null;
let modalConfirmarInstancia = null;
let idPendienteEliminar = null;

document.addEventListener("DOMContentLoaded", () => {
    modalInstancia = new bootstrap.Modal(document.getElementById("modalRegistro"));
    const elConfirmar = document.getElementById("modalConfirmarEliminar");
    if (elConfirmar) {
        modalConfirmarInstancia = new bootstrap.Modal(elConfirmar);
    }
    if (btnConfirmarEliminar) {
        btnConfirmarEliminar.addEventListener("click", confirmarEliminacionEnlace);
    }
    obtenerEnlaces();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerEnlaces);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerEnlaces() {
    cambiarEstadoCarga(true);
    try {
        enlaces = await solicitar(API_URL_ENLACE);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de enlaces de descarga.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarEnlaces(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((e) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-semibold text-white py-3">Producto #${e.productoId}</td>
            <td class="text-truncate" style="max-width: 180px;">${e.enlaceFbx ? escaparHtml(e.enlaceFbx) : '<span class="text-secondary">—</span>'}</td>
            <td class="text-truncate" style="max-width: 180px;">${e.enlaceGlb ? escaparHtml(e.enlaceGlb) : '<span class="text-secondary">—</span>'}</td>
            <td class="text-truncate" style="max-width: 180px;">${e.enlaceObj ? escaparHtml(e.enlaceObj) : '<span class="text-secondary">—</span>'}</td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarEnlace(${e.enlaceId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="solicitarEliminarEnlace(${e.enlaceId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("enlaceId").value = "0";
    tituloFormulario.textContent = "Nuevo Enlace de Descarga";
    btnGuardar.textContent = "Guardar";
    modalInstancia.show();
}

async function cargarEnlace(id) {
    try {
        const e = await solicitar(`${API_URL_ENLACE}/${id}`);
        document.getElementById("enlaceId").value = e.enlaceId;
        document.getElementById("productoId").value = e.productoId ?? 1;
        document.getElementById("enlaceFbx").value = e.enlaceFbx ?? "";
        document.getElementById("enlaceGlb").value = e.enlaceGlb ?? "";
        document.getElementById("enlaceObj").value = e.enlaceObj ?? "";

        tituloFormulario.textContent = "Editar Enlace de Descarga";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener el enlace de descarga.", "danger");
        console.error(error);
    }
}

async function guardarEnlaceDescarga() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const enlace = {
        enlaceId: Number(document.getElementById("enlaceId").value),
        productoId: Number(document.getElementById("productoId").value),
        enlaceFbx: document.getElementById("enlaceFbx").value.trim(),
        enlaceGlb: document.getElementById("enlaceGlb").value.trim(),
        enlaceObj: document.getElementById("enlaceObj").value.trim()
    };

    const esNuevo = enlace.enlaceId === 0;

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNueva ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_ENLACE, {
            method: esNueva ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(enlace)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerEnlaces();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar el enlace de descarga.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("enlaceId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

function solicitarEliminarEnlace(id) {
    const item = enlaces.find((e) => e.enlaceId === id);
    idPendienteEliminar = id;
    if (resumenEliminar) {
        resumenEliminar.innerHTML = item
            ? `<div><strong>ID Enlace:</strong> ${item.enlaceId}</div>
               <div><strong>Producto:</strong> #${item.productoId}</div>
               <div><strong>Formatos:</strong> ${[item.enlaceFbx ? "FBX" : null, item.enlaceGlb ? "GLB" : null, item.enlaceObj ? "OBJ" : null].filter(Boolean).join(", ") || "Ninguno"}</div>`
            : `<div><strong>ID Enlace:</strong> ${id}</div>`;
    }
    if (modalConfirmarInstancia) {
        modalConfirmarInstancia.show();
    }
}

async function confirmarEliminacionEnlace() {
    if (!idPendienteEliminar) return;
    try {
        if (btnConfirmarEliminar) btnConfirmarEliminar.disabled = true;
        const resultado = await solicitar(`${API_URL_ENLACE}/${idPendienteEliminar}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Enlace de descarga eliminado correctamente", "success");
        if (modalConfirmarInstancia) modalConfirmarInstancia.hide();
        idPendienteEliminar = null;
        await obtenerEnlaces();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar el enlace de descarga.", "danger");
        console.error(error);
    } finally {
        if (btnConfirmarEliminar) btnConfirmarEliminar.disabled = false;
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = enlaces.filter((e) =>
        String(e.productoId).includes(texto) ||
        (e.enlaceFbx ?? "").toLowerCase().includes(texto) ||
        (e.enlaceGlb ?? "").toLowerCase().includes(texto) ||
        (e.enlaceObj ?? "").toLowerCase().includes(texto)
    );
    mostrarEnlaces(resultados);
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