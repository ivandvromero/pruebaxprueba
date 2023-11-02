using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken;
using MediatR;

namespace Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization
{
    public class CreateNotificationTokenCommand : IRequest<ResponseBindingModel<bool>>
    {
        public string ClientID { get; set; }
        public NotificationTokenRequestBindingModel NotificationTokenRequest { get; set; }
    }
}
