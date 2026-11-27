using MiWebAPI.Models;
using System.Data;
using System.Data.SqlClient;

namespace MiWebAPI.Data
{
    public class AdministradorData
    {
        private readonly string _cadenaSQL;

        public AdministradorData(IConfiguration configuration)
        {
            _cadenaSQL = configuration.GetConnectionString("CadenaSQL");
        }

        public async Task<Administrador?> ValidarLogin(string correo, string contrasena)
        {
            Administrador? objeto = null;

            using (var conexion = new SqlConnection(_cadenaSQL))
            {
                await conexion.OpenAsync();
                using (var cmd = new SqlCommand("sp_validarAdministrador", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.Add("@Correo", SqlDbType.VarChar, 150).Value = correo;
                    cmd.Parameters.Add("@Contrasena", SqlDbType.VarChar, 255).Value = contrasena;

                    using (var dr = await cmd.ExecuteReaderAsync())
                    {
                        if (await dr.ReadAsync())
                        {
                            objeto = new Administrador
                            {
                                AdminId = HasColumn(dr, "AdminId") && dr["AdminId"] != DBNull.Value
                                    ? Convert.ToInt32(dr["AdminId"])
                                    : 0,
                                NombreUsuario = HasColumn(dr, "NombreUsuario") && dr["NombreUsuario"] != DBNull.Value
                                    ? dr["NombreUsuario"].ToString()!
                                    : string.Empty,
                                Correo = HasColumn(dr, "Correo") && dr["Correo"] != DBNull.Value
                                    ? dr["Correo"].ToString()!
                                    : string.Empty,
                                NivelAcceso = HasColumn(dr, "NivelAcceso") && dr["NivelAcceso"] != DBNull.Value
                                    ? dr["NivelAcceso"].ToString()!
                                    : "Total"
                            };
                        }
                    }
                }
            }

            return objeto;
        }

        public async Task<List<Administrador>> Lista()
        {
            var lista = new List<Administrador>();

            using (var conexion = new SqlConnection(_cadenaSQL))
            {
                await conexion.OpenAsync();
                using (var cmd = new SqlCommand("sp_ListarAdministrador", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    using (var dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            lista.Add(new Administrador
                            {
                                AdminId = Convert.ToInt32(dr["AdminId"]),
                                NombreUsuario = dr["NombreUsuario"].ToString()!,
                                Correo = dr["Correo"].ToString()!,
                                NivelAcceso = dr["NivelAcceso"].ToString()!,
                                FechaCreacion = dr["FechaCreacion"] != DBNull.Value
                                    ? Convert.ToDateTime(dr["FechaCreacion"]).ToString("dd/MM/yyyy hh:mm tt")
                                    : ""
                            });
                        }
                    }
                }
            }

            return lista;
        }

        public async Task<Administrador?> Obtener(int id)
        {
            Administrador? objeto = null;

            using (var conexion = new SqlConnection(_cadenaSQL))
            {
                await conexion.OpenAsync();
                using (var cmd = new SqlCommand("sp_ObtenerAdministrador", conexion))
                {
                    cmd.CommandType = CommandType.StoredProcedure;
                    cmd.Parameters.AddWithValue("@id", id);

                    using (var dr = await cmd.ExecuteReaderAsync())
                    {
                        while (await dr.ReadAsync())
                        {
                            objeto = new Administrador
                            {
                                AdminId = Convert.ToInt32(dr["AdminId"]),
                                NombreUsuario = dr["NombreUsuario"].ToString()!,
                                Correo = dr["Correo"].ToString()!,
                                NivelAcceso = dr["NivelAcceso"].ToString()!
                            };
                        }
                    }
                }
            }

            return objeto;
        }

        public async Task<object> Crear(Administrador objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(_cadenaSQL))
                {
                    await conexion.OpenAsync();
                    using (var cmd = new SqlCommand("sp_CrearAdministrador", conexion))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@nombreUsuario", objeto.NombreUsuario);
                        cmd.Parameters.AddWithValue("@correo", objeto.Correo);
                        cmd.Parameters.AddWithValue("@contrasena", objeto.Contrasena);
                        cmd.Parameters.AddWithValue("@nivelAcceso", objeto.NivelAcceso);
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
                return new { isSuccess = true, respuesta = "Guardado correctamente" };
            }
            catch (Exception ex)
            {
                return new { isSuccess = false, respuesta = ex.Message };
            }
        }

        public async Task<object> Editar(Administrador objeto)
        {
            try
            {
                using (var conexion = new SqlConnection(_cadenaSQL))
                {
                    await conexion.OpenAsync();
                    using (var cmd = new SqlCommand("sp_ActualizarAdministrador", conexion))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", objeto.AdminId);
                        cmd.Parameters.AddWithValue("@nombreUsuario", objeto.NombreUsuario);
                        cmd.Parameters.AddWithValue("@correo", objeto.Correo);
                        cmd.Parameters.AddWithValue("@nivelAcceso", objeto.NivelAcceso);
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
                return new { isSuccess = true, respuesta = "Actualizado correctamente" };
            }
            catch (Exception ex)
            {
                return new { isSuccess = false, respuesta = ex.Message };
            }
        }

        public async Task<object> Eliminar(int id)
        {
            try
            {
                using (var conexion = new SqlConnection(_cadenaSQL))
                {
                    await conexion.OpenAsync();
                    using (var cmd = new SqlCommand("sp_EliminarAdministrador", conexion))
                    {
                        cmd.CommandType = CommandType.StoredProcedure;
                        cmd.Parameters.AddWithValue("@id", id);
                        await cmd.ExecuteNonQueryAsync();
                    }
                }
                return new { isSuccess = true, respuesta = "Eliminado correctamente" };
            }
            catch (Exception ex)
            {
                return new { isSuccess = false, respuesta = ex.Message };
            }
        }

        private static bool HasColumn(IDataRecord dr, string columnName)
        {
            for (int i = 0; i < dr.FieldCount; i++)
            {
                if (string.Equals(dr.GetName(i), columnName, StringComparison.OrdinalIgnoreCase))
                {
                    return true;
                }
            }
            return false;
        }
    }
}