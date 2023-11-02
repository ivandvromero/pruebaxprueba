using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.Models.Transaction;
using Dale.Services.DebitCard.Infaestructure.Helpers;
using Dapper;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.HandlingFee
{
    public class HandlingFeeRepository : IHandlingFeeRepository
    {
        private readonly IDbConnection _dbConnection;
        private readonly IBankBookRepository _ibankBookRepository;
        private readonly IHolidayRepository _iholidayRepository;
        private readonly IUserRepository _iuserRepository;
        private readonly IATHErrorRepository _iathErrorRepository;
        
        public HandlingFeeRepository(IDbConnection dbConnection,
                                     IBankBookRepository ibankBookRepository,
                                     IHolidayRepository iholidayRepository,
                                     IUserRepository iuserRepository,
                                     IATHErrorRepository athErrorRepository)
        {
            _dbConnection = dbConnection;
            _ibankBookRepository = ibankBookRepository;
            _iholidayRepository = iholidayRepository;
            _iuserRepository = iuserRepository;
            _iathErrorRepository = athErrorRepository;
        }
        public async Task<List<TransactionEntity>> GetAllTransactionByUserIdAndCategory(string userId, DateTime date, int statusId, string category)
        {

            var query = @$"SELECT *
                           FROM Transactions t 
                           INNER JOIN Authorizations a ON a.TransactionId = t.Id
                           WHERE t.UserId = '{userId}'
                           AND MONTH(t.Date) >= {date.Month}
                           AND YEAR(t.Date) >= {date.Year}
                           AND DAY(t.Date) >= {date.Day}
                           AND t.StatusId = {statusId} 
                           AND t.TypeId IN (SELECT Id FROM TransactionTypes WHERE CategoryId = {Convert.ToInt32(category)})";
            var result = (await _dbConnection.QueryAsync<TransactionEntity>(query)).ToList();
            return result;
        }

        public async Task<TransactionEntity> GetLastTransactionForUser(string userId, string category, int statusId)
        {

            var query = @$"SELECT  top 1 * FROM Transactions t 
                           INNER JOIN Authorizations a ON a.TransactionId = t.Id  WHERE  t.UserId = '{userId}'
                           AND t.StatusId = {statusId} 
                           AND t.TypeId IN (SELECT Id FROM TransactionTypes WHERE CategoryId = {Convert.ToInt32(category)})
						   order by t.Date desc";
            var result = (await _dbConnection.QueryAsync<TransactionEntity>(query)).FirstOrDefault();
            return result;
        }

        public async Task<bool> MakeHandlingFeeTransaction(string userId, DateTime date, int statusId, decimal commissionAmount, int agreementId, bool isWalo = false)
        {

            var user = await _iuserRepository.GetUserById(userId);
            var nextWorkingDate = await _iholidayRepository.GetNextBusinessDayAsync();
            var nextWorkingDateUtc = nextWorkingDate.ToUTC(Resources.columbianTimezoneId);
            ATHErrorEntity athError = await _iathErrorRepository.GetByCode(AthErrorCode.ATM_TRANSACCION_EXITOSA);
            
            var (found, value) = await _ibankBookRepository.GetLastBankBookIdForUser(userId);
            int bankBookId = found? value : -value;

            TransactionBindingModel objParameters = new TransactionBindingModel() {
                UserId = userId,
                ApprovalId = Global.GetApprovalId(user.CardNumber),
                StatusId = statusId,
                CategoryCode = CategoryTransactions.Others.ToString(),
                TypeCode = isWalo ? TypeTransactions.Others_HandlingFeeWaloPay.ToString() : TypeTransactions.Others_HandlingFeeLMPay.ToString(),
                Amount = commissionAmount,
                BankBookId = bankBookId,
                SenderFee = 0,
                RecieverFee = 0,
                SenderTax = 0,
                SenderGMF = 0,
                RecieverTax = 0,
                RecieverGMF = 0,
                TransactionCode = isWalo ? TransactionCodes.HandlingFeeWalo : TransactionCodes.HandlingFeeLM,
                TransactionTagType = isWalo ? (int)TransactionTaggingType.DebitCardWaloHandlingFee : (int)TransactionTaggingType.DebitCardLMHandlingFee,
                TransactionTagDate = nextWorkingDate,
                IVAAmount = 0,
                GMFAmount = 0,
                FeeAmount = 0,
                ResultCode = TransactionHelper.GetStatusCode(athError.B24),
                AgreementId = agreementId,
                AcquirerBankId = null,
                BranchId = null,
                NextDate = DateTime.Now,
                ClientDate = DateTime.Now,
                AtmWithdrawalRequestId = null,
                RqUID = null,
                OriginalTransactionId = null,
                IsRetract = false,
                ProductTypeId = ProductTypeCodes.ElectronicDeposit,
                TypeBankBook = TransactionKind.Credit.ToString()
            };


            var storedProcedureName = "AddTransaction";
            var result = (await _dbConnection.ExecuteAsync(storedProcedureName, objParameters, commandType: CommandType.StoredProcedure));
            return result > 0? true: false;
        }

        public async Task<HandlingFeeEntity> GetLastTransactionByUserId(string userId)
        {
            var query = @$"SELECT *
                           FROM HandlingFees h
						   INNER JOIN Transactions t ON h.TransactionId = t.Id
                           WHERE t.UserId = '{userId}'
                           ORDER BY h.Date DESC";
            var result = (await _dbConnection.QueryAsync<HandlingFeeEntity>(query)).FirstOrDefault();
            return result;
        }
        public async Task<HandlingFeeEntity> GetLastPayRealizedByUserId(string userId)
        {
            var query = @$"with  pendingFees as (
						   select  hh.AgreementId,hh.Amount, hh.Date, hh.DateUtc, hh.TransactionId from  HandlingFees  hh
						   INNER JOIN Transactions t 
						   ON hh.TransactionId = t.Id
						   where t.UserId = '{userId}'
						   union 
						   select ah.AgreementId,ah.Amount, ah.Date, ah.DateUtc, ah.TransactionId  from AllyPartnerHandlingFees ah
						   where ah.UserId = '{userId}' )

						   select * from pendingFees order by date desc";
            var result = (await _dbConnection.QueryAsync<HandlingFeeEntity>(query)).FirstOrDefault();
            return result;
        }


        public async Task<List<TransactionEntity>> GetTransactionsDebitCard(string userId, DateTime date, int statusId, string category)
        {
            string query;
            if (category.Equals(CategoryTransactions.Purchase.ToString()))
            {
                query = $@"SELECT *
                            FROM Transactions t 
                            INNER JOIN TransactionTypes tt ON tt.Id = t.TypeId
                            WHERE t.UserId = '{userId}'
                            AND MONTH(t.[Date]) >= {date.Month}
                            AND YEAR(t.[Date]) >= {date.Year}
                            AND t.StatusId = {statusId}
                            AND t.TypeId IN (SELECT Id FROM TransactionTypes 
                            WHERE CategoryId = {Convert.ToInt32(category)} and Code in 
                            ('{TypeTransactions.Purchase_PresentialDebitCard}', 
                            '{TypeTransactions.Purchase_NoPresentialDebitCard}', 
                            '{TypeTransactions.Purchase_PresentialDebitCardInternational}', 
                            '{TypeTransactions.Purchase_NoPresentialDebitCardInternational}'))";
            }
            else if (category.Equals(CategoryTransactions.WithDrawal.ToString()))
            {
                query = @$"SELECT *
                            FROM Transactions t 
                            INNER JOIN TransactionTypes tt ON tt.Id = t.TypeId
                            WHERE t.UserId = '{userId}' 
                            AND MONTH(t.[Date]) >= {date.Month}
                            AND YEAR(t.[Date]) >= {date.Year}
                            AND t.StatusId = {statusId}
                            AND t.TypeId IN (SELECT Id FROM TransactionTypes 
                            WHERE CategoryId = {Convert.ToInt32(category)} and Code in 
                            ('{TypeTransactions.WithDrawal_ATM}', 
                            '{TypeTransactions.WithDrawal_ATM_Transfer}', 
                            '{TypeTransactions.WithDrawal_OTP_BankCorrespondent}'))";
            }
            else
            {
                query = @$"SELECT *
                            FROM Transactions t 
                            INNER JOIN TransactionTypes tt ON tt.Id = t.TypeId
                            WHERE t.UserId = '{userId}'
                            AND MONTH(t.[Date]) >= {date.Month}
                            AND YEAR(t.[Date]) >= {date.Year}
                            AND t.StatusId = {statusId}
                            AND t.TypeId IN (SELECT Id FROM TransactionTypes 
                            WHERE CategoryId = {Convert.ToInt32(category)} and Code in 
                            ('{TypeTransactions.Others_ATMOthersDebitCard}', 
                            '{TypeTransactions.Others_InternationalDebitCard}', 
                            '{TypeTransactions.Others_IssueDebitCard}', 
                            '{TypeTransactions.Others_ReissueDebitCard}', 
                            '{TypeTransactions.Others_ReissueDebitCardForFraud}', 
                            '{TypeTransactions.Others_ATM}'))";
            }

            var result = (await _dbConnection.QueryAsync<TransactionEntity>(query)).ToList();
            return result;
        }

        public async Task<List<HandlingFeeEntity>> GetUserPendingTransactions(string userId, int agreementId, int statusId)
        {
            var query = @$"SELECT *
                           FROM HandlingFees h
						   INNER JOIN Transactions t ON h.TransactionId = t.Id
                           WHERE t.UserId = '{userId}' AND t.StatusId = {statusId} AND h.AgreementId = {agreementId}
                           ORDER BY h.Date DESC";
            var result = (await _dbConnection.QueryAsync<HandlingFeeEntity>(query)).ToList();
            return result;
        }
        public async Task<List<AllyPartnerHandlingFeeEntity>> GetAllyPartnerHandlingFees(string userId, int agreementId, int statusId)
        {
            var query = @$"SELECT *
                           FROM AllyPartnerHandlingFees ap
                           WHERE ap.UserId = '{userId}' AND ap.StatusId = {statusId} AND ap.AgreementId = {agreementId}
                           ORDER BY ap.Date DESC";
            var result = (await _dbConnection.QueryAsync<AllyPartnerHandlingFeeEntity>(query)).ToList();
            return result;
        }
    }
}
