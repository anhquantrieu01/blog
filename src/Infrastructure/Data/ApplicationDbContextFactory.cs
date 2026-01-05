using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;

namespace MyBlog.Infrastructure.Data
{
    public class ApplicationDbContextFactory : IDesignTimeDbContextFactory<ApplicationDbContext>
    {
        public ApplicationDbContext CreateDbContext(string[] args)
        {
            var optionsBuilder = new DbContextOptionsBuilder<ApplicationDbContext>();

            // Connection string NeonDB
            optionsBuilder.UseNpgsql("Host=ep-spring-glade-aenzi610-pooler.c-2.us-east-2.aws.neon.tech;Database=blog;Username=neondb_owner;Password=npg_FE7NwPCf8lXz;SSL Mode=Require;Trust Server Certificate=true");

            return new ApplicationDbContext(optionsBuilder.Options);
        }
    }
}
