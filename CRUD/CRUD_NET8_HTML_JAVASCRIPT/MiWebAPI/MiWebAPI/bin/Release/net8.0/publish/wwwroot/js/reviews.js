const API_URL_REVIEW = "api/Review";

const formulario = document.getElementById("formReview");
const tabla = document.getElementById("tablaReviews");
const filtro = document.getElementById("txtFiltro");
const sinResultados = document.getElementById("sinResultados");
const tituloFormulario = document.getElementById("tituloModal");
const btnGuardar = document.getElementById("btnGuardar");
const btnRecargar = document.getElementById("btnRecargar");
const grupoProducto = document.getElementById("grupoProducto");
const grupoUsuario = document.getElementById("grupoUsuario");

let reviews = [];
let modalInstancia = null;

document.addEventListener("DOMContentLoaded", () => {
    modalInstancia = new bootstrap.Modal(document.getElementById('modalRegistro'));
    obtenerReviews();
});

filtro.addEventListener("input", aplicarFiltro);
btnRecargar.addEventListener("click", obtenerReviews);

async function solicitar(url, opciones = {}) {
    const respuesta = await fetch(url, opciones);
    if (!respuesta.ok) {
        const detalle = await respuesta.text();
        throw new Error(detalle || `Error HTTP ${respuesta.status}`);
    }
    if (respuesta.status === 204) return null;
    return respuesta.json();
}

async function obtenerReviews() {
    cambiarEstadoCarga(true);
    try {
        reviews = await solicitar(API_URL_REVIEW);
        aplicarFiltro();
    } catch (error) {
        mostrarMensaje("No fue posible consultar la API de reseñas.", "danger");
        console.error(error);
    } finally {
        cambiarEstadoCarga(false);
    }
}

function mostrarReviews(lista) {
    tabla.innerHTML = "";
    sinResultados.classList.toggle("d-none", lista.length > 0);

    lista.forEach((r) => {
        const fila = document.createElement("tr");
        fila.innerHTML = `
            <td class="py-3">#${r.productoId}</td>
            <td>#${r.usuarioId}</td>
            <td><span class="text-warning">${r.calificacion} ⭐</span></td>
            <td class="text-white">${escaparHtml(r.comentario)}</td>
            <td class="text-center acciones py-3">
                <button class="btn btn-sm btn-outline-primary px-3" onclick="cargarReview(${r.reviewId})">Editar</button>
                <button class="btn btn-sm btn-outline-danger px-3" onclick="eliminarReview(${r.reviewId})">Eliminar</button>
            </td>`;
        tabla.appendChild(fila);
    });
}

function abrirModalNuevo() {
    formulario.reset();
    formulario.classList.remove("was-validated");
    document.getElementById("reviewId").value = "0";
    tituloFormulario.textContent = "Nueva Reseña";
    btnGuardar.textContent = "Guardar";

    grupoProducto.style.display = "block";
    grupoUsuario.style.display = "block";
    document.getElementById("productoId").required = true;
    document.getElementById("usuarioId").required = true;

    modalInstancia.show();
}

async function cargarReview(id) {
    try {
        const r = await solicitar(`${API_URL_REVIEW}/${id}`);
        document.getElementById("reviewId").value = r.reviewId;
        document.getElementById("calificacion").value = r.calificacion ?? 5;
        document.getElementById("comentario").value = r.comentario ?? "";

        grupoProducto.style.display = "none";
        grupoUsuario.style.display = "none";
        document.getElementById("productoId").required = false;
        document.getElementById("usuarioId").required = false;

        tituloFormulario.textContent = "Editar Reseña";
        btnGuardar.textContent = "Actualizar";
        modalInstancia.show();
    } catch (error) {
        mostrarMensaje("No fue posible obtener la reseña.", "danger");
        console.error(error);
    }
}

async function guardarReview() {
    if (!formulario.checkValidity()) {
        formulario.classList.add("was-validated");
        return;
    }

    const reviewId = Number(document.getElementById("reviewId").value);
    const esNuevo = reviewId === 0;

    const review = esNuevo ? {
        productoId: Number(document.getElementById("productoId").value),
        usuarioId: Number(document.getElementById("usuarioId").value),
        calificacion: Number(document.getElementById("calificacion").value),
        comentario: document.getElementById("comentario").value.trim()
    } : {
        reviewId: reviewId,
        calificacion: Number(document.getElementById("calificacion").value),
        comentario: document.getElementById("comentario").value.trim()
    };

    try {
        btnGuardar.disabled = true;
        btnGuardar.textContent = esNuevo ? "Guardando..." : "Actualizando...";

        const resultado = await solicitar(API_URL_REVIEW, {
            method: esNuevo ? "POST" : "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(review)
        });

        mostrarMensaje(resultado.respuesta || "Operación exitosa", "success");
        modalInstancia.hide();
        await obtenerReviews();
    } catch (error) {
        mostrarMensaje(error.message || "No fue posible guardar la reseña.", "danger");
        console.error(error);
    } finally {
        btnGuardar.disabled = false;
        btnGuardar.textContent = Number(document.getElementById("reviewId").value) === 0 ? "Guardar" : "Actualizar";
    }
}

async function eliminarReview(id) {
    // Eliminación directa con notificación flotante (sin alertas feas de localhost)
    try {
        const resultado = await solicitar(`${API_URL_REVIEW}/${id}`, { method: "DELETE" });
        mostrarMensaje(resultado.respuesta || "Reseña eliminada correctamente", "success");
        await obtenerReviews();
    } catch (error) {
        mostrarMensaje("No fue posible eliminar la reseña.", "danger");
        console.error(error);
    }
}

function aplicarFiltro() {
    const texto = filtro.value.trim().toLowerCase();
    const resultados = reviews.filter((r) =>
        (r.comentario ?? "").toLowerCase().includes(texto) ||
        String(r.productoId).includes(texto)
    );
    mostrarReviews(resultados);
}

function cambiarEstadoCarga(cargando) {
    btnRecargar.disabled = cargando;
    btnRecargar.textContent = cargando ? "Cargando..." : "Recargar";
}

// Sistema de Notificaciones Flotantes (Toasts) moderno sin avisos de navegador
function mostrarMensaje(texto, tipo = "success") {
    let contenedor = document.getElementById("toastContainer");
    if (!contenedor) {
        contenedor = document.createElement("div");
        contenedor.id = "toastContainer";
        document.body.appendChild(contenedor);
    }

    const toast = document.createElement("div");
    toast.className = `custom-toast ${tipo === 'danger' ? 'danger' : 'success'}`;
    toast.innerHTML = `
        <span>${tipo === 'danger' ? '⚠️' : '✅'}</span>
        <div style="flex: 1; font-size: 0.9rem; font-weight: 500;">${texto}</div>
    `;

    contenedor.appendChild(toast);

    setTimeout(() => {
        toast.style.opacity = "0";
        toast.style.transform = "translateY(20px)";
        toast.style.transition = "all 0.3s ease";
        setTimeout(() => toast.remove(), 300);
    }, 4000);
}

function escaparHtml(valor) {
    return String(valor ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;").replaceAll("'", "&#039;");
}