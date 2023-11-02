using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class UserAgreementEntity
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public string AgreementCode { get; set; }
        public int? AgreementId { get; set; }
        public int? CategoryId { get; set; }
        public int? StatusId { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public bool IsNotified { get; set; }
        public bool CardSelected { get; set; }
        public DateTime CreatedAtCardSelected { get; set; }
    }
}
