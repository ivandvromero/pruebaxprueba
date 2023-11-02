using System;

namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class TransactionEntity
    {
        public int Id { get; set; }
        public DateTime Date { get; set; }
        public DateTime DateUtc { get; set; }
        public string UserId { get; set; }
        public int TypeId { get; set; }
        public string Platform { get; set; }
        public bool? IsBlocked { get; set; }
        public bool? IsFraud { get; set; }
        public bool? IsRecieverDespute { get; set; }
        public bool? IsExceeded { get; set; }
        public bool IsRefunded { get; set; }
        //Only for ATM withdrawal
        public Guid? MachineSecret { get; set; }
        public string ToUserId { get; set; }
        public string ApprovalId { get; set; }
        public string ResultCode { get; set; }
        public string PmtId { get; set; }
        public int? UserSessionId { get; set; }
        public int StatusId { get; set; }
        public string StatusDesc { get; set; }
        public int IsMonitored { get; set; }
    }
}
