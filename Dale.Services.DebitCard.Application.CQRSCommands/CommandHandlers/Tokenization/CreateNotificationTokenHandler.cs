using AutoMapper;
using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.CoreApi;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Net;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Enumerations.Tokenization.TokenLifeCycleEnum;

namespace Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.Tokenization
{
    public class CreateNotificationTokenHandler : IRequestHandler<CreateNotificationTokenCommand, ResponseBindingModel<bool>>
    {
        private readonly ILogger<CreateNotificationTokenHandler> _logger;
        private readonly ICryptography _cryptography;
        private readonly ICoreApiAdapter _coreApiAdapter;
        private readonly IMapper _mapper;
        private readonly INotificationTokenRepository _notificationTokenRepository;
        private readonly ITokenizationUserTokenRepository _tokenizationUserTokenRepository;
        private readonly IConfiguration _configuration;


        public CreateNotificationTokenHandler(ILogger<CreateNotificationTokenHandler> logger,
                                            ICryptography cryptography,
                                            ICoreApiAdapter coreApiAdapter,
                                            IMapper mapper,
                                            INotificationTokenRepository notificationTokenRepository,
                                            ITokenizationUserTokenRepository tokenizationUserTokenRepository,
                                            IConfiguration configuration)
        {
            _logger = logger;
            _cryptography = cryptography;
            _coreApiAdapter = coreApiAdapter;
            _mapper = mapper;
            _notificationTokenRepository = notificationTokenRepository;
            _tokenizationUserTokenRepository = tokenizationUserTokenRepository;
            _configuration = configuration;
        }

        /// <summary>
        /// Method to save notification token
        /// </summary>
        /// <param name="request">Notification Token Request</param>
        /// <param name="cancellationToken">Cancelation Token</param>
        /// <returns>true if successful</returns>
        public async Task<ResponseBindingModel<bool>> Handle(CreateNotificationTokenCommand request, CancellationToken cancellationToken)
        {
            ResponseBindingModel<bool> responseViewModel = new ResponseBindingModel<bool>();
            try
            {
                var valueSign = await _cryptography.ValidateSignature(_configuration.GetSection("CertificateNovo:CertificatePathJWS").Value, request.NotificationTokenRequest.EncryptedData);
                var unencryptedData = await _cryptography.Decrypt(_configuration.GetSection("CertificateDale:CertificatePathJWEPrivate").Value, _configuration.GetSection("CertificateDale:CertificatePassword").Value, valueSign);

                Log($"Decrypt request notification token lifecycle");
                UnencryptedModel unencryptedModel = JsonSerializer.Deserialize<UnencryptedModel>(unencryptedData, new JsonSerializerOptions() { PropertyNameCaseInsensitive = true });

                //Call CoreApi Services
                Log($"Get user info by card number");
                var debitCard = await _coreApiAdapter.GetUserByCardNumber(unencryptedModel.CardholderInfo.primaryAccountNumber);
                if (!debitCard.Succeeded)
                {
                    responseViewModel.Succeeded = debitCard.Succeeded;
                    responseViewModel.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = debitCard.ErrorResult.Code,
                        Message = debitCard.ErrorResult.Message
                    };
                    return responseViewModel;
                }

                var notification = _mapper.Map<NotificationTokenRequestBindingModel, NotificationTokenEntity>(request.NotificationTokenRequest);
                notification.IdRequest = Guid.NewGuid().ToString();
                notification.ClientID = request.ClientID;
                notification.UserId = debitCard.Result.UserId;
                notification.Franchise = debitCard.Result.Franchise;
                notification.CardToken = debitCard.Result.CardToken;

                //Save in DynamoDB
                Log($"Save notification request in dynamo Db");
                var dynamoSave = await _notificationTokenRepository.Post(notification);
                if (dynamoSave)
                {
                    var token = new TokenizationUserTokensEntity
                    {
                        TokenReferenceId = request.NotificationTokenRequest.TokenReferenceID,
                        UserId = debitCard.Result.UserId,
                        Token = unencryptedModel.TokenInfo.Token,
                        TokenType = unencryptedModel.TokenInfo.TokenType,
                        TokenStatus = unencryptedModel.TokenInfo.TokenStatus,
                        TokenAssuranceMethod = unencryptedModel.TokenInfo.TokenAssuranceMethod,
                        LastTokenStatusUpdatedTime = unencryptedModel.TokenInfo.LastTokenStatusUpdatedTime,
                        tokenExpirationDate = unencryptedModel.TokenInfo.tokenExpirationDate,
                        TokenRequestorID = notification.TokenRequestorID,
                        UpdateDate = DateTime.Now,
                        UpdateDateUtc = DateTime.UtcNow
                    };

                    if (unencryptedModel.DeviceInfo != null)
                    {
                        var deviceInfo = _mapper.Map<DeviceInfoBindingModel, DeviceInfo>(unencryptedModel.DeviceInfo);
                        token.DeviceInfo = deviceInfo;
                    }

                    Log($"Save notification in dynamo db tokenization-user-tokens");
                    await _tokenizationUserTokenRepository.Post(token);

                    responseViewModel.Result = true;
                }
                
                return responseViewModel;
            }
            catch (Exception ex)
            {
                LogException(ex);
                responseViewModel.Result = false;
                responseViewModel.Succeeded = false;
                responseViewModel.ErrorResult = new ErrorMessageBindingModel
                {
                    Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                    Message = "Ha ocurrido un error inesperado."
                };
                return responseViewModel;
            }

        }

        #region Private Methods

        private async Task<(string, string)> HomologateStatus(NovopaymentTokenStatus novopaymentStatus)
        {
            switch (novopaymentStatus)
            {
                case NovopaymentTokenStatus.TOKEN_CREATED:
                    return (NovopaymentTokenStatus.TOKEN_CREATED.ToString(), DaleTokenStatus.Created.ToString());
                case NovopaymentTokenStatus.TOKEN_SUSPEND:
                    return (NovopaymentTokenStatus.SUSPEND.ToString(), DaleTokenStatus.Suspend.ToString());
                case NovopaymentTokenStatus.DELETE:
                    return (NovopaymentTokenStatus.DELETE.ToString(), DaleTokenStatus.Delete.ToString());
                case NovopaymentTokenStatus.TOKEN_RESUME:
                    return (NovopaymentTokenStatus.RESUME.ToString(), DaleTokenStatus.Resume.ToString());
                default:
                    return ("", "");
            }            
        }

        private void Log(string description, bool debug = false, object additionalData = null)
        {
            if (!debug)
                _logger.LogInformation(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Information",
                    Funcionalidad = "NotificationHandler",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "NotificationHandler",
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
                Funcionalidad = "NotificationHandler",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }

        #endregion
    }
}
