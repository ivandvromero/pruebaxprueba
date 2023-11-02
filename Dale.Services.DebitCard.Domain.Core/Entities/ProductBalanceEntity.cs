using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class ProductBalanceEntity
    {
        public int Id { get; set; }
        public int ProductTypeId { get; set; }
        public String UserId { get; set; }
        public Decimal Balance { get; set; }
        public byte[] Version { get; set; }
    }
}
