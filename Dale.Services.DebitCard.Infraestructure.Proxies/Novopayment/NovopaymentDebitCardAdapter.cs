using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Extensions.Logging.Interfaces;
using Dale.Extensions.Logging.Models;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Repositories;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard;
using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infraestructure.Proxies.Novopayment
{
    public class NovopaymentDebitCardAdapter : INovopaymentDebitCardAdapter
    {

        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<NovopaymentDebitCardAdapter> _logger;
        private readonly IConfiguration _configuration;
        private readonly ICryptography _cryptography;
        private const string HttpClientNovopaymentApi = "Novopayment_Tokenization_Api";
        private readonly IDebitCardRepository _debitCardRepository;


        public NovopaymentDebitCardAdapter(
            IHttpClientFactory httpClientFactory,
            ILogger<NovopaymentDebitCardAdapter> logger,
            IConfiguration configuration,
            ICryptography cryptography,
            IDebitCardRepository debitCardRepository)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
            _configuration = configuration;
            _cryptography = cryptography;
            _debitCardRepository = debitCardRepository;

        }

        public async Task<ResponseBindingModel<ToPhysicalResponse>> VirtualToPhysical(ToPhysicalRequest body, string cardId)
        {
            var result = new ResponseBindingModel<ToPhysicalResponse>();
            HttpRequestMessage request;
            string accesToken = string.Empty;
            try
            {
                var client = _httpClientFactory.CreateClient(HttpClientNovopaymentApi);
                var usercardtoken = await _debitCardRepository.GetUserByCardTokenDebitCard(body.cardToken);
                if (usercardtoken != null)
                {
                    Log($"User CardToken nombre:{usercardtoken.FirstName} {usercardtoken.LastName} email:{usercardtoken.Email} id: {usercardtoken.Id} cardtoken: {body.observations}");

                }
                Log("Start method call to get token");
                var token = await GetToken();
                Log("End call to method to get token");

                if (token.Succeeded)
                {
                    Log("Successfully obtained token");
                    accesToken = token.Result.access_token;

                    Log("Request before encript", additionalData: body);
                    var jweToken = await _cryptography.EncryptJWE(body.ConvertObjectToString(), _configuration.GetSection("CertificateDaleVirtual2Physical:CertificatePathNovoJWEPublic").Value);

                    var jwsToken = await _cryptography.EncryptJWS(jweToken, _configuration.GetSection("CertificateDaleVirtual2Physical:CertificatePathJWSPrivate").Value);

                    Data data = new Data
                    {
                        data = jweToken
                    };

                    request = new HttpRequestMessage(HttpMethod.Put, $"/api/v1.2/cards/tophysical");
                    request.Content = new StringContent(data.ConvertObjectToString(), Encoding.UTF8, "application/json");
                    request.Headers.Add("Authorization", $"Bearer {accesToken}");
                    request.Headers.Add("X-Tenant-Id", _configuration.GetValue<string>("Novopayment:TenantId").ToString());
                    request.Headers.Add("X-Token", "JWS " + jwsToken);

                    Log("Request for physical method", additionalData: request);
                    var response = await client.SendAsync(request);
                    var toPhysicalResponse = JsonConvert.DeserializeObject<ToPhysicalResponse>(response.Content.ReadAsStringAsync().Result);
                    Log("Deserialize to physical response", additionalData: toPhysicalResponse);

                    if (response.IsSuccessStatusCode)
                    {
                        result.Succeeded = true;
                        result.Result = toPhysicalResponse;
                    }
                    else
                    {
                        result.Succeeded = false;
                        result.ErrorResult = new ErrorMessageBindingModel
                        {
                            Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                            Message = toPhysicalResponse.message
                        };
                    }                 
                }
                else
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                        Message = "No pudo obtenerse el token satisfactoriamente."
                    };
                }

                Log("Finish call adapter to physical", additionalData: result);

                return result;

            }
            catch (Exception ex)
            {
                LogException(ex);
                result.Succeeded = false;
                result.ErrorResult = new ErrorMessageBindingModel
                {
                    Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                    Message = ex.Message
                };
                return result;
            }
        }

        private async Task<ResponseBindingModel<CredentialsResponse>> GetToken()
        {
            var result = new ResponseBindingModel<CredentialsResponse>();
            HttpRequestMessage request;
            try
            {
                var client = _httpClientFactory.CreateClient(HttpClientNovopaymentApi);

                var credentials = new[]
                {
                    new KeyValuePair<string, string>("grant_type", _configuration.GetValue<string>("Novopayment:GrantType").ToString()),
                    new KeyValuePair<string, string>("client_id", _configuration.GetValue<string>("Novopayment:ClientId").ToString()),
                    new KeyValuePair<string, string>("client_secret", _configuration.GetValue<string>("Novopayment:ClientSecret").ToString()),
                };

                Log("Credentials for authentication are obtained", additionalData: credentials);

                request = new HttpRequestMessage(HttpMethod.Post, $"/oauth2/v1/token");
                Log("Credentials for authentication are obtained ConvertObjectToString", additionalData: credentials.ConvertObjectToString());
                
                var url = string.Format("{0}oauth2/v1/token", client.BaseAddress);
                Log("Send request to service");
                Log("Request for getToken method", additionalData: request);
                var response = await client.PostAsync(url, new FormUrlEncodedContent(credentials));
                Log("Response for getToken", additionalData: response);
                var accessToken = JsonConvert.DeserializeObject<CredentialsResponse>(response.Content.ReadAsStringAsync().Result);
                Log("Read Response for get token", additionalData: response.Content.ReadAsStringAsync().Result);
                Log("Deserialize access token ", additionalData: accessToken);

                if (response.IsSuccessStatusCode)
                {
                    result.Result = accessToken;
                    result.Succeeded = true;
                }
                else
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.BadRequest),
                        Message = accessToken.Error
                    };
                };

                Log("Return result for get token ", additionalData: result);

                return result;

            }
            catch (Exception ex)
            {
                LogException(ex);
                result.Succeeded = false;
                result.ErrorResult = new ErrorMessageBindingModel
                {
                    Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                    Message = ex.Message
                };
                return result;
            }
        }

        #region Private Methods

        private void Log(string description, bool debug = false, object additionalData = null)
        {
            if (!debug)
                _logger.LogInformation(new K7LogInfo()
                {
                    TimeStampEvent = DateTime.Now,
                    Category = "Information",
                    Funcionalidad = "NotificationHandler",
                    Description = description,
                    UserId = Environment.MachineName,
                    AdditionalData = additionalData
                });
            else
                _logger.LogDebug(new K7LogInfo()
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
            _logger.LogError(new K7LogInfo()
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
