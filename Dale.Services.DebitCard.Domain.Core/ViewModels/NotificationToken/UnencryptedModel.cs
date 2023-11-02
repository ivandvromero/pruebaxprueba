using Dale.Services.DebitCard.Domain.Core.ViewModels.DebitCard;

namespace Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken
{
    public class UnencryptedModel    {
        public CardholderInfo CardholderInfo { get; set; }
        public DeviceInfoBindingModel DeviceInfo { get; set; }
        public TokenInformation TokenInfo { get; set; }
    }
}
