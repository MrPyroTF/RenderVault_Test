namespace MiWebAPI.Models
{
    public class Administrador
    {
        public int AdminId { get; set; }
        public string NombreUsuario { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string NivelAcceso { get; set; } = "Total";
        public string? FechaCreacion { get; set; }
    }
}