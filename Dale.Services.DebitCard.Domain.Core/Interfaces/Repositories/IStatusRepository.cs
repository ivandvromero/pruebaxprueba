using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IStatusRepository
    {
        Task<StatusEntity> GetStatus(string systemName, StatusTypes type);
    }
}
