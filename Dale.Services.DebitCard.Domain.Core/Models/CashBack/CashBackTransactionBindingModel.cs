using System;

namespace Dale.Services.DebitCard.Domain.Core.Models.CashBack
{
    public class CashBackTransactionBindingModel
    {
        public string UserId { get; set; }
        public string ApprovalId { get; set; }
        public int StatusId { get; set; }
        public string CategoryCode { get; set; }
        public string TypeCode { get; set; }
        public Decimal Amount { get; set; }
        public int BankBookId { get; set; }
        public decimal SenderFee { get; set; }
        public decimal RecieverFee { get; set; }
        public decimal SenderTax { get; set; }
        public decimal SenderGMF { get; set; }
        public decimal RecieverTax { get; set; }
        public decimal RecieverGMF { get; set; }
        public string TransactionCode { get; set; }
        public int TransactionTagType { get; set; }
        public DateTime TransactionTagDate { get; set; }
        public decimal IVAAmount { get; set; }
        public decimal GMFAmount { get; set; }
        public decimal FeeAmount { get; set; }
        public string ResultCode { get; set; }
        public DateTime ClientDate { get; set; }
        public int ProductTypeId { get; set; }
        public string TypeBankBook { get; set; }
        public int? ClientMetaDataId { get; set; }
        public bool Apply { get; set; }
        public int Percentage { get; set; }
    }
}
