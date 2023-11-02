using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class HandlingFeeEntity
    {
        public int TransactionId { get; set; }
        public int? AgreementId { get; set; }
        public decimal Amount { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUtc { get; set; }
    }
}
