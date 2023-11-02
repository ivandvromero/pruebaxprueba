using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Models.CashBack;
using Dale.Services.DebitCard.Infaestructure.Helpers;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.CashBack;
using Dapper;
using System;
using System.Data;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories
{
    public class CashBackRepository : ICashBackRepository
    {
        private readonly IDbConnection _dbConnection;
        private readonly IUserRepository _iuserRepository;
        private readonly IHolidayRepository _iholidayRepository;
        private readonly IATHErrorRepository _iathErrorRepository;
        private readonly IBankBookRepository _ibankBookRepository;

        public CashBackRepository(IUserRepository iuserRepository
            , IHolidayRepository iholidayRepository
            , IATHErrorRepository iathErrorRepository
            , IBankBookRepository ibankBookRepository
            , IDbConnection dbConnection)
        {
            _iuserRepository = iuserRepository;
            _iholidayRepository = iholidayRepository;
            _iathErrorRepository = iathErrorRepository;
            _ibankBookRepository = ibankBookRepository;
            _dbConnection = dbConnection;
        }

        public async Task<bool> MakeCashBackTransaction(string userId, DateTime date, int statusId
            , decimal commissionAmount, UserAgreementModel userAgreement, bool apply)
        {
            UserEntity user = await _iuserRepository.GetUserById(userId);
            DateTime nextWorkingDate = await _iholidayRepository.GetNextBusinessDayAsync();
            ATHErrorEntity athError = await _iathErrorRepository.GetByCode(AthErrorCode.ATM_TRANSACCION_EXITOSA);
            var (found, value) = await _ibankBookRepository.GetLastBankBookIdForUser(userId);
            int bankBookId = found ? value : -value;

            CashBackTransactionBindingModel objParameters = new CashBackTransactionBindingModel()
            {
                UserId = userId,
                ApprovalId = Global.GetApprovalId(user.CardNumber),
                StatusId = statusId,
                CategoryCode = CategoryTransactions.Others.ToString(),
                TypeCode = TypeTransactions.Others_CashBack.ToString(),
                Amount = commissionAmount,
                BankBookId = bankBookId,
                SenderFee = 0,
                RecieverFee = 0,
                SenderTax = 0,
                SenderGMF = 0,
                RecieverTax = 0,
                RecieverGMF = 0,
                TransactionCode = TransactionCodes.CashBackUber,
                TransactionTagType = (int)TransactionTaggingType.CashbackUberdriver,
                TransactionTagDate = nextWorkingDate,
                IVAAmount = 0,
                GMFAmount = 0,
                FeeAmount = 0,
                ResultCode = TransactionHelper.GetStatusCode(athError.B24),
                ProductTypeId = ProductTypeCodes.ElectronicDeposit,
                TypeBankBook = TransactionKind.Credit.ToString(),
                ClientMetaDataId = userAgreement.CategoryId,
                Apply = apply,
                Percentage = userAgreement.Percentage,
                ClientDate = date
            };

            string storedProcedureName = "AddTransactionCashBack";
            int result = (await _dbConnection.ExecuteAsync(storedProcedureName, objParameters, commandType: CommandType.StoredProcedure));
            return result > 0 ? true : false;
        }
    }
}
