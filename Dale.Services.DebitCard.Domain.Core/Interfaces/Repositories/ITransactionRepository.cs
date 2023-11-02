using Dale.Services.DebitCard.Domain.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface ITransactionRepository
    {
        Task<List<TransactionEntity>> GetHandligFeeTransactions(string userId, int statusId);
        Task<decimal> GetAmtConvert(string mCCUber, string mCCUberCash, string mTI, DateTime date,string userId);
        Task<bool> UpdateTransactionStatus(int transactionId, int statusId);
    }
}
