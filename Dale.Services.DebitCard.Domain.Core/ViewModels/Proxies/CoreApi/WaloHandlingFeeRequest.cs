namespace Dale.Services.DebitCard.Domain.Core.ViewModels.Proxies.CoreApi
{
    public class WaloHandlingFeeRequest
    {
        public string UserId { get; set; }
        public int TransactionId { get; set; }
        public decimal Amount { get; set; }
    }
}
