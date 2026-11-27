namespace MiWebAPI.Models
{
    public class Comision
    {
        public int ComisionId { get; set; }
        public int CompradorId { get; set; }
        public int VendedorId { get; set; }
        public string Nombre { get; set; } = string.Empty;
        public string TipoArchivo { get; set; } = string.Empty;
        public string LinkGitHubPreview { get; set; } = string.Empty;
        public string LinkDescarga { get; set; } = string.Empty;
        public bool Pagado { get; set; }
        public decimal Total { get; set; }
        public string? FechaCreacion { get; set; }
    }
}