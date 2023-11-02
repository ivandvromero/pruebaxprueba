using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Application.CQRSCommands.Commands.Tokenization
{
    public class UpdatePanCommand : IRequest<ResponseBindingModel<bool>>
    {
        public UpdatePanRequestBindingModel UpdatePanRequestBindingModel { get; set; }
    }
}
