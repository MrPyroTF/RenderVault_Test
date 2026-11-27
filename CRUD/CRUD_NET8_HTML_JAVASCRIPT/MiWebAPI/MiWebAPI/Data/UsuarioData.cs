using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class UsuarioData
    {
        private readonly string conexion;

        public UsuarioData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Usuario>> Lista()
        {
            List<Usuario> lista = new List<Usuario>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListarUsuario", con);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Usuario
                        {
                            UsuarioId = Convert.ToInt32(reader["UsuarioId"]),
                            NombreCompleto = reader["NombreCompleto"].ToString()!,
                            NombreUsuario = reader["NombreUsuario"].ToString()!,
                            Correo = reader["Correo"].ToString()!,
                            Telefono = reader["Telefono"].ToString()!,
                            Contrasena = "",
                            TipoUsuario = reader["TipoUsuario"].ToString()!,
                            FechaRegistro = reader["FechaRegistro"].ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<Usuario> Obtener(int id)
        {
            Usuario objeto = new Usuario();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerUsuario", con);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        objeto = new Usuario
                        {
                            UsuarioId = Convert.ToInt32(reader["UsuarioId"]),
                            NombreCompleto = reader["NombreCompleto"].ToString()!,
                            NombreUsuario = reader["NombreUsuario"].ToString()!,
                            Correo = reader["Correo"].ToString()!,
                            Telefono = reader["Telefono"].ToString()!,
                            Contrasena = "",
                            TipoUsuario = reader["TipoUsuario"].ToString()!,
                            FechaRegistro = reader["FechaRegistro"].ToString()
                        };
                    }
                }
            }
            return objeto;
        }

        public async Task<RespuestaOperacion> Crear(Usuario objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_CrearUsuario", con);
                cmd.Parameters.AddWithValue("@nombreCompleto", objeto.NombreCompleto);
                cmd.Parameters.AddWithValue("@nombreUsuario", objeto.NombreUsuario);
                cmd.Parameters.AddWithValue("@correo", objeto.Correo);
                cmd.Parameters.AddWithValue("@telefono", objeto.Telefono);
                cmd.Parameters.AddWithValue("@contrasena", objeto.Contrasena);
                cmd.Parameters.AddWithValue("@tipoUsuario", objeto.TipoUsuario);

                SqlParameter respuesta = new SqlParameter("@resultado", SqlDbType.VarChar, 500)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(respuesta);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();

                    return new RespuestaOperacion
                    {
                        NumeroError = 0,
                        Respuesta = respuesta.Value?.ToString() ?? string.Empty
                    };
                }
                catch (Exception ex)
                {
                    return new RespuestaOperacion
                    {
                        NumeroError = -1,
                        Respuesta = ex.Message
                    };
                }
            }
        }

        public async Task<RespuestaOperacion> Editar(Usuario objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_ActualizarUsuario", con);
                cmd.Parameters.AddWithValue("@id", objeto.UsuarioId);
                cmd.Parameters.AddWithValue("@nombreCompleto", objeto.NombreCompleto);
                cmd.Parameters.AddWithValue("@nombreUsuario", objeto.NombreUsuario);
                cmd.Parameters.AddWithValue("@correo", objeto.Correo);
                cmd.Parameters.AddWithValue("@telefono", objeto.Telefono);
                cmd.Parameters.AddWithValue("@tipoUsuario", objeto.TipoUsuario);

                SqlParameter respuesta = new SqlParameter("@resultado", SqlDbType.VarChar, 500)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(respuesta);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();

                    return new RespuestaOperacion
                    {
                        NumeroError = 0,
                        Respuesta = respuesta.Value?.ToString() ?? string.Empty
                    };
                }
                catch (Exception ex)
                {
                    return new RespuestaOperacion
                    {
                        NumeroError = -1,
                        Respuesta = ex.Message
                    };
                }
            }
        }

        public async Task<RespuestaOperacion> Eliminar(int id)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_EliminarUsuario", con);
                cmd.Parameters.AddWithValue("@id", id);

                SqlParameter respuesta = new SqlParameter("@resultado", SqlDbType.VarChar, 500)
                {
                    Direction = ParameterDirection.Output
                };
                cmd.Parameters.Add(respuesta);
                cmd.CommandType = CommandType.StoredProcedure;

                try
                {
                    await con.OpenAsync();
                    await cmd.ExecuteNonQueryAsync();

                    return new RespuestaOperacion
                    {
                        NumeroError = 0,
                        Respuesta = respuesta.Value?.ToString() ?? string.Empty
                    };
                }
                catch (Exception ex)
                {
                    return new RespuestaOperacion
                    {
                        NumeroError = -1,
                        Respuesta = ex.Message
                    };
                }
            }
        }
    }
}