using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IDebitCardRepository
    {
        Task<DebitCardEntity> GetDebitCard(string userId);
        Task<UserEntity> GetUserByCardTokenDebitCard(string cardtoken);
    }
}
