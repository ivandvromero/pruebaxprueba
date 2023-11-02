using Dale.Services.DebitCard.Domain.Core.Interfaces.CoreApi;
using Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment;
using Dale.Services.DebitCard.Infraestructure.Proxies.CoreApi;
using Dale.Services.DebitCard.Infraestructure.Proxies.Novopayment;
using Microsoft.Extensions.DependencyInjection;

namespace Dale.Services.DebitCard.Infraestructure.Proxies
{
    public static class TokenizationServiceAdapterExtension
    {
        public static IServiceCollection AddConfigureServiceProxies(this IServiceCollection services)
        {
            services.AddScoped<ICoreApiAdapter, CoreApiAdapter>();
            services.AddScoped<INovopaymentTokenizationAdapter, NovopaymentTokenizationAdapter>();
            services.AddScoped<INovopaymentDebitCardAdapter, NovopaymentDebitCardAdapter>();
            return services;
        }
    }
}
