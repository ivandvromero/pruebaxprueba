using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Services.DebitCard.Domain.Core.Options;
using Dale.Services.DebitCard.Infraestructure.Extensions.HealthChecks.Dynamo;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;

namespace Dale.Architecture.PoC.Common.Extensions.HealthChecks
{
    public static class HealthChecksExtension
    {
        /// <summary>
        /// Seccion para Adicionar Health Checks sobre recursos a monitorear como BD , Broker, API Externas, o cualquier
        /// Items relevante que pueda impactar la API.
        /// </summary>
        /// <param name="services"></param>
        /// <param name="configuration"></param>
        /// <returns></returns>
        public static IServiceCollection AddHealthChecksCustom(this IServiceCollection services, IConfiguration configuration)
        {
            var apiUrl = configuration.GetOptions<ApiUrlsOptions>("ApiUrls");
            var dynamoDBOptions = configuration.GetOptions<AWSOptions>("AwsSettings");

            services.AddHealthChecks()
                .AddUrlGroup(new Uri(apiUrl.CoreApi), name: "CoreAPI")
                //.AddUrlGroup(new Uri(apiUrl.NovopaymentTokenizationApi), name: "TokenizationAPI")
            .AddCheck<DynamoDBHealthCheck>("DynamoDB-Check", timeout: new TimeSpan(0, 1, 0));

            return services;
        }


    }
}
