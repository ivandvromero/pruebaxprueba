using Dale.Services.DebitCard.Domain.Core;
using Dale.Services.DebitCard.Domain.Core.ViewModels.TokenLifeCycle;
using MediatR;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Application.CQRSQueries.Querys.Tokenization
{
    public class GetTokenStatusQuery : IRequest<ResponseBindingModel<List<StatusTokenResponseBindingModel>>>
    {
        public string UserId { get; set; }
    }
}
