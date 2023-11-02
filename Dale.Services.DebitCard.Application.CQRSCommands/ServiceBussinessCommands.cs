using Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.DebitCard;
using Dale.Services.DebitCard.Application.CQRSCommands.CommandHandlers.Tokenization;
using Microsoft.Extensions.DependencyInjection;

namespace Dale.Services.DebitCard.Application.CQRSCommands
{
    public static class ServiceBussinessCommands
    {
        public static IServiceCollection AddConfigureServicesCommandHandlers(this IServiceCollection services)
        {

            //Handlers Events
            services.AddTransient<CreateNotificationTokenHandler>();
            services.AddTransient<DeletePanHandler>();
            services.AddTransient<UpdatePanHandler>();
            services.AddTransient<TokenLifeCycleHandler>();
            services.AddTransient<DebitCardVirtualToPhysicalHandler>();

            return services;
        }
    }
}
