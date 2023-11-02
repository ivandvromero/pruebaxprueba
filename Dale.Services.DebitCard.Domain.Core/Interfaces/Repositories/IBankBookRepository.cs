using System;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IBankBookRepository
    {
        Task<Tuple<bool, int>> GetLastBankBookIdForUser(string userId);
    }
}
