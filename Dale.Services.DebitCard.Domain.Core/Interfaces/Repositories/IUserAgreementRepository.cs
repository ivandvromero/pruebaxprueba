using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Models.CashBack;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IUserAgreementRepository
    {
        Task<AgreementEntity> GetUserAgreementByProgramId(string userId, string programId, int statusId);
        Task<UserAgreementModel> GetUserAgreementByUserId(string userId);
    }
}
