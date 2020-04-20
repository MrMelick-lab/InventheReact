using Microsoft.EntityFrameworkCore;
using System;

namespace InventheReact.Models
{
    public class ProductsContext : DbContext
    {
        public ProductsContext(DbContextOptions<ProductsContext> options)
            : base(options)
        { }

        public DbSet<Products> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Products>()
                .Property(b => b.Label)
                .IsRequired();

            modelBuilder.Entity<Products>()
                .Property(b => b.Quantity)
                .IsRequired();
        }
    }

    public class Products
    {
        public Guid Id { get; set; }
        public string Label { get; set; }
        public double Quantity { get; set; }
    }
}
