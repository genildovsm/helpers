using Microsoft.EntityFrameworkCore;
using ViewComponentSite.Core.Entities;

namespace ViewComponentSite.Infrastrucuture.Persistence
{
    public sealed class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<Category> Categories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Category>().HasData(
                new Category { Id = 1, Name = "Eletrônicos", Description = "Eletrônicos e Eletrodomésticos"},
                new Category { Id = 2, Name = "Limpeza", Description = "Higiene e limpeza em geral" },
                new Category { Id = 3, Name = "Cosméticos", Description = "Estética e beleza" }
                );
        }
    }
}
