const API_URL_PRODUCTO = "api/Producto";

const formulario = document.getElementById("formProducto");
const tabla = document.getElementById("tablaProductos");
const filtro = document.getElementById("txtFiltro");
const mensaje = document.getElementById("mensaje");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");

let productos = [];
let modalInstancia = null;

document.addEventListener("DOMContentLoaded", () => {
    modalInstancia = new bootstrap.Modal(document.getElementById('modalRegistro'));
    obtenerProductos();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerProductos);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerProductos() {
    cambiarEstadoCarga(true);
    try {
        productos = await solicitar(API_URL_PRODUCTO);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de productos.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarProductos(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((p) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="fw-semibold text-white py-3">${escaparHtml(p.titulo)}</td>
            <td class="text-success">${formatearMoneda(p.precio)}</td>
            <td><span class="badge bg-secondary bg-opacity-10 text-light border border-secondary border-opacity-25">${p.poligonos} pols</span></td>
            <td>${p.calificacionPromedio ?? 0} ⭐</td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarProducto(${p.productoId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="eliminarProducto(${p.productoId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("productoId").value = "0";
    tituloFormulario.textContent = "Nuevo Producto 3D";
    btnGuardar.textContent = "Guardar";
    modalInstancia.show();
}

async function cargarProducto(id) {
    try {
        const p = await solicitar(`${API_URL_PRODUCTO}/${id}`);
        document.getElementById("productoId").value = p.productoId;
        document.getElementById("vendedorId").value = p.vendedorId ?? 1;
        document.getElementById("titulo").value = p.titulo ?? "";
        document.getElementById("descripcion").value = p.descripcion ?? "";
        document.getElementById("precio").value = p.precio ?? 0;
        document.getElementById("enlaceFbx").value = p.enlaceFbx ?? "";
        document.getElementById("enlaceObj").value = p.enlaceObj ?? "";
        document.getElementById("enlaceGlb").value = p.enlaceGlb ?? "";
        document.getElementById("poligonos").value = p.poligonos ?? 0;

        tituloFormulario.textContent = "Editar Producto 3D";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener el producto.", "danger");
        console.error(error);
    }
}

async function guardarProducto() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const producto = {
        productoId: Number(document.getElementById("productoId").value),
        vendedorId: Number(document.getElementById("vendedorId").value),
        titulo: document.getElementById("titulo").value.trim(),
        descripcion: document.getElementById("descripcion").value.trim(),
        precio: Number(document.getElementById("precio").value),
        enlaceFbx: document.getElementById("enlaceFbx").value.trim(),
        enlaceObj: document.getElementById("enlaceObj").value.trim(),
        enlaceGlb: document.getElementById("enlaceGlb").value.trim(),
        poligonos: Number(document.getElementById("poligonos").value)
    };

    const esNuevo = producto.productoId === 0;

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNuevo ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_PRODUCTO, {
            method: esNuevo ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(producto)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerProductos();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar el producto.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("productoId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

async function eliminarProducto(id) {
    try {
        const resultado = await solicitar(`${API_URL_PRODUCTO}/${id}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Producto eliminado correctamente", "success");
        await obtenerProductos();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar el producto.", "danger");
        console.error(error);
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = productos.filter((p) => (p.titulo ?? "").toLowerCase().includes(texto));
    mostrarProductos(resultados);
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