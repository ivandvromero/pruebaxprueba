using AutoMapper;
using Dale.Extensions.Logging.Interfaces;
using Dale.Services.DebitCard.Application.CQRSQueries.Querys.Tokenization;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Entities;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using MediatR;
using System;
using System.Collections.Generic;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Application.CQRSQueries.QueryHandlers.Tokenization
{
    public class GetTokenStatusQueryHandler : IRequestHandler<GetTokenStatusQuery, ResponseBindingModel<List<StatusTokenResponseBindingModel>>>
    {

        private readonly ILogger<GetTokenStatusQueryHandler> _logger;
        private readonly IMapper _mapper;
        private readonly INotificationTokenRepository _notificationTokenRepository;
        private readonly ITokenizationUserTokenRepository _tokenizationUserTokenRepository;

        public GetTokenStatusQueryHandler(ILogger<GetTokenStatusQueryHandler> logger,
                                    IMapper mapper,
                                    INotificationTokenRepository notificationTokenRepository,
                                    ITokenizationUserTokenRepository tokenizationUserTokenRepository)
        {
            _logger = logger;
            _mapper = mapper;
            _notificationTokenRepository = notificationTokenRepository;
            _tokenizationUserTokenRepository = tokenizationUserTokenRepository;
        }

        public async Task<ResponseBindingModel<List<StatusTokenResponseBindingModel>>> Handle(GetTokenStatusQuery request, CancellationToken cancellationToken)
        {
            ResponseBindingModel<List<StatusTokenResponseBindingModel>> responseViewModel = new ResponseBindingModel<List<StatusTokenResponseBindingModel>>();
            try
            {
                Log($"Get token for user id from dynamo db");
                var tokens = await _tokenizationUserTokenRepository.GetTokensByUserId(request.UserId);

                List<StatusTokenResponseBindingModel> tokenList = new List<StatusTokenResponseBindingModel>();

                if (tokens != null)
                {
                    foreach (var token in tokens)
                    {
                        var tokenMap = _mapper.Map<TokenizationUserTokensEntity, StatusTokenResponseBindingModel>(token);
                        if (token.DeviceInfo != null)
                        {
                            var deviceInfo = _mapper.Map<DeviceInfo, DeviceInfoBindingModel>(token.DeviceInfo);
                            tokenMap.DevideInfo = deviceInfo;
                        }
                        
                        tokenMap.ExpirationDate = $"{token.tokenExpirationDate.Month}/{token.tokenExpirationDate.Year}";                       
                        tokenList.Add(tokenMap);
                    }

                    responseViewModel.Result = tokenList;
                }
                else
                {
                    responseViewModel.Succeeded = false;
                    responseViewModel.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.OK),
                        Message = "No se encontraron tokens para el usuario."
                    };
                }

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
                    Funcionalidad = "GetTokenStatusQueryHandler",
                    Description = description,
                    UserId = Environment.MachineName
                });
            else
                _logger.LogDebug(new Extensions.Logging.Models.K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Debug",
                    Funcionalidad = "GetTokenStatusQueryHandler",
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
                Funcionalidad = "GetTokenStatusQueryHandler",
                Description = e.Message,
                UserId = Environment.MachineName
            });
        }

        #endregion
    }
}
