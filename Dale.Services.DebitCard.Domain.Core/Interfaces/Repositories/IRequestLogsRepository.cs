using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IRequestLogsRepository
    {
        Task<RequestLog> AddLog(RequestLog data);
        Task<RequestLog> UpdateLog(int logId, RequestLog data);
    }
}
