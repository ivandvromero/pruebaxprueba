using Dale.Services.DebitCard.Domain.Core.Entities;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public interface IHandlingFeeRepository
    {
        Task<List<TransactionEntity>> GetAllTransactionByUserIdAndCategory(string userId, DateTime date, int statusId, string category);
        //TODO: GET Last transaction for user LM
        Task<TransactionEntity> GetLastTransactionForUser(string userId, string category, int statusId);
        Task<bool> MakeHandlingFeeTransaction(string userId, DateTime date, int statusId, decimal commissionAmount, int agreementId, bool IsWalo = false);
        Task<HandlingFeeEntity> GetLastTransactionByUserId(string userId);
        Task<List<TransactionEntity>> GetTransactionsDebitCard(string userId, DateTime date, int statusId, string category);
        Task<List<HandlingFeeEntity>> GetUserPendingTransactions(string userId, int agreementId, int statusId);
        Task<HandlingFeeEntity> GetLastPayRealizedByUserId(string userId);
        Task<List<AllyPartnerHandlingFeeEntity>> GetAllyPartnerHandlingFees(string userId, int agreementId, int statusId);
    }
}
