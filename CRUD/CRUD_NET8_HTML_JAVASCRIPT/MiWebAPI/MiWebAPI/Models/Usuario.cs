namespace MiWebAPI.Models
{
    public class Usuario
    {
        public int UsuarioId { get; set; }
        public string NombreCompleto { get; set; } = string.Empty;
        public string NombreUsuario { get; set; } = string.Empty;
        public string Correo { get; set; } = string.Empty;
        public string Telefono { get; set; } = string.Empty;
        public string Contrasena { get; set; } = string.Empty;
        public string TipoUsuario { get; set; } = "Comprador";
        public string? FechaRegistro { get; set; }
    }
}