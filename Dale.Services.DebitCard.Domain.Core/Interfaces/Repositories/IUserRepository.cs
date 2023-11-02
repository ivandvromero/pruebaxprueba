using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IUserRepository
    {
        Task<UserEntity> GetUserById(string userId);
        Task<bool> UpdateUserStatus(string userId, int statusId);
        Task<bool> UpdateDebitCardUserStatus(string userId, int statusId);
    }
}
