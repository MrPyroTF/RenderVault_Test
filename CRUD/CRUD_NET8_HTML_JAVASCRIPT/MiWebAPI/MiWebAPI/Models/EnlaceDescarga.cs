namespace MiWebAPI.Models
{
    public class EnlaceDescarga
    {
        public int EnlaceId { get; set; }
        public int ProductoId { get; set; }
        public string EnlaceFbx { get; set; } = string.Empty;
        public string EnlaceGlb { get; set; } = string.Empty;
        public string EnlaceObj { get; set; } = string.Empty;
    }
}