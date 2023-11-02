using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class DebitCardCashBackDetailEntity
    {
        public int Id { get; set; }
        public DateTime? Date { get; set; }
        public string Deposit { get; set; }
        public string TypeTransaction { get; set; }
        public string TypeMessage { get; set; }
        public string Amount { get; set; }
        public string AuthorizationCode { get; set; }
        public string AcquirerCode { get; set; }
        public string Reference { get; set; }
        public string CommerceCode { get; set; }
        public string Commerce { get; set; }
        public string Category { get; set; }
        public string ResponseCode { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public int StatusId { get; set; }
        public DateTime DateProcess { get; set; }
        public DateTime DateProcessUtc { get; set; }
    }
}
