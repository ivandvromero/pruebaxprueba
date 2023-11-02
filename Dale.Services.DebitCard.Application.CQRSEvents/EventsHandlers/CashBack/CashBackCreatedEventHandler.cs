using Dale.Extensions.Logging.Interfaces;
using Dale.Extensions.MessageBroker.Core.Bus;
using Dale.Services.DebitCard.Application.CQRSEvents.Events.HandlingFee;
using Dale.Services.DebitCard.Application.CQRSEvents.Resources;
using Dale.Services.DebitCard.Domain.Core.Constans;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.Models.CashBack;
using Dale.Services.DebitCard.Infaestructure.Persistence.Repositories.CashBack;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Application.CQRSEvents.EventsHandlers.HandlingFee
{
    public class CashBackCreatedEventHandler : IEventHandler<CashBackCreatedEvent>
    {
        private readonly ILogger<CashBackCreatedEventHandler> _logger;
        private readonly IUserRepository _userRepository;        
        private readonly IStatusRepository _statusRepository;
        private readonly ICashBackRepository _cashBackRepository;
        private readonly IATHErrorRepository _aTHErrorRepository;
        private readonly ITransactionRepository _transactionRepository;
        private readonly IUserAgreementRepository _userAgreementRepository;
        private readonly IDebitCardCashBackDetailRepository _debitCardCashBackDetailRepository;

        public CashBackCreatedEventHandler(ILogger<CashBackCreatedEventHandler> logger
            , IUserRepository userRepository
            , IUserRepository iuserRepository
            , IStatusRepository statusRepository
            , ICashBackRepository cashBackRepository
            , IATHErrorRepository aTHErrorRepository
            , ITransactionRepository transactionRepository
            , IUserAgreementRepository userAgreementRepository
            , IDebitCardCashBackDetailRepository debitCardCashBackDetailRepository)
        {
            _logger = logger;
            _userRepository = userRepository;
            _userRepository = iuserRepository;
            _statusRepository = statusRepository;            
            _aTHErrorRepository = aTHErrorRepository;
            _cashBackRepository = cashBackRepository;
            _transactionRepository = transactionRepository;
            _userAgreementRepository = userAgreementRepository;
            _debitCardCashBackDetailRepository = debitCardCashBackDetailRepository;
        }
        public async Task<bool> Handle(CashBackCreatedEvent @event)
        {
            bool result = false;
            bool apply = false;
            ATHErrorEntity athError = await _aTHErrorRepository.GetByCode(Enums.AthErrorCode.ATM_TRANSACCION_DECLINADA_INCONVENIENTES_TECNICOS);
            List<DebitCardCashBackDetailEntity> lstCashBackDetail = new List<DebitCardCashBackDetailEntity>();
            StatusEntity status = await _statusRepository.GetStatus(Enums.CashBackTransactionStatus.Failure.ToString()
                                                                    , StatusTypes.CashBackTransactions);
            int cashBackStatus = status.Id;
            try
            {
                Log(String.Format(@CashBack.LogStar, @event.UserId));
                UserEntity user = await _userRepository.GetUserById(@event.UserId);
                StatusEntity userStatus = await _statusRepository.GetStatus(ApplicationUserStatus.Inactive.ToString(), StatusTypes.UserStatus);
                if (user is null || user.StatusId == userStatus.Id)
                {
                    Log(String.Format(@CashBack.LogUserNoActive, @event.UserId));
                    return false;
                }

                DateTime startDate = DateTime.Now.AddMonths(-1);
                UserAgreementModel agreementEntity = await _userAgreementRepository.GetUserAgreementByUserId(@event.UserId);
                string systemNameStatus = String.Empty;
                //TODO:: VALIDATION -- 
                if (agreementEntity.StatusUser != ApplicationUserStatus.Active.ToString())
                {
                    Log(@$"Error in Services.DebitCard -> CashBackCreatedEventHandler -> Handle: User - {@event.UserId}. Estado {agreementEntity.StatusUser} no activo");
                    systemNameStatus = CashBackTransactionStatus.FailureForDEInactive.ToString();
                }
                //TODO:: 1 VALIDATION -- USERAGREEMENTS ACTIVO ORDER BY ID DESC UserAgreements ---> LOG
                else if (agreementEntity.StatusAgreement != UserAgreementStatus.Active.ToString())
                {
                    Log(@$"Error in Services.DebitCard -> CashBackCreatedEventHandler -> Handle: User - {@event.UserId}. Estado {agreementEntity.StatusAgreement} no uber");
                    systemNameStatus = CashBackTransactionStatus.FailureForNoUber.ToString();
                }
                //TODO:: 2 VALIDATION -- IF AgreementCode =(F0YG) DE UBER != ---> LOG
                else if (agreementEntity.AgreementCode != SpecialCodes.UBER)
                {
                    Log(@$"Error in Services.DebitCard -> CashBackCreatedEventHandler -> Handle: User - {@event.UserId}. Agreement Code {agreementEntity.AgreementCode} no corresponde a uber");
                    systemNameStatus = CashBackTransactionStatus.FailureForNoUber.ToString();
                }

                //TODO:: 3 VALIDATION -- IF UserAgreements  (CARDSELECT = 1 )  != ---> LOG
                else if (!agreementEntity.CardSelected)
                {
                    Log(@$"Error in Services.DebitCard -> CashBackCreatedEventHandler -> Handle: User - {@event.UserId}. Tarjeta de convenio no seleccionada");
                    systemNameStatus = CashBackTransactionStatus.FailureForNoSelectedUber.ToString();
                }
                //TODO:: 4 VALIDATION -- IF CATEGORYid DE UserAgreements != NULL  ==---> LOG 
                else if (agreementEntity.CategoryId == null)
                {
                    Log(@$"Error in Services.DebitCard -> CashBackCreatedEventHandler -> Handle: User - {@event.UserId}. Sin categoria asociada");
                    systemNameStatus = CashBackTransactionStatus.FailureForNoBenefits.ToString();
                }

                //TODO:: 5 VALIDATION -- IF ClientMetaDatas UberAssociatedCategoryId != NULL  ==---> LOG 
                else if (agreementEntity.UberAssociatedCategoryId == null)
                {
                    Log(@$"Error in Services.DebitCard -> CashBackCreatedEventHandler -> Handle: User - {@event.UserId}. Sin categoria de uber asociada");
                    systemNameStatus = CashBackTransactionStatus.FailureForNoCategory.ToString();
                }
                else
                {
                    systemNameStatus = CashBackTransactionStatus.Process.ToString();
                    apply = true;
                }

                StatusEntity statusTransaction = await _statusRepository.GetStatus(systemNameStatus, StatusTypes.CashBackTransactions); 
                decimal totalAmount = await GetTotalAmount(startDate, @event.UserId);
                decimal percentage = 100M;
                decimal totalDisperse = (agreementEntity.Percentage / percentage) * totalAmount;
                totalDisperse = totalDisperse <= agreementEntity.MaxAmount ? totalDisperse : agreementEntity.MaxAmount;

                result = await _cashBackRepository.MakeCashBackTransaction(@event.UserId,DateTime.Now
                    , statusTransaction.Id, totalDisperse, agreementEntity, apply);
            }
            catch (Exception ex)
            {
                LogException(ex);
                result = await _debitCardCashBackDetailRepository.InsertCardCashBackFailedTransaction(lstCashBackDetail, cashBackStatus);
            }
            return result;
        }

        private async Task<decimal> GetTotalAmount(DateTime startDate, string userId)
        {
            decimal totalAmountTransactions = await _transactionRepository.GetAmtConvert(
                                CASHBACKTRANSACTIONUBER.MCC.ToString(),
                                CASHBACKTRANSACTIONUBER.MCCADITIONAL.ToString(),
                                CASHBACKTRANSACTIONUBER.MTI,
                                startDate,
                                userId);

            decimal totalAmountReverses = await _transactionRepository.GetAmtConvert(
                                CASHBACKTRANSACTIONUBER.MCC.ToString(),
                                CASHBACKTRANSACTIONUBER.MCCADITIONAL.ToString(),
                                CASHBACKTRANSACTIONUBER.MTIREVERSE,
                                startDate,
                                userId);

            decimal totalAmount = totalAmountTransactions - totalAmountReverses;
            return totalAmount;
        }
        private void Log(string description, bool debug = false, object additionalData = null)
        {
            if (!debug)
                _logger.LogInformation(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Information",
                    Funcionalidad = "CashBackCreatedEvent",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "CashBackCreatedEvent",
                    Description = description,
                    UserId = Environment.MachineName,
                    AdditionalData = additionalData
                });
        }

        private void LogException(Exception e)
        {
            _logger.LogError(new Extensions.Logging.Models.K7LogInfo()
            {
                TimeStampEvent = DateTime.Now,
                AdditionalData = e,
                Category = "Exception",
                Funcionalidad = "CashBackCreatedEvent",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }
    }
}
