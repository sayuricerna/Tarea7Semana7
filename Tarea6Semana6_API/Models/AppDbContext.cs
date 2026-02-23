using Microsoft.EntityFrameworkCore;
using Tarea6Semana6_API.Models;
namespace Tarea6Semana6_API.Models
{
    using Microsoft.EntityFrameworkCore;
    using System;
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Factura> Facturas { get; set; }
    }
}
