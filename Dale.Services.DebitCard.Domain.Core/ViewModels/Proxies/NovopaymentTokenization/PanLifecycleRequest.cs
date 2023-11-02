namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentTokenization
{
    public class PanLifecycleRequest
    {
        public string operatorID { get; set; }
        public string operationType { get; set; }
        public string operationReason { get; set; }
        public string operationReasonCode { get; set; }
        public string encryptedData { get; set; }
    }
}
