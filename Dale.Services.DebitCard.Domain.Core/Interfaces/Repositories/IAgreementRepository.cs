using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IAgreementRepository
    {
        Task<AgreementEntity> GetAgreementByProgramId(string programId, int statusId);
        Task<AgreementEntity> GetAgreementById(int? Id);
    }
}
