using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class AgreementEntity
    {
        public int Id { get; set; } 
        public string AgreementNumber { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime CreatedAtUtc { get; set; }
        public DateTime UpdatedAt { get; set; }
        public DateTime UpdatedAtUtc { get; set; }
        public DateTime EffectiveFromDate { get; set; }
        public DateTime EffectiveFromDateUtc { get; set; }
        public DateTime EffectiveToDate { get; set; }
        public DateTime EffectiveToDateUtc { get; set; }
        public bool? SendEmail { get; set; }
        public string SpecialCode { get; set; }
        public double QuarterlyAverageAccountBalance { get; set; }
        public double QuarterlyAverageDispersionTransactions { get; set; }
        public double QuarterlyAverageCollection { get; set; }
        public double QuarterlyAveragePnAccount { get; set; }
        public double QuarterlyAverageElectronicDeposits { get; set; }
        public double QuarterlyAverageDebitCards { get; set; }
        public bool IsTradeExist { get; set; }
        public string ProgramId { get; set; }
        public int? DebitCardType { get; set; }
        public int? AllyPartnerId { get; set; }
        public int? CompanyId { get; set; }
        public int TypeId { get; set; }
        public int StatusId { get; set; }
    }
}
