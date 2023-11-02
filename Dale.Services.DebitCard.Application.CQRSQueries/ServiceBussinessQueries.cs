using Dale.Services.DebitCard.Application.CQRSQueries.QueryHandlers.Tokenization;
using Microsoft.Extensions.DependencyInjection;

namespace Dale.Services.DebitCard.Application.CQRSQueries
{
    public static class ServiceBussinessQueries
    {
        public static IServiceCollection AddConfigureServicesQueryHandlers(this IServiceCollection services)
        {

            //Handlers Query Events
            services.AddTransient<GetTokenStatusQueryHandler>();

            return services;
        }
    }
}
