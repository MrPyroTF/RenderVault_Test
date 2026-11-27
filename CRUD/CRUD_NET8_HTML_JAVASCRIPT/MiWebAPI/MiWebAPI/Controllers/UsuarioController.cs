using System.Security.Cryptography;
using System.Text;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using MiWebAPI.Data;
using MiWebAPI.Models;

namespace MiWebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UsuarioController : ControllerBase
    {
        private readonly UsuarioData _usuarioData;
        private readonly string _cadenaSql;

        public UsuarioController(UsuarioData usuarioData, IConfiguration configuration)
        {
            _usuarioData = usuarioData;
            _cadenaSql = configuration.GetConnectionString("CadenaSQL") ?? string.Empty;
        }

        [HttpGet]
        public async Task<IActionResult> Lista()
        {
            List<Usuario> lista = await _usuarioData.Lista();
            return StatusCode(StatusCodes.Status200OK, lista);
        }

        [HttpGet("{id:int}")]
        public async Task<IActionResult> Obtener(int id)
        {
            Usuario objeto = await _usuarioData.Obtener(id);
            return StatusCode(StatusCodes.Status200OK, objeto);
        }

        [HttpPost]
        public async Task<IActionResult> Crear([FromBody] Usuario objeto)
        {
            objeto.Contrasena = CifrarTexto(objeto.Contrasena);
            RespuestaOperacion resultado = await _usuarioData.Crear(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPut]
        public async Task<IActionResult> Editar([FromBody] Usuario objeto)
        {
            RespuestaOperacion resultado = await _usuarioData.Editar(objeto);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Eliminar(int id)
        {
            RespuestaOperacion resultado = await _usuarioData.Eliminar(id);
            return StatusCode(StatusCodes.Status200OK, resultado);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UsuarioLoginRequest credenciales)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_cadenaSql))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        mensaje = "No se encontró la cadena de conexión 'CadenaSQL' en appsettings.json."
                    });
                }

                string contrasenaCifrada = CifrarTexto(credenciales.Contrasena);

                using (var conexion = new SqlConnection(_cadenaSql))
                {
                    await conexion.OpenAsync();

                    string query = @"SELECT TOP 1 UsuarioId, NombreCompleto, NombreUsuario, Correo, Telefono, TipoUsuario
                                   FROM Usuario
                                   WHERE LOWER(Correo) = LOWER(@Correo) AND Contrasena = @Contrasena";

                    using (var cmd = new SqlCommand(query, conexion))
                    {
                        cmd.Parameters.AddWithValue("@Correo", (credenciales.Correo ?? string.Empty).Trim());
                        cmd.Parameters.AddWithValue("@Contrasena", contrasenaCifrada);

                        using (var reader = await cmd.ExecuteReaderAsync())
                        {
                            if (await reader.ReadAsync())
                            {
                                return Ok(new
                                {
                                    usuarioId = Convert.ToInt32(reader["UsuarioId"]),
                                    nombreCompleto = reader["NombreCompleto"].ToString(),
                                    nombreUsuario = reader["NombreUsuario"].ToString(),
                                    correo = reader["Correo"].ToString(),
                                    telefono = reader["Telefono"].ToString(),
                                    tipoUsuario = reader["TipoUsuario"].ToString()
                                });
                            }
                        }
                    }
                }

                return Unauthorized(new { mensaje = "Correo o contraseña incorrectos." });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    mensaje = ex.Message
                });
            }
        }

        [HttpPost("cambiar-password")]
        public async Task<IActionResult> CambiarPassword([FromBody] CambiarPasswordRequest request)
        {
            try
            {
                if (string.IsNullOrWhiteSpace(_cadenaSql))
                {
                    return StatusCode(StatusCodes.Status500InternalServerError, new
                    {
                        exito = false,
                        mensaje = "No se encontró la cadena de conexión 'CadenaSQL' en appsettings.json."
                    });
                }

                if (request == null || string.IsNullOrWhiteSpace(request.Correo) || string.IsNullOrWhiteSpace(request.NuevaContrasena))
                {
                    return BadRequest(new
                    {
                        exito = false,
                        mensaje = "Debes enviar el correo y la nueva contraseña."
                    });
                }

                string contrasenaCifrada = CifrarTexto(request.NuevaContrasena);

                using (var conexion = new SqlConnection(_cadenaSql))
                {
                    await conexion.OpenAsync();

                    string query = @"UPDATE Usuario
                                   SET Contrasena = @Contrasena
                                   WHERE LOWER(Correo) = LOWER(@Correo)";

                    using (var cmd = new SqlCommand(query, conexion))
                    {
                        cmd.Parameters.AddWithValue("@Correo", request.Correo.Trim());
                        cmd.Parameters.AddWithValue("@Contrasena", contrasenaCifrada);

                        int filasAfectadas = await cmd.ExecuteNonQueryAsync();

                        if (filasAfectadas == 0)
                        {
                            return NotFound(new
                            {
                                exito = false,
                                mensaje = "No se encontró ningún usuario con ese correo."
                            });
                        }
                    }
                }

                return Ok(new
                {
                    exito = true,
                    mensaje = "Contraseña actualizada correctamente en la base de datos."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(StatusCodes.Status500InternalServerError, new
                {
                    exito = false,
                    mensaje = ex.Message
                });
            }
        }

        private static string CifrarTexto(string texto)
        {
            if (string.IsNullOrEmpty(texto)) return string.Empty;

            using (var sha512 = SHA512.Create())
            {
                byte[] bytes = sha512.ComputeHash(Encoding.UTF8.GetBytes(texto));
                var sb = new StringBuilder();
                foreach (byte b in bytes)
                {
                    sb.Append(b.ToString("x2"));
                }
                return sb.ToString();
            }
        }
    }

    public class UsuarioLoginRequest
    {
        public string Correo { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
    }

    public class CambiarPasswordRequest
    {
        public string Correo { get; set; } = string.Empty;
        public string NuevaContrasena { get; set; } = string.Empty;
    }
}