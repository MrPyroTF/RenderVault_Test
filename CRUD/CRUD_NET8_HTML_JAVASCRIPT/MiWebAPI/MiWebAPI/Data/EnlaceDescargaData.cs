using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class EnlaceDescargaData
    {
        private readonly string conexion;

        public EnlaceDescargaData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<EnlaceDescarga>> Lista(int productoId = 0)
        {
            List<EnlaceDescarga> lista = new List<EnlaceDescarga>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListarEnlaceDescarga", con);
                cmd.Parameters.AddWithValue("@productoId", productoId);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new EnlaceDescarga
                        {
                            EnlaceId = Convert.ToInt32(reader["EnlaceId"]),
                            ProductoId = Convert.ToInt32(reader["ProductoId"]),
                            EnlaceFbx = reader["EnlaceFbx"]?.ToString() ?? string.Empty,
                            EnlaceGlb = reader["EnlaceGlb"]?.ToString() ?? string.Empty,
                            EnlaceObj = reader["EnlaceObj"]?.ToString() ?? string.Empty
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<EnlaceDescarga> Obtener(int id)
        {
            EnlaceDescarga objeto = new EnlaceDescarga();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerEnlaceDescarga", con);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        objeto = new EnlaceDescarga
                        {
                            EnlaceId = Convert.ToInt32(reader["EnlaceId"]),
                            ProductoId = Convert.ToInt32(reader["ProductoId"]),
                            EnlaceFbx = reader["EnlaceFbx"]?.ToString() ?? string.Empty,
                            EnlaceGlb = reader["EnlaceGlb"]?.ToString() ?? string.Empty,
                            EnlaceObj = reader["EnlaceObj"]?.ToString() ?? string.Empty
                        };
                    }
                }
            }
            return objeto;
        }

        public async Task<RespuestaOperacion> Crear(EnlaceDescarga objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_CrearEnlaceDescarga", con);
                cmd.Parameters.AddWithValue("@productoId", objeto.ProductoId);
                cmd.Parameters.AddWithValue("@enlaceFbx", (object?)objeto.EnlaceFbx ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceGlb", (object?)objeto.EnlaceGlb ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceObj", (object?)objeto.EnlaceObj ?? DBNull.Value);

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

        public async Task<RespuestaOperacion> Editar(EnlaceDescarga objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_ActualizarEnlaceDescarga", con);
                cmd.Parameters.AddWithValue("@id", objeto.EnlaceId);
                cmd.Parameters.AddWithValue("@productoId", objeto.ProductoId);
                cmd.Parameters.AddWithValue("@enlaceFbx", (object?)objeto.EnlaceFbx ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceGlb", (object?)objeto.EnlaceGlb ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceObj", (object?)objeto.EnlaceObj ?? DBNull.Value);

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
                SqlCommand cmd = new SqlCommand("sp_EliminarEnlaceDescarga", con);
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