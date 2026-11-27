(function () {
    const SESSION_KEY = "rendervault_admin_session";
    const LOGIN_URL = "https://delightful-beach-088839910-preview.centralus.6.azurestaticapps.net/";

    // Capturar sesión enviada desde el login de Angular en el hash de la URL
    if (window.location.hash && window.location.hash.startsWith("#session=")) {
        try {
            const encoded = window.location.hash.slice("#session=".length);
            const decodedJson = decodeURIComponent(encoded);
            const parsed = JSON.parse(decodedJson);

            if (parsed && typeof parsed === "object") {
                localStorage.setItem(SESSION_KEY, JSON.stringify(parsed));
            }
            history.replaceState(null, "", window.location.pathname + window.location.search);
        } catch (e) {
            console.warn("No se pudo leer la sesión desde la URL:", e);
        }
    }

    function redirectToLogin() {
        localStorage.removeItem(SESSION_KEY);
        window.location.replace(LOGIN_URL);
    }

    const rawSession = localStorage.getItem(SESSION_KEY);
    if (!rawSession) {
        redirectToLogin();
        return;
    }

    try {
        const session = JSON.parse(rawSession);
        const isAdmin =
            session &&
            (session.isAdmin === true ||
                Boolean(session.adminId) ||
                Boolean(session.correo) ||
                Boolean(session.nombreUsuario));

        if (!isAdmin) {
            redirectToLogin();
        }
    } catch (e) {
        redirectToLogin();
    }
})();