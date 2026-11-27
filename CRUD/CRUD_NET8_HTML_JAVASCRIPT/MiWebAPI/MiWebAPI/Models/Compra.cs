namespace MiWebAPI.Models
{
    public class Compra
    {
        public int CompraId { get; set; }
        public int UsuarioId { get; set; }
        public int? ProductoId { get; set; }
        public int? ComisionId { get; set; }
        public string? FechaCompra { get; set; }
    }
}