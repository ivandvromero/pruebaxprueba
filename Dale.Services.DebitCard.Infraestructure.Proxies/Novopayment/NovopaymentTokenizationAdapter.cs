using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Extensions.Logging.Interfaces;
using Dale.Extensions.Logging.Models;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infraestructure.Proxies.Novopayment
{
    public class NovopaymentTokenizationAdapter : INovopaymentTokenizationAdapter
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private readonly ILogger<NovopaymentTokenizationAdapter> _logger;
        private const string HttpClientNovopaymentApi = "Novopayment_Tokenization_Api";

        public NovopaymentTokenizationAdapter(IHttpClientFactory httpClientFactory, ILogger<NovopaymentTokenizationAdapter> logger)
        {
            _httpClientFactory = httpClientFactory;
            _logger = logger;
        }

        /// <summary>
        /// method to send PAN life cycle request
        /// </summary>
        /// <param name="body">PanLifecycleRequest Object</param>
        /// <param name="clientId">Dale client id</param>
        /// <returns>true if successful</returns>
        public async Task<ResponseBindingModel<string>> PanLifecycle(PanLifecycleRequest body, string clientId)
        {
            var result = new ResponseBindingModel<string>();
            HttpRequestMessage request;
            try
            {
                var client = _httpClientFactory.CreateClient(HttpClientNovopaymentApi);

                request = new HttpRequestMessage(HttpMethod.Post, $"/itsp/{clientId}/vtis/v1/pan/lifecycle");
                request.Content = new StringContent(body.ConvertObjectToString(), Encoding.UTF8, "application/json");
                request.Headers.Add("X-REQUEST-ID", Guid.NewGuid().ToString());
                request.Headers.Add("User-Agent", "dale");

                var test = body.ConvertObjectToString();

                var response = await client.SendAsync(request);

                if (response.IsSuccessStatusCode)
                {
                    result.Succeeded = true;
                }

                result.Result = response.ConvertObjectToString();

                return result;
            }
            catch (Exception ex)
            {
                result.Succeeded = false;
                result.ErrorResult = new ErrorMessageBindingModel
                {
                    Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                    Message = ex.Message
                };
                return result;
            }
        }

        /// <summary>
        /// method to send token life cycle request
        /// </summary>
        /// <param name="body">TokenLifecycleRequest Object</param>
        /// <param name="clientId">Dale client id</param>
        /// <returns>true if successful</returns>
        public async Task<ResponseBindingModel<bool>> TokenLifecycle(TokenLifeCycleRequest body, string clientId)
        {
            var result = new ResponseBindingModel<bool>();
            HttpRequestMessage request;
            try
            {
                var client = _httpClientFactory.CreateClient(HttpClientNovopaymentApi);

                request = new HttpRequestMessage(HttpMethod.Post, $"/itsp/{clientId}/vtis/v1/tokens/lifecycle");
                request.Content = new StringContent(body.ConvertObjectToString(), Encoding.UTF8, "application/json");

                Log("Request for TokenLifecycle method", additionalData: request);
                var response = await client.SendAsync(request);
                Log("Response for TokenLifecycle", additionalData: response);
                Log("Read Response for TokenLifecycle ", additionalData: response.Content.ReadAsStringAsync().Result);

                if (response.IsSuccessStatusCode)
                {
                    result.Succeeded = true;
                    result.Result = true;
                }

                return result;
            }
            catch (Exception ex)
            {
                result.Succeeded = false;
                result.ErrorResult = new ErrorMessageBindingModel
                {
                    Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                    Message = ex.Message
                };
                return result;
            }
        }

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

    }
}
