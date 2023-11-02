using Dale.Services.DebitCard.Domain.Core.Models.CashBack;
using System;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.CashBack
{
    public interface ICashBackRepository
    {
        Task<bool> MakeCashBackTransaction(string userId, DateTime date, int statusId, decimal commissionAmount
            , UserAgreementModel userAgreement, bool apply);
    }
}