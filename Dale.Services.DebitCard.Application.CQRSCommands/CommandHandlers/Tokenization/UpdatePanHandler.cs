using AutoMapper;
using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography;
using Dale.Architecture.PoC.Common.Extensions.Generics;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization;
using static Dale.Services.DebitCard.Domain.Core.Enumerations.Tokenization.PanLifecycleEnum;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Newtonsoft.Json;
using Dale.Services.DebitCard.Domain.Core.Enumerations;
using Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization;

namespace Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.Tokenization
{
    public class UpdatePanHandler : IRequestHandler<UpdatePanCommand, ResponseBindingModel<bool>>
    {
        private readonly ILogger<UpdatePanHandler> _logger;
        private readonly ICryptography _cryptography;
        private readonly IConfiguration _configuration;
        private readonly INovopaymentTokenizationAdapter _tokenizationAdapter;
        private readonly IRequestLogsRepository _requestLogsRepository;

        public UpdatePanHandler(ILogger<UpdatePanHandler> logger,
                                IMapper mapper,
                                ICryptography cryptography,
                                IConfiguration configuration,
                                INovopaymentTokenizationAdapter tokenizationAdapter,
                                IRequestLogsRepository requestLogsRepository)
        {
            _logger = logger;
            _cryptography = cryptography;
            _configuration = configuration;
            _tokenizationAdapter = tokenizationAdapter;
            _requestLogsRepository = requestLogsRepository;
        }

        public async Task<ResponseBindingModel<bool>> Handle(UpdatePanCommand request, CancellationToken cancellationToken)
        {
            ResponseBindingModel<bool> responseViewModel = new ResponseBindingModel<bool>();
            try
            {
                Log($"Validate bussiness rule account update");
                if (request.UpdatePanRequestBindingModel.CardholderInfo.primaryAccountNumber == request.UpdatePanRequestBindingModel.ReplaceCardholderInfo.primaryAccountNumber)
                {
                    responseViewModel.Result = false;
                    responseViewModel.Succeeded = false;
                    responseViewModel.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.BadRequest),
                        Message = "El PAN antiguo no puedo ser igual al PAN nuevo."
                    };

                    return responseViewModel;
                }

                var payload = new Dictionary<string, object>()
                {
                    { "cardholderInfo", request.UpdatePanRequestBindingModel.CardholderInfo },
                    { "replaceCardHolderInfo", request.UpdatePanRequestBindingModel.ReplaceCardholderInfo }
                };

                Log($"Encrypt request update pan lifecycle");
                var encryptedDataSign = await _cryptography.Encrypt(payload.ConvertObjectToString(), _configuration.GetSection("CertificateNovo:CertificatePathJWE").Value, _configuration.GetSection("CertificateDale:CertificatePathJWSPrivate").Value);

                PanLifecycleRequest panRequest = new PanLifecycleRequest()
                {
                    operatorID = "dale",
                    operationReason = request.UpdatePanRequestBindingModel.OperationReason,
                    operationType = OperationType.UPDATE.ToString(),
                    operationReasonCode = OperationReasonCode.ACCOUNT_UPDATE.ToString(),
                    encryptedData = encryptedDataSign
                };

                Log($"Save request in request logs");
                var logResponse = await _requestLogsRepository.AddLog(new RequestLog
                {
                    Type = RequestLogTypes.UpdatePANLifeCycle,
                    RequestData = JsonConvert.SerializeObject(panRequest)
                });

                Log($"Send request to update pan service");
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
                        Message = $"Ocurrio un error al consumir el servicio de Tokenización de novopayment. {result.ErrorResult.Message}"
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
                    Code = HttpStatusCode.InternalServerError.ToString(),
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
                    Funcionalidad = "UpdatePanHandler",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "UpdatePanHandler",
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
                Funcionalidad = "UpdatePanHandler",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }

        #endregion

    }
}
