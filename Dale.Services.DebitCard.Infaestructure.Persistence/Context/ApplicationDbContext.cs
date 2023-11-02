using Dale.Services.DebitCard.Domain.Core.Entities;
using Microsoft.EntityFrameworkCore;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Context
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions options) : base(options)
        {

        }

        public DbSet<RequestLog> RequestLogs { get; set; }

    }
}
