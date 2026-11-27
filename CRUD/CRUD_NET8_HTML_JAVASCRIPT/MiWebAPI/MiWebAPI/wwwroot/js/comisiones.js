const API_URL_COMISION = "api/Comision";

const formulario = document.getElementById("formComision");
const tabla = document.getElementById("tablaComisiones");
const filtro = document.getElementById("txtFiltro");
const mensaje = document.getElementById("mensaje");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");
const resumenEliminar = document.getElementById("resumenEliminar");
const btnConfirmarEliminar = document.getElementById("btnConfirmarEliminar");

let comisiones = [];
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
        btnConfirmarEliminar.addEventListener("click", confirmarEliminacionComision);
    }
    obtenerComisiones();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerComisiones);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerComisiones() {
    cambiarEstadoCarga(true);
    try {
        comisiones = await solicitar(API_URL_COMISION);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de comisiones.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarComisiones(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((c) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-semibold text-white py-3">${escaparHtml(c.nombre)}</td>
            <td><span class="badge bg-secondary bg-opacity-10 text-light border border-secondary border-opacity-25">${escaparHtml(c.tipoArchivo)}</span></td>
            <td class="text-success">${formatearMoneda(c.total)}</td>
            <td>${c.pagado ? '<span class="badge bg-success bg-opacity-15 text-success">Pagado</span>' : '<span class="badge bg-warning bg-opacity-15 text-warning">Pendiente</span>'}</td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarComision(${c.comisionId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="solicitarEliminarComision(${c.comisionId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("comisionId").value = "0";
    document.getElementById("pagado").checked = false;
    tituloFormulario.textContent = "Nueva Comisión";
    btnGuardar.textContent = "Guardar";
    modalInstancia.show();
}

async function cargarComision(id) {
    try {
        const c = await solicitar(`${API_URL_COMISION}/${id}`);
        document.getElementById("comisionId").value = c.comisionId;
        document.getElementById("compradorId").value = c.compradorId ?? 1;
        document.getElementById("vendedorId").value = c.vendedorId ?? 1;
        document.getElementById("nombre").value = c.nombre ?? "";
        document.getElementById("tipoArchivo").value = c.tipoArchivo ?? "";
        document.getElementById("total").value = c.total ?? 0;
        document.getElementById("pagado").checked = Boolean(c.pagado);
        document.getElementById("linkGitHubPreview").value = c.linkGitHubPreview ?? "";
        document.getElementById("linkDescarga").value = c.linkDescarga ?? "";

        tituloFormulario.textContent = "Editar Comisión";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener la comisión.", "danger");
        console.error(error);
    }
}

async function guardarComision() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const comision = {
        comisionId: Number(document.getElementById("comisionId").value),
        compradorId: Number(document.getElementById("compradorId").value),
        vendedorId: Number(document.getElementById("vendedorId").value),
        nombre: document.getElementById("nombre").value.trim(),
        tipoArchivo: document.getElementById("tipoArchivo").value.trim(),
        total: Number(document.getElementById("total").value),
        pagado: document.getElementById("pagado").checked,
        linkGitHubPreview: document.getElementById("linkGitHubPreview").value.trim(),
        linkDescarga: document.getElementById("linkDescarga").value.trim()
    };

    const esNueva = comision.comisionId === 0;

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNueva ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_COMISION, {
            method: esNueva ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(comision)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerComisiones();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar la comisión.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("comisionId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

function solicitarEliminarComision(id) {
    const item = comisiones.find((c) => c.comisionId === id);
    idPendienteEliminar = id;
    if (resumenEliminar) {
        resumenEliminar.innerHTML = item
            ? `<div><strong>ID:</strong> ${item.comisionId}</div>
               <div><strong>Nombre:</strong> ${escaparHtml(item.nombre)}</div>
               <div><strong>Total:</strong> ${formatearMoneda(item.total)} (${item.pagado ? "Pagado" : "Pendiente"})</div>`
            : `<div><strong>ID Comisión:</strong> ${id}</div>`;
    }
    if (modalConfirmarInstancia) {
        modalConfirmarInstancia.show();
    }
}

async function confirmarEliminacionComision() {
    if (!idPendienteEliminar) return;
    try {
        if (btnConfirmarEliminar) btnConfirmarEliminar.disabled = true;
        const resultado = await solicitar(`${API_URL_COMISION}/${idPendienteEliminar}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Comisión eliminada correctamente", "success");
        if (modalConfirmarInstancia) modalConfirmarInstancia.hide();
        idPendienteEliminar = null;
        await obtenerComisiones();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar la comisión.", "danger");
        console.error(error);
    } finally {
        if (btnConfirmarEliminar) btnConfirmarEliminar.disabled = false;
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = comisiones.filter((c) =>
        (c.nombre ?? "").toLowerCase().includes(texto) ||
        (c.tipoArchivo ?? "").toLowerCase().includes(texto)
    );
    mostrarComisiones(resultados);
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

function formatearMoneda(valor) {
    return new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(valor ?? 0);
}

function escaparHtml(valor) {
    return String(valor ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}