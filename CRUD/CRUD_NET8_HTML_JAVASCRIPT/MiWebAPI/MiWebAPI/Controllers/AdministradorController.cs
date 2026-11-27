using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AdministradorController : ControllerBase
    {
        private readonly AdministradorData _administradorData;

        public AdministradorController(AdministradorData administradorData)
        {
            _administradorData = administradorData;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] Administrador credenciales)
        {
            try
            {
                Administrador admin = await _administradorData.ValidarLogin(credenciales.Correo, credenciales.Contrasena);

                if (admin == null)
                {
                    return StatusCode(StatusCodes.Status401Unauthorized, new
                    {
                        isSuccess = false,
                        respuesta = "Correo o contraseña incorrectos."
                    });
                }

                return StatusCode(StatusCodes.Status200OK, new
                {
                    isSuccess = true,
                    respuesta = "Bienvenido al sistema",
                    usuario = new
                    {
                        adminId = admin.AdminId,
                        nombreUsuario = admin.NombreUsuario,
                        correo = admin.Correo,
                        nivelAcceso = admin.NivelAcceso
                    }
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    isSuccess = false,
                    respuesta = "Error técnico: " + ex.Message
                });
            }
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<Administrador> lista = await _administradorData.Lista();
            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Obtener(int id)
        {
            Administrador objeto = await _administradorData.Obtener(id);
            return StatusCode(StatusCodes.Status200OK, objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Administrador objeto)
        {
            var resultado = await _administradorData.Crear(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] Administrador objeto)
        {
            var resultado = await _administradorData.Editar(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            var resultado = await _administradorData.Eliminar(id);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }
    }
}