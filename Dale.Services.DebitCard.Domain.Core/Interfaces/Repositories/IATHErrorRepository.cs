using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IATHErrorRepository
    {
        Task<ATHErrorEntity> GetByCode(string code);
    }
}
