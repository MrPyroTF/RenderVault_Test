using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class ComisionData
    {
        private readonly string conexion;

        public ComisionData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Comision>> Lista(int id = 0)
        {
            List<Comision> lista = new List<Comision>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListarComision", con);
                cmd.Parameters.AddWithValue("@ComisionId", id > 0 ? id : DBNull.Value);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Comision
                        {
                            ComisionId = Convert.ToInt32(reader["ComisionId"]),
                            CompradorId = Convert.ToInt32(reader["CompradorId"]),
                            VendedorId = reader["VendedorId"] != DBNull.Value ? Convert.ToInt32(reader["VendedorId"]) : 0,
                            Nombre = reader["Nombre"].ToString()!,
                            TipoArchivo = reader["TipoArchivo"].ToString()!,
                            LinkGitHubPreview = reader["LinkGitHubPreview"]?.ToString() ?? string.Empty,
                            LinkDescarga = reader["LinkDescarga"]?.ToString() ?? string.Empty,
                            Pagado = reader["Pagado"] != DBNull.Value && Convert.ToBoolean(reader["Pagado"]),
                            Total = reader["Total"] != DBNull.Value ? Convert.ToDecimal(reader["Total"]) : 0,
                            FechaCreacion = reader["FechaCreacion"]?.ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<Comision> Obtener(int id)
        {
            Comision objeto = new Comision();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerComision", con);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        objeto = new Comision
                        {
                            ComisionId = Convert.ToInt32(reader["ComisionId"]),
                            CompradorId = Convert.ToInt32(reader["CompradorId"]),
                            VendedorId = reader["VendedorId"] != DBNull.Value ? Convert.ToInt32(reader["VendedorId"]) : 0,
                            Nombre = reader["Nombre"].ToString()!,
                            TipoArchivo = reader["TipoArchivo"].ToString()!,
                            LinkGitHubPreview = reader["LinkGitHubPreview"]?.ToString() ?? string.Empty,
                            LinkDescarga = reader["LinkDescarga"]?.ToString() ?? string.Empty,
                            Pagado = reader["Pagado"] != DBNull.Value && Convert.ToBoolean(reader["Pagado"]),
                            Total = reader["Total"] != DBNull.Value ? Convert.ToDecimal(reader["Total"]) : 0,
                            FechaCreacion = reader["FechaCreacion"]?.ToString()
                        };
                    }
                }
            }
            return objeto;
        }

        public async Task<RespuestaOperacion> Crear(Comision objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_CrearComision", con);
                cmd.Parameters.AddWithValue("@compradorId", objeto.CompradorId);
                cmd.Parameters.AddWithValue("@vendedorId", objeto.VendedorId);
                cmd.Parameters.AddWithValue("@nombre", objeto.Nombre);
                cmd.Parameters.AddWithValue("@tipoArchivo", objeto.TipoArchivo);
                cmd.Parameters.AddWithValue("@linkGitHubPreview", (object?)objeto.LinkGitHubPreview ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@linkDescarga", (object?)objeto.LinkDescarga ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@pagado", objeto.Pagado);
                cmd.Parameters.AddWithValue("@total", objeto.Total);

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

        public async Task<RespuestaOperacion> Editar(Comision objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_ActualizarComision", con);
                cmd.Parameters.AddWithValue("@id", objeto.ComisionId);
                cmd.Parameters.AddWithValue("@compradorId", objeto.CompradorId);
                cmd.Parameters.AddWithValue("@vendedorId", objeto.VendedorId);
                cmd.Parameters.AddWithValue("@nombre", objeto.Nombre);
                cmd.Parameters.AddWithValue("@tipoArchivo", objeto.TipoArchivo);
                cmd.Parameters.AddWithValue("@linkGitHubPreview", (object?)objeto.LinkGitHubPreview ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@linkDescarga", (object?)objeto.LinkDescarga ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@pagado", objeto.Pagado);
                cmd.Parameters.AddWithValue("@total", objeto.Total);

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
                SqlCommand cmd = new SqlCommand("sp_EliminarComision", con);
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