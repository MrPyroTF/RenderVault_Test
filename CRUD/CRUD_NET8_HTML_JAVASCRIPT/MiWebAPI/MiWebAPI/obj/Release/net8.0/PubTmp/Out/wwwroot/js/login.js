const SESSION_KEY = "rendervault_usuario";

const formLogin = document.getElementById("formLogin");
const correo = document.getElementById("correo");
const password = document.getElementById("password");
const btnLogin = document.getElementById("btnLogin");
const mensajeLogin = document.getElementById("mensajeLogin");

// Limpiamos cualquier residuo previo al abrir el login para evitar rebotes
if (sessionStorage.getItem(SESSION_KEY)) {
    // Si ya existe una sesión válida, avanzamos
    const usuarioPrueba = sessionStorage.getItem(SESSION_KEY);
    if (usuarioPrueba && usuarioPrueba !== "undefined" && usuarioPrueba !== "null") {
        window.location.replace("index.html");
    } else {
        sessionStorage.removeItem(SESSION_KEY);
    }
}

formLogin.addEventListener("submit", async (evento) => {
    evento.preventDefault();
    mensajeLogin.classList.add("d-none");
    btnLogin.disabled = true;
    btnLogin.textContent = "Ingresando...";

    try {
        const respuesta = await fetch("/api/Auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                correo: correo.value.trim(),
                password: password.value
            })
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || !resultado.isSuccess) {
            throw new Error(resultado.respuesta || "No fue posible iniciar sesión.");
        }

        // Guardamos de forma segura el usuario (ya sea en resultado.usuario o directo en resultado)
        const datosUsuario = resultado.usuario || resultado;
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(datosUsuario));

        window.location.replace("index.html");

    } catch (error) {
        mensajeLogin.textContent = error.message || "Ocurrió un error al conectar con la API.";
        mensajeLogin.classList.remove("d-none");
    } finally {
        btnLogin.disabled = false;
        btnLogin.textContent = "Ingresar";
    }
});