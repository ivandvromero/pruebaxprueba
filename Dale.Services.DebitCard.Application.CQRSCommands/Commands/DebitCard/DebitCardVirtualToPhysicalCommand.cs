using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;
using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard;
using MediatR;

namespace Dale.Services.DebitCard.Application.CQRSCommands.Commands.DebitCard
{
    public class DebitCardVirtualToPhysicalCommand : IRequest<ResponseBindingModel<ToPhysicalResponse>>
    {
        public DebitCardRequestBindingModel DebitCardRequest { get; set; }
    
    }
}
