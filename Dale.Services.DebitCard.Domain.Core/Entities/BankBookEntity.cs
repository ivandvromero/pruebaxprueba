using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class BankBookEntity
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUtc { get; set; }
        public string Type { get; set; }
        public decimal Amount { get; set; }
        public decimal Balance { get; set; }
        public string UserId { get; set; }
        public int TransactionId { get; set; }
        public int BankBookId { get; set; } = -1;
    }
}
