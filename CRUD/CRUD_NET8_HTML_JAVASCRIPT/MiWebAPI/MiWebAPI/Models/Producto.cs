namespace MiWebAPI.Models
{
    public class Producto
    {
        public int ProductoId { get; set; }
        public int VendedorId { get; set; }
        public string Titulo { get; set; } = string.Empty;
        public string Descripcion { get; set; } = string.Empty;
        public decimal Precio { get; set; }
        public string? EnlaceFbx { get; set; }
        public string? EnlaceObj { get; set; }
        public string? EnlaceGlb { get; set; }
        public int Visitas { get; set; }
        public int Poligonos { get; set; }
        public decimal CalificacionPromedio { get; set; }
        public string? FechaCreacion { get; set; }
    }
}