namespace Dale.Services.DebitCard.Domain.Core.ViewModels.NotificationToken
{
    public class NotificationTokenRequestBindingModel
    {
        public string PanReferenceID { get; set; }
        public string TokenReferenceID { get; set; }
        public long TokenRequestorID { get; set; }
        public string MessageReasonCode { get; set; }
        public string DateTimeOfEvent { get; set; }
        public string EncryptedData { get; set; }
    }
}
