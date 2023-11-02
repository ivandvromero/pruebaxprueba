using Dale.Services.DebitCard.Domain.Core.Options;
using Microsoft.Extensions.DependencyInjection;
using Polly;
using Polly.Extensions.Http;
using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Security.Cryptography.X509Certificates;

namespace Dale.Services.DebitCard.Infraestructure.Extensions.Generics
{
    public static class HttpClientExtension
    {

        public static IServiceCollection AddHttpClientCoreApi(this IServiceCollection services, ApiUrlsOptions apiUrlsOptions)
        {
            services.AddHttpClient("Core_Api", c => { c.BaseAddress = new Uri(apiUrlsOptions.CoreApi); })
                .AddPolicyHandler(GetRetryPolicy(apiUrlsOptions.RetryAttempts, apiUrlsOptions.RetryIntervalInSeconds));
            return services;
        }

        public static IServiceCollection AddHttpClientNovopaymentTokenizationApi(this IServiceCollection services, ApiUrlsOptions apiUrlsOptions)
        {
            var clientCertificate =
                new X509Certificate2(apiUrlsOptions.CertificatePath, apiUrlsOptions.CertificatePasswordPath);

            var handler = new HttpClientHandler();
            handler.ClientCertificates.Add(clientCertificate);
            handler.SslProtocols = System.Security.Authentication.SslProtocols.Tls12;
            handler.ServerCertificateCustomValidationCallback = (sender, cert, chain, sslPolicyErrors) => { return true; };

            services.AddHttpClient("Novopayment_Tokenization_Api", c => 
            { 
                c.BaseAddress = new Uri(apiUrlsOptions.NovopaymentTokenizationApi);
                c.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                c.DefaultRequestHeaders.AcceptLanguage.Add(new StringWithQualityHeaderValue("en-US"));
                c.DefaultRequestHeaders.TryAddWithoutValidation("Content-Language", "en-US");
                c.DefaultRequestHeaders.Host = "cert-api.novopayment.com";
            }).ConfigurePrimaryHttpMessageHandler(() => handler).SetHandlerLifetime(System.Threading.Timeout.InfiniteTimeSpan)
                .AddPolicyHandler(GetRetryPolicy(apiUrlsOptions.RetryAttempts, apiUrlsOptions.RetryIntervalInSeconds));
            return services;
        }

        private static IAsyncPolicy<HttpResponseMessage> GetRetryPolicy(int retryAttempts, int interval)
        {
            return HttpPolicyExtensions
              .HandleTransientHttpError()
              .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.NotFound)
              .OrResult(msg => msg.StatusCode == System.Net.HttpStatusCode.RequestTimeout)
              .WaitAndRetryAsync(retryAttempts, retryAttempt => TimeSpan.FromSeconds(Math.Pow(interval, retryAttempt)));
        }

    }
}
