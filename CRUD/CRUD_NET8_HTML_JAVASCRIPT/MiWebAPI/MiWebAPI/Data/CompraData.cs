using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class CompraData
    {
        private readonly string conexion;

        public CompraData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Compra>> Lista(int usuarioId = 0)
        {
            List<Compra> lista = new List<Compra>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListarCompra", con);
                cmd.Parameters.AddWithValue("@usuarioId", usuarioId);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Compra
                        {
                            CompraId = Convert.ToInt32(reader["CompraId"]),
                            UsuarioId = Convert.ToInt32(reader["UsuarioId"]),
                            ProductoId = reader["ProductoId"] != DBNull.Value ? Convert.ToInt32(reader["ProductoId"]) : null,
                            ComisionId = reader["ComisionId"] != DBNull.Value ? Convert.ToInt32(reader["ComisionId"]) : null,
                            FechaCompra = reader["FechaCompra"]?.ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<Compra> Obtener(int id)
        {
            Compra objeto = new Compra();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerCompra", con);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        objeto = new Compra
                        {
                            CompraId = Convert.ToInt32(reader["CompraId"]),
                            UsuarioId = Convert.ToInt32(reader["UsuarioId"]),
                            ProductoId = reader["ProductoId"] != DBNull.Value ? Convert.ToInt32(reader["ProductoId"]) : null,
                            ComisionId = reader["ComisionId"] != DBNull.Value ? Convert.ToInt32(reader["ComisionId"]) : null,
                            FechaCompra = reader["FechaCompra"]?.ToString()
                        };
                    }
                }
            }
            return objeto;
        }

        public async Task<RespuestaOperacion> Crear(Compra objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_CrearCompra", con);
                cmd.Parameters.AddWithValue("@usuarioId", objeto.UsuarioId);
                cmd.Parameters.AddWithValue("@productoId", (object?)objeto.ProductoId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@comisionId", (object?)objeto.ComisionId ?? DBNull.Value);

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

        public async Task<RespuestaOperacion> Editar(Compra objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_ActualizarCompra", con);
                cmd.Parameters.AddWithValue("@id", objeto.CompraId);
                cmd.Parameters.AddWithValue("@usuarioId", objeto.UsuarioId);
                cmd.Parameters.AddWithValue("@productoId", (object?)objeto.ProductoId ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@comisionId", (object?)objeto.ComisionId ?? DBNull.Value);

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
                SqlCommand cmd = new SqlCommand("sp_EliminarCompra", con);
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