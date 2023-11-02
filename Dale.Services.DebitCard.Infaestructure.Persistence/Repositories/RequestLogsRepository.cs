using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Infaestructure.Persistence.Context;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories
{
    public class RequestLogsRepository : IRequestLogsRepository
    {

        private readonly ApplicationDbContext _context;

        public RequestLogsRepository(ApplicationDbContext context)
        {
            _context = context;
        }

        public async Task<RequestLog> AddLog(RequestLog data)
        {
            data.CreatedAtUtc = DateTime.UtcNow;
            _context.RequestLogs.Add(data);
            await _context.SaveChangesAsync();
            return data;
        }

        public async Task<RequestLog> UpdateLog(int logId, RequestLog data)
        {
            var result = await  _context.RequestLogs.Where(x => x.Id == logId).FirstOrDefaultAsync();
            if (result != null)
            {
                result.ResponseData = data.ResponseData;
                await _context.SaveChangesAsync();
            }
            return data;
        }
    }
}
