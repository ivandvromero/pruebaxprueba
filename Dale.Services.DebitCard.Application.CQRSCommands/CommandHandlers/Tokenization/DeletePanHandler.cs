using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Enumerations;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization;
using MediatR;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using static Dale.Services.DebitCard.Domain.Core.Enumerations.Tokenization.PanLifecycleEnum;

namespace Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.Tokenization
{
    public class DeletePanHandler : IRequestHandler<DeletePanCommand, ResponseBindingModel<bool>>
    {

        private readonly ILogger<DeletePanHandler> _logger;
        private readonly INovopaymentTokenizationAdapter _tokenizationAdapter;
        private readonly ICryptography _cryptography;
        private readonly IConfiguration _configuration;
        private readonly IRequestLogsRepository _requestLogsRepository;

        public DeletePanHandler(ILogger<DeletePanHandler> logger,
                                INovopaymentTokenizationAdapter tokenizationAdapter,
                                IConfiguration configuration,
                                ICryptography cryptography,
                                IRequestLogsRepository requestLogsRepository)
        {
            _logger = logger;
            _tokenizationAdapter = tokenizationAdapter;
            _configuration = configuration;
            _cryptography = cryptography;
            _requestLogsRepository = requestLogsRepository;
        }

        public async Task<ResponseBindingModel<bool>> Handle(DeletePanCommand request, CancellationToken cancellationToken)
        {
            ResponseBindingModel<bool> responseViewModel = new ResponseBindingModel<bool>();
            try
            {
                
                var payload = new Dictionary<string, object>()
                {
                    { "cardholderInfo", request.DeletePanRequest.CardholderInfo }
                };

                Log($"Encrypt request update pan lifecycle");
                var encryptedDataSign = await _cryptography.Encrypt(payload.ConvertObjectToString(), _configuration.GetSection("CertificateNovo:CertificatePathJWE").Value, _configuration.GetSection("CertificateDale:CertificatePathJWSPrivate").Value);

                PanLifecycleRequest panRequest = new PanLifecycleRequest()
                {
                    operatorID = "dale",
                    operationReason = request.DeletePanRequest.OperationReason,
                    operationType = OperationType.DELETE.ToString(),
                    operationReasonCode = OperationReasonCode.ACCOUNT_CLOSED.ToString(),
                    encryptedData = encryptedDataSign
                };

                Log($"Save request in request logs");
                var logResponse = await _requestLogsRepository.AddLog(new RequestLog
                {
                    Type = RequestLogTypes.DeletePANLifeCycle,
                    RequestData = JsonConvert.SerializeObject(panRequest)
                });

                Log($"Send request to delete pan service");
                var clientId = _configuration.GetValue<string>("CertificateNovo:ClientId");
                var result = await _tokenizationAdapter.PanLifecycle(panRequest, clientId);

                Log($"Save response in request logs");
                await _requestLogsRepository.UpdateLog(logResponse.Id, new RequestLog { ResponseData = JsonConvert.SerializeObject(result) });

                if (result.Succeeded)
                {
                    responseViewModel.Succeeded = result.Succeeded;
                    return responseViewModel;
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
                    Funcionalidad = "DeletePanHandler",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "DeletePanHandler",
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
                Funcionalidad = "DeletePanHandler",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }

        #endregion

    }
}
