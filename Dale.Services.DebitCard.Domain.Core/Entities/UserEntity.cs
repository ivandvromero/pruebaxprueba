using Dale.Services.DebitCard.Domain.Core.Constans;
using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class UserEntity
    {
        public string Id { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string AccountNumber { get; set; }
        public int DocumentTypeId { get; set; }
        public string CardNumber { get; set; }
        public string PassportNumber { get; set; }
        public string SpecialPermitNumber { get; set; }
        public DateTime IssueDate { get; set; }
        public DateTime BirthDate { get; set; }
        public Enums.Gender Gender { get; set; }
        public string Picture { get; set; }
        public string Address { get; set; }
        public string Language { get; set; }
        public string TimeZone { get; set; }
        public int StatusId { get; set; }
        public int Flagged { get; set; }
        public DateTime? LastFlagged { get; set; }
        public DateTime? LastFlaggedUtc { get; set; }
        public DateTime? CreatedAt { get; set; }
        public DateTime? CreatedAtUtc { get; set; }
        public string Twitter { get; set; }
        public bool TermsConditionsAccepted { get; set; }
        public int? CompanyId { get; set; }
        public bool GMFExempt { get; set; }
        public decimal MonthlyCommOut { get; set; }
        public int? ReasonId { get; set; }
        public string Remarks { get; set; }
        public int CityId { get; set; }
        public bool IsPEP { get; set; }
        public DateTime LastStatusChangeDate { get; set; }
        public DateTime LastStatusChangeDateUtc { get; set; }
        public DateTime DisabledDate { get; set; }
        public DateTime DisabledDateUtc { get; set; }
        public string PersonType { get; set; }
        public string AlternativeAccountId { get; set; }
        public string VerifiedFirstName { get; set; }
        public string VerifiedMiddleName { get; set; }
        public string VerifiedFirstLastName { get; set; }
        public string VerifiedSecondLastName { get; set; }
        public string VerifiedGenre { get; set; }
        public string ConcurrencyStamp { get; set; }
        public DateTimeOffset LockoutEnd { get; set; }
        public string NormalizedEmail { get; set; }
        public string NormalizedUserName { get; set; }
        public int UserNumId { get; set; }
        public int PreactiveNotificationCounter { get; set; }
        public int RiskId { get; set; }
        public bool ForceChangePassword { get; set; }
        public string Email { get; set; }
    }
}
