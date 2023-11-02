using Dale.Services.DebitCard.Application.CQRSEvents.EventsHandlers.HandlingFee;
using Microsoft.Extensions.DependencyInjection;

namespace Dale.Services.DebitCard.Application.CQRSEvents
{
    public static class ServiceBussinessEvents
    {
        public static IServiceCollection AddConfigureServicesEventHandlers(this IServiceCollection services)
        {
            services.AddTransient<HandlingFeeCreatedEventHandler>();
            services.AddTransient<CashBackCreatedEventHandler>();

            return services;
        }
    }
}
