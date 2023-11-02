using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.Interfaces.CoreApi;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi;
using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using System;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Infraestructure.Proxies.CoreApi
{
    public class CoreApiAdapter: ICoreApiAdapter
    {
        private readonly IHttpClientFactory _httpClientFactory;
        private const string NameHttpClientCoreApi = "Core_Api";

        public CoreApiAdapter(IHttpClientFactory httpClientFactory)
        {
            _httpClientFactory = httpClientFactory;
        }

        /// <summary>
        /// method to obtain a users debit card
        /// </summary>
        /// <param name="cardNumber">Complete card number</param>
        /// <returns>DebitCardInfoResponse Object</returns>
        public async Task<ResponseBindingModel<DebitCardInfoResponse>> GetUserByCardNumber(string cardNumber)
        {
            var result = new ResponseBindingModel<DebitCardInfoResponse>();
            HttpRequestMessage request;
            try
            {
                var client = _httpClientFactory.CreateClient(NameHttpClientCoreApi);

                request = new HttpRequestMessage(HttpMethod.Post, "/api/DebitCard/UserInfoByCardNumber");

                DebitCardUserInfoRequest model = new DebitCardUserInfoRequest
                {
                    CardNumber = cardNumber
                };
                request.Content = new StringContent(model.ConvertObjectToString(), Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var card = JsonConvert.DeserializeObject<DebitCardInfoResponse>(response.Content.ReadAsStringAsync().Result);
                    if (card.Rc != "0")
                    {
                        result.Succeeded = false;
                        result.ErrorResult = new ErrorMessageBindingModel
                        {
                            Code = Convert.ToString((int)HttpStatusCode.BadRequest),
                            Message = card.Msg
                        };
                    }
                    result.Result = card;
                }
                else if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.Unauthorized),
                        Message = response.Content.ReadAsStringAsync().Result
                    };
                }
                else
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                        Message = response.Content.ReadAsStringAsync().Result
                    };
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

        public async Task<ResponseBindingModel<WaloHandlingFeeResponse>> WaloHandlingFeePending(WaloHandlingFeeRequest model, string token)
        {
            var result = new ResponseBindingModel<WaloHandlingFeeResponse>();
            HttpRequestMessage request;
            try
            {
                var client = _httpClientFactory.CreateClient(NameHttpClientCoreApi);

                client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

                request = new HttpRequestMessage(HttpMethod.Post, "/api/Account/WaloHandlingFeePending");
                request.Content = new StringContent(model.ConvertObjectToString(), Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    var responseWalo = JsonConvert.DeserializeObject<WaloHandlingFeeResponse>(response.Content.ReadAsStringAsync().Result);
                    if (!responseWalo.IsSuccess)
                    {
                        result.Succeeded = false;
                        result.ErrorResult = new ErrorMessageBindingModel
                        {
                            Code = Convert.ToString((int)HttpStatusCode.BadRequest),
                            Message = responseWalo.Message
                        };
                    }

                    result.Result = responseWalo;
                }
                else if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.Unauthorized),
                        Message = response.Content.ReadAsStringAsync().Result
                    };
                }
                else
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                        Message = response.Content.ReadAsStringAsync().Result
                    };
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
        public async Task<ResponseBindingModel<CreateUpdateHanldingFeeResponse>> CreateHandlingFeeAllyPartner(CreateHanldingFeeRequest model, string token,bool createPay = true)
        {
            HttpRequestMessage request;

            var client = _httpClientFactory.CreateClient(NameHttpClientCoreApi);

            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var action = createPay ?  "/api/Account/CreatePayForPendigFee" :"/api/Account/CreatePendingFeeAllyPartner";
            request = new HttpRequestMessage(HttpMethod.Post, action);
            request.Content = new StringContent(model.ConvertObjectToString(), Encoding.UTF8, "application/json");

            var response =  await client.SendAsync(request);
            return await GetReponse(response);
        }

        public async Task<ResponseBindingModel<CreateUpdateHanldingFeeResponse>> UpdateHandlingFeeAllyPartner(UpdateHanlingFeeRequest model, string token)
        {
            HttpRequestMessage request;

            var client = _httpClientFactory.CreateClient(NameHttpClientCoreApi);

            client.DefaultRequestHeaders.Add("Authorization", $"Bearer {token}");

            var action = "/api/Account/UpdatePendingFeeAllyPartner";
            request = new HttpRequestMessage(HttpMethod.Post, action);
            request.Content = new StringContent(model.ConvertObjectToString(), Encoding.UTF8, "application/json");

            var response = await client.SendAsync(request);
            return await GetReponse(response);
        }

        private async Task<ResponseBindingModel<CreateUpdateHanldingFeeResponse>> GetReponse(HttpResponseMessage response)
        {
            var result = new ResponseBindingModel<CreateUpdateHanldingFeeResponse>();

            try
            {
               

                if (response.IsSuccessStatusCode)
                {
                    var responseProcess = JsonConvert.DeserializeObject<CreateUpdateHanldingFeeResponse>(response.Content.ReadAsStringAsync().Result);
                    if (!responseProcess.IsSuccess)
                    {
                        result.Succeeded = false;
                        result.ErrorResult = new ErrorMessageBindingModel
                        {
                            Code = Convert.ToString((int)HttpStatusCode.BadRequest),
                            Message = responseProcess.ResponseMsg
                        };
                    }

                    result.Result = responseProcess;
                }
                else if (response.StatusCode == HttpStatusCode.Unauthorized)
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.Unauthorized),
                        Message = response.Content.ReadAsStringAsync().Result
                    };
                }
                else
                {
                    result.Succeeded = false;
                    result.ErrorResult = new ErrorMessageBindingModel
                    {
                        Code = Convert.ToString((int)HttpStatusCode.InternalServerError),
                        Message = response.Content.ReadAsStringAsync().Result
                    };
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
        #region Utils
        public async Task<TokenGeneratorResponse> GetToken(string email)
        {
            var result = new TokenGeneratorResponse();
            HttpRequestMessage request;
            try
            {
                var client = _httpClientFactory.CreateClient(NameHttpClientCoreApi);

                client.DefaultRequestHeaders.Add("User-Agent", "AWS/ApiGateway");

                request = new HttpRequestMessage(HttpMethod.Post, "/api/Gateway/ApiGatewayToken");

                TokenGeneratorRequest model = new TokenGeneratorRequest
                {
                    email = email
                };
                request.Content = new StringContent(model.ConvertObjectToString(), Encoding.UTF8, "application/json");

                var response = await client.SendAsync(request);
                if (response.IsSuccessStatusCode)
                {
                    result = JsonConvert.DeserializeObject<TokenGeneratorResponse>(response.Content.ReadAsStringAsync().Result);
                }

                return result;
            }
            catch (Exception)
            {
                return null;
            }
        }
        #endregion
    }
}
