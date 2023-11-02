using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class AllyPartnerHandlingFeeEntity
    {
        public int Id { get; set; }
        public int AgreementId { get; set; }
        public decimal Amount { get; set; }
        public string UserId { get; set; }

        public int StatusId { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUtc { get; set; }
        public int? TransactionId { get; set; }
    }

}
