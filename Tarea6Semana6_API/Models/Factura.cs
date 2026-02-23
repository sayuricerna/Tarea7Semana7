using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Tarea6Semana6_API.Models
{
    public class Factura
    {
        public int Id { get; set; }
        public string NumeroFactura { get; set; }
        public DateTime Fecha { get; set; }
        public string CedulaRuc { get; set; } 
        public string NombreCliente { get; set; } 
        public string? Direccion { get; set; }
        public string? Telefono { get; set; }
        public string? Descripcion { get; set; }
        public decimal Subtotal { get; set; }
        public decimal Iva { get; set; }
        public decimal Total { get; set; }
        public string Estado { get; set; } = "ACTIVA"; 
    }
}
