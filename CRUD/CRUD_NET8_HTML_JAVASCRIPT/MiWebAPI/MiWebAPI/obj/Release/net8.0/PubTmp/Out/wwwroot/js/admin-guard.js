(function () {
    const LOGIN_URL = "https://delightful-beach-088839910.centralus.6.azurestaticapps.net/login";
    const rawSession = localStorage.getItem("rendervault_admin_session");

    function redirigirAlLogin() {
        localStorage.removeItem("rendervault_admin_session");
        window.location.replace(LOGIN_URL);
    }

    if (!rawSession) {
        redirigirAlLogin();
        return;
    }

    try {
        const session = JSON.parse(rawSession);
        const tieneDatosAdmin =
            session &&
            (session.isAdmin === true ||
                session.adminId ||
                session.AdminId ||
                session.correo ||
                session.Correo ||
                session.nombreUsuario ||
                session.NombreUsuario);

        if (!tieneDatosAdmin) {
            redirigirAlLogin();
            return;
        }

        // Expone helper opcional para mostrar nombre/nivel o cerrar sesión en el panel
        window.RenderVaultAdmin = {
            session,
            logout: function () {
                localStorage.removeItem("rendervault_admin_session");
                window.location.replace(LOGIN_URL);
            }
        };
    } catch (e) {
        redirigirAlLogin();
    }
})();