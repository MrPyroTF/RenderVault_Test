using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class ReviewData
    {
        private readonly string conexion;

        public ReviewData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Review>> Lista(int productoId = 0)
        {
            List<Review> lista = new List<Review>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListaReview", con);
                cmd.Parameters.AddWithValue("@productoId", productoId);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Review
                        {
                            ReviewId = Convert.ToInt32(reader["ReviewId"]),
                            ProductoId = Convert.ToInt32(reader["ProductoId"]),
                            UsuarioId = Convert.ToInt32(reader["UsuarioId"]),
                            Calificacion = Convert.ToInt32(reader["Calificacion"]),
                            Comentario = reader["Comentario"].ToString()!,
                            FechaResena = reader["FechaResena"]?.ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<Review> Obtener(int id)
        {
            Review objeto = new Review();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerReview", con);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        objeto = new Review
                        {
                            ReviewId = Convert.ToInt32(reader["ReviewId"]),
                            ProductoId = Convert.ToInt32(reader["ProductoId"]),
                            UsuarioId = Convert.ToInt32(reader["UsuarioId"]),
                            Calificacion = Convert.ToInt32(reader["Calificacion"]),
                            Comentario = reader["Comentario"].ToString()!,
                            FechaResena = reader["FechaResena"]?.ToString()
                        };
                    }
                }
            }
            return objeto;
        }

        public async Task<RespuestaOperacion> Crear(Review objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_CrearReview", con);
                cmd.Parameters.AddWithValue("@productoId", objeto.ProductoId);
                cmd.Parameters.AddWithValue("@usuarioId", objeto.UsuarioId);
                cmd.Parameters.AddWithValue("@calificacion", objeto.Calificacion);
                cmd.Parameters.AddWithValue("@comentario", objeto.Comentario);

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

        public async Task<RespuestaOperacion> Editar(Review objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_ActualizarReview", con);
                cmd.Parameters.AddWithValue("@id", objeto.ReviewId);
                cmd.Parameters.AddWithValue("@calificacion", objeto.Calificacion);
                cmd.Parameters.AddWithValue("@comentario", objeto.Comentario);

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
                SqlCommand cmd = new SqlCommand("sp_EliminarReview", con);
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