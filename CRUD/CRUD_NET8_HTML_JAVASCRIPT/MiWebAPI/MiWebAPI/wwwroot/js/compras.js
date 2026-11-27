const API_URL_COMPRA = "api/Compra";

const formulario = document.getElementById("formCompra");
const tabla = document.getElementById("tablaCompras");
const filtro = document.getElementById("txtFiltro");
const mensaje = document.getElementById("mensaje");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");
const resumenEliminar = document.getElementById("resumenEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

let compras = [];
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
        btnConfirmarEliminar.addEventListener("click", confirmarEliminacionCompra);
    }
    obtenerCompras();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerCompras);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerCompras() {
    cambiarEstadoCarga(true);
    try {
        compras = await solicitar(API_URL_COMPRA);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de compras.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarCompras(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((c) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-semibold text-white py-3">#${c.compraId}</td>
            <td>Usuario #${c.usuarioId}</td>
            <td>${c.productoId ? `Producto #${c.productoId}` : '<span class="text-secondary">—</span>'}</td>
            <td>${c.comisionId ? `Comisión #${c.comisionId}` : '<span class="text-secondary">—</span>'}</td>
            <td class="text-secondary small">${escaparHtml(c.fechaCompra ?? "—")}</td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarCompra(${c.compraId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="solicitarEliminarCompra(${c.compraId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("compraId").value = "0";
    tituloFormulario.textContent = "Nueva Compra";
    btnGuardar.textContent = "Guardar";
    modalInstancia.show();
}

async function cargarCompra(id) {
    try {
        const c = await solicitar(`${API_URL_COMPRA}/${id}`);
        document.getElementById("compraId").value = c.compraId;
        document.getElementById("usuarioId").value = c.usuarioId ?? 1;
        document.getElementById("productoId").value = c.productoId ?? "";
        document.getElementById("comisionId").value = c.comisionId ?? "";

        tituloFormulario.textContent = "Editar Compra";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener la compra.", "danger");
        console.error(error);
    }
}

async function guardarCompra() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const prodVal = document.getElementById("productoId").value.trim();
    const comVal = document.getElementById("comisionId").value.trim();

    const compra = {
        compraId: Number(document.getElementById("compraId").value),
        usuarioId: Number(document.getElementById("usuarioId").value),
        productoId: prodVal === "" ? null : Number(prodVal),
        comisionId: comVal === "" ? null : Number(comVal)
    };

    const esNueva = compra.compraId === 0;

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNueva ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_COMPRA, {
            method: esNueva ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(compra)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerCompras();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar la compra.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("compraId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

function solicitarEliminarCompra(id) {
    const item = compras.find((c) => c.compraId === id);
    idPendienteEliminar = id;
    if (resumenEliminar) {
        resumenEliminar.innerHTML = item
            ? `<div><strong>Compra:</strong> #${item.compraId}</div>
               <div><strong>Usuario:</strong> #${item.usuarioId}</div>
               <div><strong>Detalle:</strong> ${item.productoId ? `Producto #${item.productoId}` : ""}${item.productoId && item.comisionId ? " · " : ""}${item.comisionId ? `Comisión #${item.comisionId}` : (!item.productoId ? "Sin referencia" : "")}</div>`
            : `<div><strong>ID Compra:</strong> ${id}</div>`;
    }
    if (modalConfirmarInstancia) {
        modalConfirmarInstancia.show();
    }
}

async function confirmarEliminacionCompra() {
    if (!idPendienteEliminar) return;
    try {
        if (btnConfirmarEliminar) btnConfirmarEliminar.disabled = true;
        const resultado = await solicitar(`${API_URL_COMPRA}/${idPendienteEliminar}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Compra eliminada correctamente", "success");
        if (modalConfirmarInstancia) modalConfirmarInstancia.hide();
        idPendienteEliminar = null;
        await obtenerCompras();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar la compra.", "danger");
        console.error(error);
    } finally {
        if (btnConfirmarEliminar) btnConfirmarEliminar.disabled = false;
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = compras.filter((c) =>
        String(c.compraId).includes(texto) ||
        String(c.usuarioId).includes(texto) ||
        String(c.productoId ?? "").includes(texto) ||
        String(c.comisionId ?? "").includes(texto)
    );
    mostrarCompras(resultados);
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