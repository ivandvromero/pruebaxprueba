namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.NovopaymentDebitCard
{
    public class ToPhysicalRequest
    {
        public string observations { get; set; }
        public string cardToken { get; set; }
    }

    public class Data
    {
        public string data { get; set; }
    }
}
