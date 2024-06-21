using Trendsetter_Threads.API.Data.Entity;
using Microsoft.EntityFrameworkCore;
using Style_Central.API.Data.Entity.DbSet;

namespace Trendsetter_Threads.API.Data.Entity;
public class StyleCentralDbContext: DbContext
{
    public StyleCentralDbContext(DbContextOptions<StyleCentralDbContext> options)
          : base(options)
    {
    }
    public DbSet<User> Users { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
}

