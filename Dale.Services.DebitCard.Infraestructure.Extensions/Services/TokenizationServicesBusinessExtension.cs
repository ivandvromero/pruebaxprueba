using Dale.Architecture.PoC.Common.Extensions.Generics;
using Dale.Extensions.MessageBroker.Core.Bus;
using Dale.Extensions.MessageBroker.RabbitMQ.Infraestructure;
using Dale.Services.DebitCard.Domain.Core.Interfaces;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Cryptography;
using Dale.Services.DebitCard.Domain.Core.Options;
using Dale.Services.DebitCard.Infaestructure.Implementations;
using Dale.Services.DebitCard.Infraestructure.Extensions.Generics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Dale.Architecture.PoC.Common.Extensions.Services
{
    public static class TokenizationServicesBusinessExtension
    {
        public static IServiceCollection AddConfigureServicesBusiness(this IServiceCollection services, IConfiguration configuration)
        {

            //Options
            services.AddSingleton(configuration.GetOptions<CertificateOptions>("CertificateDale"));
            services.AddHttpClientCoreApi(configuration.GetOptions<ApiUrlsOptions>("ApiUrls"));
            services.AddHttpClientNovopaymentTokenizationApi(configuration.GetOptions<ApiUrlsOptions>("ApiUrls"));

            //Business
            services.AddTransient<IEventBusProducer, RabbitMQBroker>();
            services.AddTransient<IEventBusConsumer, RabbitMQBroker>();
            services.AddScoped<ICurrentUser, CurrentUser>();
            services.AddScoped<ICryptography, Cryptography>();

            return services;
        }
    }
}
