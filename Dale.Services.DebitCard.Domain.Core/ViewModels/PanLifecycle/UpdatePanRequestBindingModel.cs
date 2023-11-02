using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.PanLifecycle
{
    public class UpdatePanRequestBindingModel : DeletePanRequestBindingModel
    {
        public CardholderInfo ReplaceCardholderInfo { get; set; }
    }
}
