using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class DebitCardEntity
    {
        public int Id { get; set; }
        public int CardTypeId { get; set; }
        public int StatusId { get; set; }
        public string UserId { get; set; }
        public string CardToken { get; set; }
        public string UserToken { get; set; }
        public int CityId { get; set; }
        public string Code { get; set; }
        public string DepartmentName { get; set; }
        public string Address { get; set; }
        public string IPAddress { get; set; }
        public DateTime? RequestIssuanceDate { get; set; }
        public DateTime? RequestIssuanceDateUtc { get; set; }
        public DateTime? RequestActivationDate { get; set; }
        public DateTime? RequestActivationDateUtc { get; set; }
        public DateTime? RequestReIssuanceDate { get; set; }
        public DateTime? RequestReIssuanceDateUtc { get; set; }
        public DateTime? RequestCancellationDate { get; set; }
        public DateTime? RequestCancellationDateUtc { get; set; }
        public DateTime? RequestBlockingDate { get; set; }
        public DateTime? RequestBlockingDateUtc { get; set; }
        public DateTime? RequestUnblockingDate { get; set; }
        public DateTime? RequestUnblockingDateUtc { get; set; }
        public DateTime? RequestActivationDateAdminPanel { get; set; }
        public DateTime? RequestActivationDateUtcAdminPanel { get; set; }
        public DateTime? RequestCancellationDateAdminPanel { get; set; }
        public DateTime? RequestCancellationDateUtcAdminPanel { get; set; }
        public int? AgreementId { get; set; }
        public int? ReasonId { get; set; }
        public string Remarks { get; set; }
        public DateTime? LastStatusChangeDate { get; set; }
        public DateTime? LastStatusChangeDateUtc { get; set; }
        public int? DebitCardType { get; set; }
        public bool TermsConditionsIssuance { get; set; } = true;
        public DateTime? LastPermitSeeCardNumber { get; set; }
        public DateTime? LastPermitSeeCardNumberUtc { get; set; }
        public string UserIdPermitSeeCardNumber { get; set; }
        public string CardTokenTarget { get; set; }
    }
}
