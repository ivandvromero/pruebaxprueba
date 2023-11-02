using Dale.Services.DebitCard.Domain.Core.Entities;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IDebitCardCashBackDetailRepository
    {        
        Task<bool> InsertCardCashBackFailedTransaction(List<DebitCardCashBackDetailEntity> ltsDebitCardCashBackDetail, int status);        
    }
}