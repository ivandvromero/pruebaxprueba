using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Enumerations;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization;
using MediatR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.Tokenization
{
    public class TokenLifeCycleHandler : IRequestHandler<TokenLifeCycleCommand, ResponseBindingModel<bool>>
    {

        private readonly ILogger<TokenLifeCycleHandler> _logger;
        private readonly INovopaymentTokenizationAdapter _tokenizationAdapter;
        private readonly IConfiguration _configuration;
        private readonly IRequestLogsRepository _requestLogsRepository;
        private readonly INotificationTokenRepository _notificationTokenRepository;

        public TokenLifeCycleHandler(ILogger<TokenLifeCycleHandler> logger,
                                INovopaymentTokenizationAdapter tokenizationAdapter,
                                IConfiguration configuration,
                                IRequestLogsRepository requestLogsRepository,
                                INotificationTokenRepository notificationTokenRepository)
        {
            _logger = logger;
            _tokenizationAdapter = tokenizationAdapter;
            _configuration = configuration;
            _requestLogsRepository = requestLogsRepository;
            _notificationTokenRepository = notificationTokenRepository;
        }

        public async Task<ResponseBindingModel<bool>> Handle(TokenLifeCycleCommand request, CancellationToken cancellationToken)
        {
            ResponseBindingModel<bool> responseViewModel = new ResponseBindingModel<bool>();
            try
            {
                TokenLifeCycleRequest tokenRequest = new TokenLifeCycleRequest()
                {
                    operatorID = "dale",
                    operationReason = request.updateTokenRequest.OperationReason,
                    operationType = request.updateTokenRequest.OperationType,
                    tokenReferenceID = request.updateTokenRequest.TokenReferenceId,
                    tokenRequestorID = request.updateTokenRequest.tokenRequestorID
                };           

                Log($"Save request in request logs");
                var logResponse = await _requestLogsRepository.AddLog(new RequestLog
                {
                    Type = RequestLogTypes.UpdateTokenLifeCycle,
                    RequestData = JsonConvert.SerializeObject(tokenRequest)
                });

                Log($"Send request to delete token service");
                var clientId = _configuration.GetValue<string>("CertificateNovo:ClientId");
                var result = await _tokenizationAdapter.TokenLifecycle(tokenRequest, clientId);

                Log($"Save response in request logs");
                await _requestLogsRepository.UpdateLog(logResponse.Id, new RequestLog { ResponseData = JsonConvert.SerializeObject(result) });

                if (result.Succeeded)
                {
                    return responseViewModel = result;
                }
                else
                {
                    responseViewModel.Result = false;
                    responseViewModel.Succeeded = false;
                    responseViewModel.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                        Message = "Ocurrio un error al consumir el servicio de Tokenización de novopayment."
                    };

                    Log(JsonConvert.SerializeObject(responseViewModel));

                    return responseViewModel;
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

        private void Log(string description, bool debug = false, object additionalData = null)
        {
            if (!debug)
                _logger.LogInformation(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Information",
                    Funcionalidad = "TokenLifeCycleHandler",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "TokenLifeCycleHandler",
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
                Funcionalidad = "TokenLifeCycleHandler",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }

        #endregion

    }
}
