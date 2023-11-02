using AutoMapper;
using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Application.CQRSCommands.Commands.DebitCard;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard;
using MediatR;
using Microsoft.Extensions.Configuration;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.DebitCard
{
    public class DebitCardVirtualToPhysicalHandler : IRequestHandler<DebitCardVirtualToPhysicalCommand, ResponseBindingModel<ToPhysicalResponse>>
    {
        private readonly ILogger<DebitCardVirtualToPhysicalHandler> _logger;
        private readonly INovopaymentDebitCardAdapter _debitCardAdapter;
        private readonly IConfiguration _configuration;


        public DebitCardVirtualToPhysicalHandler(
            ILogger<DebitCardVirtualToPhysicalHandler> logger,
            INovopaymentDebitCardAdapter debitCardAdapter,
            IConfiguration configuration)
        {
            _logger = logger;
            _debitCardAdapter = debitCardAdapter;
            _configuration = configuration;
        }

        public async Task<ResponseBindingModel<ToPhysicalResponse>> Handle(DebitCardVirtualToPhysicalCommand request, CancellationToken cancellationToken)
        {
            ResponseBindingModel<ToPhysicalResponse> responseViewModel = new ResponseBindingModel<ToPhysicalResponse>();
            try
            {
                Log($"Start conversion to physical card");
                var toPhysical = new ToPhysicalRequest()
                {
                    cardToken = request.DebitCardRequest.CardToken
                };

                Log($"Start call debit card Adapter");
                var responseToPhysical = await _debitCardAdapter.VirtualToPhysical(toPhysical, request.DebitCardRequest.CardToken);
                Log($"Finish call debit card Adapter");

                responseViewModel.Succeeded = responseToPhysical.Succeeded ? true : false;
                responseViewModel.Result = responseToPhysical.Result != null ? responseToPhysical.Result : null;
                responseViewModel.ErrorResult = responseToPhysical.ErrorResult != null ? responseToPhysical.ErrorResult : null;

                Log($"Finish conversion to physical card");
                return responseViewModel;
            }
            catch (Exception ex)
            {
                LogException(ex);
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
                    Funcionalidad = "NotificationHandler",
                    Description = description,
                    UserId = Environment.MachineName,
                    AdditionalData = additionalData
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
