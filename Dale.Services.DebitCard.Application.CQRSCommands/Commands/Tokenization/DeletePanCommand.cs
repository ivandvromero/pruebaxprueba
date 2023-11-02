using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle;
using MediatR;

namespace Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization
{
    public class DeletePanCommand : IRequest<ResponseBindingModel<bool>>
    {
        public DeletePanRequestBindingModel DeletePanRequest { get; set; }
    }
}
