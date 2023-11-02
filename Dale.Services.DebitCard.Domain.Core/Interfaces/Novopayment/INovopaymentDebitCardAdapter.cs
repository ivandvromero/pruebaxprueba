using Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard;
using System.Threading.Tasks;

namespace Dale.Services.DebitCard.Domain.Core.Interfaces.Novopayment
{
    public interface INovopaymentDebitCardAdapter
    {
        public Task<ResponseBindingModel<ToPhysicalResponse>> VirtualToPhysical(ToPhysicalRequest body, string cardId);
    }
}
