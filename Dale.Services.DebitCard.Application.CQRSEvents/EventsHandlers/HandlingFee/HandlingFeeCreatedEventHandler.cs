using Dale.Extensions.Logging.Interfaces;
using Dale.Extensions.MessageBroker.Core.Bus;
using Dale.Services.DebitCard.Application.CQRSEvents.Events.HandlingFee;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.CoreApi;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Constans.Enums;

namespace Dale.Services.DebitCard.Application.CQRSEvents.EventsHandlers.HandlingFee
{
    public class HandlingFeeCreatedEventHandler : IEventHandler<HandlingFeeCreatedEvent>
    {
        private readonly ILogger<HandlingFeeCreatedEventHandler> _logger;
        private readonly IHandlingFeeRepository _handlingFeeRepository;
        private readonly IStatusRepository _statusRepository; 
        private readonly IDebitCardRepository _debitCardRepository;
        private readonly IUserAgreementRepository _iuserAgreementRepository;
        private readonly IAgreementRepository _iagreementRepository;
        private readonly IFeeStructureRepository _ifeeStructureRepository;
        private readonly IProductBalanceRepository _iproductBalanceRepository;
        private readonly IUserRepository _iuserRepository;
        private readonly ITransactionRepository _itransactionRepository;
        private readonly ISystemSettingRepository _isystemSettingRepository;
        private readonly ICoreApiAdapter _coreApiAdapter;

        public HandlingFeeCreatedEventHandler(ILogger<HandlingFeeCreatedEventHandler> logger, 
                                              IHandlingFeeRepository handlingFeeRepository,
                                              IStatusRepository statusRepository,
                                              IDebitCardRepository debitCardRepository,
                                              IUserAgreementRepository iuserAgreementRepository,
                                              IAgreementRepository iagreementRepository,
                                              IFeeStructureRepository ifeeStructureRepository,
                                              IProductBalanceRepository iproductBalanceRepository,
                                              IUserRepository iuserRepository,
                                              ITransactionRepository itransactionRepository,
                                              ISystemSettingRepository isystemSettingRepository,
                                              ICoreApiAdapter coreApiAdapter)
        {
            _logger = logger;
            _handlingFeeRepository = handlingFeeRepository;
            _statusRepository = statusRepository;
            _debitCardRepository = debitCardRepository;
            _iuserAgreementRepository = iuserAgreementRepository;
            _iagreementRepository = iagreementRepository;
            _ifeeStructureRepository = ifeeStructureRepository;
            _iproductBalanceRepository = iproductBalanceRepository;
            _iuserRepository = iuserRepository;
            _itransactionRepository = itransactionRepository;
            _isystemSettingRepository = isystemSettingRepository;
            _coreApiAdapter = coreApiAdapter;
        }

        public async Task<bool> Handle(HandlingFeeCreatedEvent @event)
        {
            Log($"Start Handler - HandlingFee Recived User '{@event.UserId}'.");
            try
            {
                bool lastAncientUser = false;
                int daysFinish = -30;
                DateTime dateHandlingFee = DateTime.Now.AddMonths(-2);
                //TODO: date to validate the transactions made in the immediately previous month 
                var monthOfProcessing = DateTime.Now.AddMonths(-1);

                var user = await _iuserRepository.GetUserById(@event.UserId);

                var handlingFeeStatus = await _statusRepository.GetStatus(TransactionStatus.Pending.ToString(), StatusTypes.TransactionStatus);
                var pendingTransactions = await _itransactionRepository.GetHandligFeeTransactions(@event.UserId, handlingFeeStatus.Id);

                bool isWalo = false;
                if (@event.AgreementId != null)
                {
                    AgreementEntity getAgreement = await _iagreementRepository.GetAgreementById(@event.AgreementId);
                    if (getAgreement != null)
                    {
                        var agreementProgramId = getAgreement.ProgramId.Trim().ToLower();
                        var waloProgramId = AgreementsTypeCodes.Walo.ToString().Trim().ToLower();
                        isWalo = agreementProgramId.Equals(waloProgramId) ? true : false;
                    }
                }

                var userStatus = await _statusRepository.GetStatus(ApplicationUserStatus.Inactive.ToString(), StatusTypes.UserStatus);
                if (pendingTransactions.Count >= 2 && !isWalo)
                {
                    bool changeStatus = await _iuserRepository.UpdateUserStatus(@event.UserId, userStatus.Id);
                    Log($"Finish Handler - HandlingFee Recived User '{@event.UserId}'.");
                    return true;
                }

                if (isWalo) // Is Walo
                {
                    bool chargeHandlingFee = false;
                    bool isOlderUser = false;
                    bool hasFunds = false;

                    var agreementId = (int)@event.AgreementId;
                    int firstTx = 0;
                    int secondTx = 0;

                    DateTime dateWaloHandlingFee = DateTime.Now.AddDays(daysFinish);
                    var userAgreementStatus = await _statusRepository.GetStatus(UserAgreementStatus.Active.ToString(), StatusTypes.UserAgreementStatus);
                    var userAgreement = await _iuserAgreementRepository.GetUserAgreementByProgramId(@event.UserId, AgreementsTypeCodes.Walo.ToString(), userAgreementStatus.Id);

                    var systemSetting = await _isystemSettingRepository.GetSystemSettingsByKey(SystemSettingKeys.ACTIVE_WALO_HANDLING_FEE.ToString());
                    if (systemSetting != null)
                    {
                        DateTime dateSystemSetting = Convert.ToDateTime(systemSetting.Value);
                        HandlingFeeEntity PayRealizedForAllyPartner = await _handlingFeeRepository.GetLastPayRealizedByUserId(@event.UserId);
                        lastAncientUser = PayRealizedForAllyPartner == null ? false : (PayRealizedForAllyPartner.Date.Date == dateWaloHandlingFee.Date) ? true : false;
                        chargeHandlingFee = DateTime.Now.Date >= dateSystemSetting.Date;
                        isOlderUser = PayRealizedForAllyPartner == null && (DateTime.Now.Date - userAgreement?.CreatedAt.Date).Value.Days > 30;
                    }

                    if (chargeHandlingFee)
                    {
                        if ((userAgreement?.CreatedAt.Year == dateWaloHandlingFee.Year && userAgreement?.CreatedAt.Month == dateWaloHandlingFee.Month && userAgreement?.CreatedAt.Day == dateWaloHandlingFee.Day)
                            || isOlderUser || lastAncientUser)
                        {
                            var debitCardActive = await _statusRepository.GetStatus(DebitCardStatus.Active.ToString(), StatusTypes.DebitcardStatus);
                            var debitCardBlocked = await _statusRepository.GetStatus(DebitCardStatus.Blocked.ToString(), StatusTypes.DebitcardStatus);
                            var objDebitCard = await _debitCardRepository.GetDebitCard(@event.UserId);

                            FeeStructureEntity objFeeStructureEntity = await _ifeeStructureRepository.GetFeeStructureByAgreementId(agreementId);
                            decimal commissionAmount = objFeeStructureEntity.DcMonthlyFeePersonaAmount == null ? 0 : Convert.ToDecimal(objFeeStructureEntity.DcMonthlyFeePersonaAmount);

                            ProductBalanceEntity objProductBalance = await _iproductBalanceRepository.GetBalanceByUserId(@event.UserId);
                            var handlingSuccess = await _statusRepository.GetStatus(TransactionStatus.Success.ToString(), StatusTypes.TransactionStatus);
                            var handlingPending = await _statusRepository.GetStatus(TransactionStatus.Pending.ToString(), StatusTypes.TransactionStatus);

                            var blockedUserStatus = await _statusRepository.GetStatus(ApplicationUserStatus.Blocked.ToString(), StatusTypes.UserStatus);
                            var blockedTDStatus = await _statusRepository.GetStatus(DebitCardStatus.Blocked.ToString(), StatusTypes.DebitcardStatus);

                            bool balanceOk = objProductBalance.Balance >= commissionAmount;
                            if (balanceOk)
                            {
                                handlingFeeStatus = handlingSuccess;
                            }

                            #region [ Check pending transactions ]
                            var txPending = await _handlingFeeRepository.GetUserPendingTransactions(@event.UserId, @event.AgreementId.Value, handlingPending.Id);

                            var allyParnetPendingFees = await _handlingFeeRepository.GetAllyPartnerHandlingFees(@event.UserId, @event.AgreementId.Value, handlingPending.Id);
                            if (txPending.Count > 0)
                            {
                                var oldestTransaction = txPending.OrderBy(x => x.Date).First();

                                if (txPending.Count == 1)
                                {
                                    hasFunds = objProductBalance.Balance >= (commissionAmount * 2);
                                    if (!hasFunds)
                                    {
                                        if (balanceOk)
                                        {
                                            firstTx = oldestTransaction.TransactionId;
                                            handlingFeeStatus = handlingPending;
                                        }
                                    }
                                    else
                                    {
                                        firstTx = oldestTransaction.TransactionId;
                                        handlingFeeStatus = handlingSuccess;
                                    }
                                }

                                if (txPending.Count == 2)
                                {
                                    hasFunds = objProductBalance.Balance >= (commissionAmount * 3);
                                    if (hasFunds)
                                    {
                                        firstTx = oldestTransaction.TransactionId;
                                        oldestTransaction = txPending.OrderByDescending(x => x.Date).First();
                                        secondTx = oldestTransaction.TransactionId;
                                        handlingFeeStatus = handlingSuccess;
                                    }
                                    else
                                    {
                                        hasFunds = objProductBalance.Balance >= (commissionAmount * 2);
                                        if (hasFunds)
                                        {
                                            firstTx = oldestTransaction.TransactionId;
                                            oldestTransaction = txPending.OrderByDescending(x => x.Date).First();
                                            secondTx = oldestTransaction.TransactionId;
                                            handlingFeeStatus = handlingPending;
                                        }
                                        else
                                        {
                                            hasFunds = objProductBalance.Balance >= commissionAmount;
                                            if (hasFunds)
                                            {
                                                firstTx = oldestTransaction.TransactionId;
                                                handlingFeeStatus = handlingPending;
                                            }
                                            else
                                            {
                                                Log($"Walo -> HanglingFee - User has no balance to pay 2 pending transactions and the current transaction for handling fee - User: '{@event.UserId}'.");

                                                await _iuserRepository.UpdateUserStatus(@event.UserId, blockedUserStatus.Id);
                                                handlingFeeStatus = handlingPending;

                                                Log($"Walo -> HanglingFee - User has been blocked (Pending transactions of handling fee) - User: '{@event.UserId}'.");
                                            }
                                        }
                                    }
                                }

                                if (!firstTx.Equals(0))
                                {
                                    WaloHandlingFeeRequest firstTransaction = new WaloHandlingFeeRequest()
                                    {
                                        UserId = @event.UserId,
                                        TransactionId = firstTx,
                                        Amount = commissionAmount
                                    };

                                    var getToken = await _coreApiAdapter.GetToken(user.Email);
                                    var makeTransaction = await _coreApiAdapter.WaloHandlingFeePending(firstTransaction, getToken.access_token);
                                    if (makeTransaction.Succeeded)
                                    {
                                        await _itransactionRepository.UpdateTransactionStatus(firstTx, handlingSuccess.Id);
                                        Log($"Walo -> HanglingFee - User has paid the pending transaction {firstTx} - User: '{@event.UserId}'.");
                                    }
                                }

                                if (!secondTx.Equals(0))
                                {
                                    WaloHandlingFeeRequest secondTransaction = new WaloHandlingFeeRequest()
                                    {
                                        UserId = @event.UserId,
                                        TransactionId = secondTx,
                                        Amount = commissionAmount
                                    };

                                    var getToken = await _coreApiAdapter.GetToken(user.Email);
                                    var makeTransaction = await _coreApiAdapter.WaloHandlingFeePending(secondTransaction, getToken.access_token);
                                    if (makeTransaction.Succeeded)
                                    {
                                        await _itransactionRepository.UpdateTransactionStatus(secondTx, handlingSuccess.Id);
                                        Log($"Walo -> HanglingFee - User has paid the pending transaction {secondTx} - User: '{@event.UserId}'.");
                                    }
                                }
                            }
                            // TO DO: SE CONSULTA NUEVAMENTE EL SALDO Y TRANSACCIONES PENDIENTES QUE NO SE PUDIERON PAGAR DE LA TABLA  HandlingFeeEntity
                            objProductBalance = await _iproductBalanceRepository.GetBalanceByUserId(@event.UserId);
                            txPending = await _handlingFeeRepository.GetUserPendingTransactions(@event.UserId, @event.AgreementId.Value, handlingPending.Id);

                            //TO DO: SI TIENE COBROS PENDIENTES DE LA TABLA AllyPartnerHandlingFee INTENTA REALIZAR EL COBRO POR POR EL ID  TIENE SALDO

                            if (allyParnetPendingFees.Count > 0)
                            {
                                Log($"Walo -> HanglingFee - User have {allyParnetPendingFees.Count + txPending.Count} pending transaction(s) of handling fee - User: '{@event.UserId}'.");
                                List<int> idsPendingFee = new List<int>();

                                if (allyParnetPendingFees.Any())
                                {
                                    // TO DO: REALIZA EL CALCULO DE CUANTOS COBROS PENDIENTES PUEDE REALIZAR  Y POSTERIOR LO AGREGA A UN ARREGLO

                                    var paysPendingPosibles = Math.Floor(objProductBalance.Balance / commissionAmount);

                                    //TO DO: SE CALCULA LAS TRANSACIONES PENDIENTES DE LA TABLA HandlingFee MAS LOS COBROS PENDIENTES DE LA TABLA AllyPartnerHandlingFee Y SI LA SUMA ES IGUAL O MAS DE 2
                                    //Y NO ES POSIBLE NINGUN PAGO BLOQUEA AL USUARIO
                                    var hanlingFeesAllyparnertPendingFees = txPending.Count + allyParnetPendingFees.Count;

                                    if (paysPendingPosibles == 0 && hanlingFeesAllyparnertPendingFees >= 2)
                                    {
                                        await _iuserRepository.UpdateUserStatus(@event.UserId, blockedUserStatus.Id);
                                        handlingFeeStatus = handlingPending;
                                    }

                                    if (paysPendingPosibles >= 1)
                                    {

                                        for (int i = 0; i < paysPendingPosibles; i++)
                                        {
                                            idsPendingFee.Add(allyParnetPendingFees.ElementAt(i).Id);
                                        }

                                    }
                                    if ((objProductBalance.Balance < commissionAmount * (allyParnetPendingFees.Count() + 1)))
                                    {
                                        handlingFeeStatus = handlingPending;
                                    }

                                }
                                if (idsPendingFee.Any())
                                {
                                    var getToken = await _coreApiAdapter.GetToken(user.Email);
                                    var updateRequest = new UpdateHanlingFeeRequest
                                    {
                                        IdsPendingFee = idsPendingFee.ToArray(),
                                        AgrementId = @event.AgreementId.Value,
                                        StatusId = handlingSuccess.Id,
                                        UserId = @event.UserId

                                    };
                                    // TO DO: CONSUME EL METODO PARA ACTUALIZAR A SUCCES LOS COBROS PENDIENTES EN LA TABLA AllyPartnerHandlingFee Y CREA LA TRANSACCION CORRE´SPONIENTE A CADA PAGO
                                    var makeTransaction = await _coreApiAdapter.UpdateHandlingFeeAllyPartner(updateRequest, getToken.access_token);
                                    if (makeTransaction.Succeeded)
                                    {
                                        Log($"Walo -> HanglingFee - User has paid the pending transaction {firstTx} - User: '{@event.UserId}'.");
                                    }
                                }
                            }
                            #endregion

                            if (objDebitCard != null)
                            {
                                if (objDebitCard.StatusId == debitCardActive.Id || objDebitCard.StatusId == debitCardBlocked.Id)
                                {
                                    //Get all transactions from 3 months ago
                                    if ((DateTime.Now.Date - objDebitCard.RequestActivationDate.Value.Date).Days >= 90)
                                    {
                                        DateTime dateTimeMaxUse = DateTime.Now.AddDays(-90);

                                        //Purchases
                                        var transactionsPurchase = await _handlingFeeRepository.GetTransactionsDebitCard(@event.UserId, dateTimeMaxUse, handlingFeeStatus.Id, CategoryTransactions.Purchase);

                                        //Withdrawal
                                        var transactionsWithdrawal = await _handlingFeeRepository.GetTransactionsDebitCard(@event.UserId, dateTimeMaxUse, handlingFeeStatus.Id, CategoryTransactions.WithDrawal);

                                        //Others
                                        var transactionsOthers = await _handlingFeeRepository.GetTransactionsDebitCard(@event.UserId, dateTimeMaxUse, handlingFeeStatus.Id, CategoryTransactions.Others);

                                        if (transactionsPurchase.Count == 0 && transactionsWithdrawal.Count == 0 && transactionsOthers.Count == 0)
                                        {
                                            // Update Status DebitCard
                                            var updateUserStatus = await _iuserRepository.UpdateUserStatus(@event.UserId, blockedUserStatus.Id);

                                            // Update Status DebitCard
                                            var updateStatusTD = await _iuserRepository.UpdateDebitCardUserStatus(@event.UserId, blockedTDStatus.Id);

                                            Log($"Walo -> Finish Handler - DebitCard was not used for 3 months - User: '{@event.UserId}'.");
                                            return true;
                                        }
                                    }
                                }


                            }
                            var Token = await _coreApiAdapter.GetToken(user.Email);
                            var createHanldingFeeRequest = new CreateHanldingFeeRequest
                            {
                                AgreementId = agreementId,
                                Amount = commissionAmount,
                                UserId = @event.UserId,
                                StatusId = handlingFeeStatus.Id
                            };
                            var trsanacionPeningFeeReponse = await _coreApiAdapter.CreateHandlingFeeAllyPartner(createHanldingFeeRequest, Token.access_token, handlingFeeStatus.Id == handlingSuccess.Id);

                            if (trsanacionPeningFeeReponse.Succeeded)
                            {
                                Log($"Finish Handler - HandlingFee insert transaction date {DateTime.Now} by User '{@event.UserId}' - @event.AgreementId = '{@event.AgreementId}'.");

                                return true;
                            }
                            else
                            {
                                return false;
                            }
                            //DateTime dateHandlingFeeTransactions = DateTime.Now.AddMonths(-1);
                            //bool result = await _handlingFeeRepository.MakeHandlingFeeTransaction(@event.UserId, dateHandlingFeeTransactions, handlingFeeStatus.Id, commissionAmount, agreementId, true);
                            //Log($"Finish Handler - HandlingFee insert transaction date {DateTime.Now} by User '{@event.UserId}' - @event.AgreementId = '{@event.AgreementId}'.");
                            //return result;

                        }
                        else
                        {
                            Log($"Finish Handler - HandlingFee user no valid for apply handling fee by User '{@event.UserId}' - AgreementId = '{@event.AgreementId}'.");
                        }
                    }
                    else
                    {
                        Log($"Finish Handler - The current date is less than the Walo handling fee start date. By User '{@event.UserId}' - AgreementId = '{@event.AgreementId}'.");
                    }
                }
                else // Is LifeMiles
                {
                    var userAgreementStatus = await _statusRepository.GetStatus(UserAgreementStatus.Active.ToString(), StatusTypes.UserAgreementStatus);
                    var userAgreement = await _iuserAgreementRepository.GetUserAgreementByProgramId(@event.UserId, AgreementsTypeCodes.LifeMiles.ToString(), userAgreementStatus.Id);
                    var systemSetting = await _isystemSettingRepository.GetSystemSettingsByKey(SystemSettingKeys.ACTIVE_LM_HANDLING_FEE.ToString());
                    bool isOlderUser = false;
                    if (systemSetting != null)
                    {
                        DateTime dateSystemSetting = Convert.ToDateTime(systemSetting.Value);
                        HandlingFeeEntity handlingFee = await _handlingFeeRepository.GetLastTransactionByUserId(@event.UserId);
                        lastAncientUser = handlingFee == null ? false : (handlingFee.Date.Date == DateTime.Now.AddDays(daysFinish).Date) ? true : false;
                        isOlderUser = handlingFee == null && (DateTime.Now.Date - userAgreement?.CreatedAt.Date).Value.Days > 60;
                    }

                    if ((userAgreement?.CreatedAt.Year == dateHandlingFee.Year && userAgreement?.CreatedAt.Month == dateHandlingFee.Month && userAgreement?.CreatedAt.Day == dateHandlingFee.Day)
                        || isOlderUser || lastAncientUser)
                    {
                        var debitCardStatusCancelled = await _statusRepository.GetStatus(DebitCardStatus.Cancelled.ToString(), StatusTypes.DebitcardStatus);
                        var objDebitCard = await _debitCardRepository.GetDebitCard(@event.UserId);

                        var AgreementStatus = await _statusRepository.GetStatus(UserAgreementStatus.Active.ToString(), StatusTypes.AgreementStatus);
                        AgreementEntity objAgreement = await _iagreementRepository.GetAgreementByProgramId(AgreementsTypeCodes.LifeMiles.ToString(), AgreementStatus.Id);

                        if (objAgreement == null)
                        {
                            Log($"Finish Handler - HandlingFee Agreement is null by User '{@event.UserId}'.");
                            return true;
                        }

                        FeeStructureEntity objFeeStructureEntity = await _ifeeStructureRepository.GetFeeStructureByAgreementId(objAgreement.Id);
                        decimal commissionAmount = objFeeStructureEntity.DcMonthlyFeePersonaAmount == null ? 0 : Convert.ToDecimal(objFeeStructureEntity.DcMonthlyFeePersonaAmount);

                        ProductBalanceEntity objProductBalance = await _iproductBalanceRepository.GetBalanceByUserId(@event.UserId);
                        if (objProductBalance.Balance > commissionAmount)
                        {
                            handlingFeeStatus = await _statusRepository.GetStatus(TransactionStatus.Success.ToString(), StatusTypes.TransactionStatus);
                        }


                        if (objDebitCard != null && objDebitCard.StatusId != debitCardStatusCancelled.Id)
                        {
                            //TODO: Get transactions from the immediately previous month
                            var ltsTransactions = await _handlingFeeRepository.GetAllTransactionByUserIdAndCategory(@event.UserId, monthOfProcessing, handlingFeeStatus.Id, CategoryTransactions.Purchase);

                            if (ltsTransactions.Count == 0)
                            {
                                //TODO: GET the Last transactino for user LM
                                var LastTransactionUser = await _handlingFeeRepository.GetLastTransactionForUser(@event.UserId, CategoryTransactions.Purchase, handlingFeeStatus.Id);
                                //TODO: validate if the transaction is older than 90 days
                                var neverMakeTransactoin = (LastTransactionUser == null && (userAgreement.CreatedAt.Date < DateTime.Now.Date.AddMonths(-3).Date));
                                if (neverMakeTransactoin)
                                {
                                    Log($"Finish Handler - HandlingFee no insert transaction date {DateTime.Now} by User '{@event.UserId}', user with more than 90 days without making transactions");
                                }
                                else if(LastTransactionUser != null && (LastTransactionUser.Date.Date < DateTime.Now.Date.AddMonths(-3).Date))
                                {
                                    Log($"Finish Handler - HandlingFee no insert transaction date {DateTime.Now} by User '{@event.UserId}', user with more than 90 days without making transactions");
                                }
                                else
                                {
                                    DateTime dateHandlingFeeTransactions = DateTime.Now.AddMonths(-1);
                                    bool result = await _handlingFeeRepository.MakeHandlingFeeTransaction(@event.UserId, dateHandlingFeeTransactions, handlingFeeStatus.Id, commissionAmount, objAgreement.Id);
                                    Log($"Finish Handler - HandlingFee insert transaction date {DateTime.Now} by User '{@event.UserId}'.");
                                    return result;
                                }
                            }
                            else
                            {
                                Log($"Finish Handler - HandlingFee no insert transaction date {DateTime.Now} by User '{@event.UserId}'.");
                            }
                        }
                        else
                        {
                            Log($"Finish Handler - HandlingFee status debit card is cancel by User '{@event.UserId}'.");
                        }
                    }
                    else
                    {
                        Log($"Finish Handler - HandlingFee user no valid for apply handling fee by User '{@event.UserId}'.");
                    }
                }

                return true;
            }
            catch (Exception ex)
            {
                LogException(ex);
                Log($"Start Handler - HandlingFee User '{@event.UserId}' error {ex.Message.ToString()}.");
                return false;
            }

        }

        private void Log(string description, bool debug = false, object additionalData = null)
        {
            if (!debug)
                _logger.LogInformation(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Information",
                    Funcionalidad = "HandlingFeeCreatedEvent",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "HandlingFeeCreatedEvent",
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
                Funcionalidad = "HandlingFeeCreatedEvent",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }
    }
}
