namespace MiWebAPI.Models
{
    public class Review
    {
        public int ReviewId { get; set; }
        public int ProductoId { get; set; }
        public int UsuarioId { get; set; }
        public int Calificacion { get; set; }
        public string Comentario { get; set; } = string.Empty;
        public string? FechaResena { get; set; }
    }
}