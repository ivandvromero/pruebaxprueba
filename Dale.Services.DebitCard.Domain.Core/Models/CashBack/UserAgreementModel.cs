using Microsoft.VisualBasic;

namespace Dale.Services.DebitCard.Domain.Core.Models.CashBack
{
    public class UserAgreementModel
    {
        public string AgreementCode { get; set; }
        public int? UberAssociatedCategoryId { get; set; }
        public string StatusAgreement { get; set; }
        public bool CardSelected { get; set; }
        public int? CategoryId { get; set; }
        public decimal MaxAmount { get; set; }
        public int Percentage { get; set; }
        public string StatusUser { get; set; }
    }
}
