using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using MediatR;

namespace Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization
{
    public class TokenLifeCycleCommand : IRequest<ResponseBindingModel<bool>>
    {
        public TokenLifeCycleRequestBindingModel updateTokenRequest { get; set; }
    }
}
