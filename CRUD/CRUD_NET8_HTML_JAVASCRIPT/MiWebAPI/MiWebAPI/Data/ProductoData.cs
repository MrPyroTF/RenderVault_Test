using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class ProductoData
    {
        private readonly string conexion;

        public ProductoData(IConfiguration configuration)
        {
            conexion = configuration.GetConnectionString("CadenaSQL")!;
        }

        public async Task<List<Producto>> Lista()
        {
            List<Producto> lista = new List<Producto>();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ListaProducto", con);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        lista.Add(new Producto
                        {
                            ProductoId = Convert.ToInt32(reader["ProductoId"]),
                            VendedorId = reader["VendedorId"] != DBNull.Value ? Convert.ToInt32(reader["VendedorId"]) : 0,
                            Titulo = reader["Titulo"].ToString()!,
                            Descripcion = reader["Descripcion"].ToString()!,
                            Precio = Convert.ToDecimal(reader["Precio"]),
                            EnlaceFbx = reader["EnlaceFbx"]?.ToString(),
                            EnlaceObj = reader["EnlaceObj"]?.ToString(),
                            EnlaceGlb = reader["EnlaceGlb"]?.ToString(),
                            Visitas = reader["Visitas"] != DBNull.Value ? Convert.ToInt32(reader["Visitas"]) : 0,
                            Poligonos = reader["Poligonos"] != DBNull.Value ? Convert.ToInt32(reader["Poligonos"]) : 0,
                            CalificacionPromedio = reader["CalificacionPromedio"] != DBNull.Value ? Convert.ToDecimal(reader["CalificacionPromedio"]) : 0,
                            FechaCreacion = reader["FechaCreacion"]?.ToString()
                        });
                    }
                }
            }
            return lista;
        }

        public async Task<Producto> Obtener(int id)
        {
            Producto objeto = new Producto();

            using (var con = new SqlConnection(conexion))
            {
                await con.OpenAsync();
                SqlCommand cmd = new SqlCommand("sp_ObtenerProducto", con);
                cmd.Parameters.AddWithValue("@id", id);
                cmd.CommandType = CommandType.StoredProcedure;

                using (var reader = await cmd.ExecuteReaderAsync())
                {
                    while (await reader.ReadAsync())
                    {
                        objeto = new Producto
                        {
                            ProductoId = Convert.ToInt32(reader["ProductoId"]),
                            VendedorId = reader["VendedorId"] != DBNull.Value ? Convert.ToInt32(reader["VendedorId"]) : 0,
                            Titulo = reader["Titulo"].ToString()!,
                            Descripcion = reader["Descripcion"].ToString()!,
                            Precio = Convert.ToDecimal(reader["Precio"]),
                            EnlaceFbx = reader["EnlaceFbx"]?.ToString(),
                            EnlaceObj = reader["EnlaceObj"]?.ToString(),
                            EnlaceGlb = reader["EnlaceGlb"]?.ToString(),
                            Visitas = reader["Visitas"] != DBNull.Value ? Convert.ToInt32(reader["Visitas"]) : 0,
                            Poligonos = reader["Poligonos"] != DBNull.Value ? Convert.ToInt32(reader["Poligonos"]) : 0,
                            CalificacionPromedio = reader["CalificacionPromedio"] != DBNull.Value ? Convert.ToDecimal(reader["CalificacionPromedio"]) : 0,
                            FechaCreacion = reader["FechaCreacion"]?.ToString()
                        };
                    }
                }
            }
            return objeto;
        }

        public async Task<RespuestaOperacion> Crear(Producto objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_CrearProducto", con);
                cmd.Parameters.AddWithValue("@vendedorId", objeto.VendedorId);
                cmd.Parameters.AddWithValue("@titulo", objeto.Titulo);
                cmd.Parameters.AddWithValue("@descripcion", objeto.Descripcion);
                cmd.Parameters.AddWithValue("@precio", objeto.Precio);
                cmd.Parameters.AddWithValue("@enlaceFbx", (object?)objeto.EnlaceFbx ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceObj", (object?)objeto.EnlaceObj ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceGlb", (object?)objeto.EnlaceGlb ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@poligonos", objeto.Poligonos);

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

        public async Task<RespuestaOperacion> Editar(Producto objeto)
        {
            using (var con = new SqlConnection(conexion))
            {
                SqlCommand cmd = new SqlCommand("sp_ActualizarProducto", con);
                cmd.Parameters.AddWithValue("@id", objeto.ProductoId);
                cmd.Parameters.AddWithValue("@titulo", objeto.Titulo);
                cmd.Parameters.AddWithValue("@descripcion", objeto.Descripcion);
                cmd.Parameters.AddWithValue("@precio", objeto.Precio);
                cmd.Parameters.AddWithValue("@enlaceFbx", (object?)objeto.EnlaceFbx ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceObj", (object?)objeto.EnlaceObj ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@enlaceGlb", (object?)objeto.EnlaceGlb ?? DBNull.Value);
                cmd.Parameters.AddWithValue("@poligonos", objeto.Poligonos);

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
                SqlCommand cmd = new SqlCommand("sp_EliminarProducto", con);
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