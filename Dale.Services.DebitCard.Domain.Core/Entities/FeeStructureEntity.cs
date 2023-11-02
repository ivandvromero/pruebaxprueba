﻿namespace Dale.Services.DebitCard.Domain.Core.Entities
{
    public class FeeStructureEntity
    {
        public int Id { get; set; }
        public string UserId { get; set; }
        public float? CiBankAvalPersonaPercent { get; set; }
        public float? CiBankAvalCompanyPercent { get; set; }
        public int? CiBankAvalPersonaAmount { get; set; }
        public int? CiBankAvalCompanyAmount { get; set; }
        public int? CiBankAvalPersonaExemptTransactions { get; set; }
        public int? CiBankAvalCompanyExemptTransactions { get; set; }
        public float? CiBankNonAvalPersonaPercent { get; set; }
        public float? CiBankNonAvalCompanyPercent { get; set; }
        public int? CiBankNonAvalPersonaAmount { get; set; }
        public int? CiBankNonAvalCompanyAmount { get; set; }
        public int? CiBankNonAvalPersonaExemptTransactions { get; set; }
        public int? CiBankNonAvalCompanyExemptTransactions { get; set; }
        public float? CiCreditCardPersonaPercent { get; set; }
        public float? CiCreditCardCompanyPercent { get; set; }
        public int? CiCreditCardPersonaAmount { get; set; }
        public int? CiCreditCardCompanyAmount { get; set; }
        public int? CiCreditCardPersonaExemptTransactions { get; set; }
        public int? CiCreditCardCompanyExemptTransactions { get; set; }
        public float? CiPsePersonaPercent { get; set; }
        public float? CiPseCompanyPercent { get; set; }
        public int? CiPsePersonaAmount { get; set; }
        public int? CiPseCompanyAmount { get; set; }
        public int? CiPsePersonaExemptTransactions { get; set; }
        public int? CiPseCompanyExemptTransactions { get; set; }
        public float? CiBankingCorrespondantPersonaPercent { get; set; }
        public float? CiBankingCorrespondantCompanyPercent { get; set; }
        public int? CiBankingCorrespondantPersonaAmount { get; set; }
        public int? CiBankingCorrespondantCompanyAmount { get; set; }
        public int? CiBankingCorrespondantPersonaExemptTransactions { get; set; }
        public int? CiBankingCorrespondantCompanyExemptTransactions { get; set; }
        public float? CoBankAvalPersonaPercent { get; set; }
        public float? CoBankAvalCompanyPercent { get; set; }
        public int? CoBankAvalPersonaAmount { get; set; }
        public int? CoBankAvalCompanyAmount { get; set; }
        public int? CoBankAvalPersonaExemptTransactions { get; set; }
        public int? CoBankAvalCompanyExemptTransactions { get; set; }
        public float? CoBankNonAvalPersonaPercent { get; set; }
        public float? CoBankNonAvalCompanyPercent { get; set; }
        public int? CoBankNonAvalPersonaAmount { get; set; }
        public int? CoBankNonAvalCompanyAmount { get; set; }
        public int? CoBankNonAvalPersonaExemptTransactions { get; set; }
        public int? CoBankNonAvalCompanyExemptTransactions { get; set; }
        public float? CoAtmPersonaPercent { get; set; }
        public float? CoAtmCompanyPercent { get; set; }
        public int? CoAtmPersonaAmount { get; set; }
        public int? CoAtmCompanyAmount { get; set; }
        public int? CoAtmPersonaExemptTransactions { get; set; }
        public int? CoAtmCompanyExemptTransactions { get; set; }
        public float? CoBranchAdviserPersonaPercent { get; set; }
        public float? CoBranchAdviserCompanyPercent { get; set; }
        public int? CoBranchAdviserPersonaAmount { get; set; }
        public int? CoBranchAdviserCompanyAmount { get; set; }
        public int? CoBranchAdviserPersonaExemptTransactions { get; set; }
        public int? CoBranchAdviserCompanyExemptTransactions { get; set; }
        public float? CoTransferPersonaPercent { get; set; }
        public float? CoTransferCompanyPercent { get; set; }
        public int? CoTransferPersonaAmount { get; set; }
        public int? CoTransferCompanyAmount { get; set; }
        public int? CoTransferPersonaExemptTransactions { get; set; }
        public int? CoTransferCompanyExemptTransactions { get; set; }
        public float? PurchasePaymentBtnPersonaPercent { get; set; }
        public float? PurchasePaymentBtnCompanyPercent { get; set; }
        public int? PurchasePaymentBtnPersonaAmount { get; set; }
        public int? PurchasePaymentBtnCompanyAmount { get; set; }
        public int? PurchasePaymentBtnPersonaExemptTransactions { get; set; }
        public int? PurchasePaymentBtnCompanyExemptTransactions { get; set; }
        public float? DcCostDebitCardPersonaPercent { get; set; }
        public float? DcCostDebitCardCompanyPercent { get; set; }
        public int? DcCostDebitCardPersonaAmount { get; set; }
        public int? DcCostDebitCardCompanyAmount { get; set; }
        public int? DcCostDebitCardPersonaExemptTransactions { get; set; }
        public int? DcCostDebitCardCompanyExemptTransactions { get; set; }
        public float? DcTransactionDebitCardPersonaPercent { get; set; }
        public float? DcTransactionDebitCardCompanyPercent { get; set; }
        public int? DcTransactionDebitCardPersonaAmount { get; set; }
        public int? DcTransactionDebitCardCompanyAmount { get; set; }
        public int? DcTransactionDebitCardPersonaExemptTransactions { get; set; }
        public int? DcTransactionDebitCardCompanyExemptTransactions { get; set; }
        public float? DcIssuancePersonaPercent { get; set; }
        public float? DcIssuanceCompanyPercent { get; set; }
        public int? DcIssuancePersonaAmount { get; set; }
        public int? DcIssuanceCompanyAmount { get; set; }
        public int? DcIssuancePersonaExemptTransactions { get; set; }
        public int? DcIssuanceCompanyExemptTransactions { get; set; }
        public float? DcBlockAndReIssuePersonaPercent { get; set; }
        public float? DcBlockAndReIssueCompanyPercent { get; set; }
        public int? DcBlockAndReIssuePersonaAmount { get; set; }
        public int? DcBlockAndReIssueCompanyAmount { get; set; }
        public int? DcBlockAndReIssuePersonaExemptTransactions { get; set; }
        public int? DcBlockAndReIssueCompanyExemptTransactions { get; set; }
        public float? DcMonthlyFeePersonaPercent { get; set; }
        public float? DcMonthlyFeeCompanyPercent { get; set; }
        public int? DcMonthlyFeePersonaAmount { get; set; }
        public int? DcMonthlyFeeCompanyAmount { get; set; }
        public int? DcMonthlyFeePersonaExemptTransactions { get; set; }
        public int? DcMonthlyFeeCompanyExemptTransactions { get; set; }
        public float? DcCoATHAtmPersonaPercent { get; set; }
        public float? DcCoATHAtmCompanyPercent { get; set; }
        public int? DcCoATHAtmPersonaAmount { get; set; }
        public int? DcCoATHAtmCompanyAmount { get; set; }
        public int? DcCoATHAtmPersonaExemptTransactions { get; set; }
        public int? DcCoATHAtmCompanyExemptTransactions { get; set; }
        public float? DcCoOtherAtmPersonaPercent { get; set; }
        public float? DcCoOtherAtmCompanyPercent { get; set; }
        public int? DcCoOtherAtmPersonaAmount { get; set; }
        public int? DcCoOtherAtmCompanyAmount { get; set; }
        public int? DcCoOtherAtmPersonaExemptTransactions { get; set; }
        public int? DcCoOtherAtmCompanyExemptTransactions { get; set; }
        public float? DcCoInternationalAtmPersonaPercent { get; set; }
        public float? DcCoInternationalAtmCompanyPercent { get; set; }
        public int? DcCoInternationalAtmPersonaAmount { get; set; }
        public int? DcCoInternationalAtmCompanyAmount { get; set; }
        public int? DcCoInternationalAtmPersonaExemptTransactions { get; set; }
        public int? DcCoInternationalAtmCompanyExemptTransactions { get; set; }
        public float? DcUberPersonaPercent { get; set; }
        public float? DcUberCompanyPercent { get; set; }
        public int? DcUberPersonaAmount { get; set; }
        public int? DcUberCompanyAmount { get; set; }
        public int? DcUberPersonaExemptTransactions { get; set; }
        public int? DcUberCompanyExemptTransactions { get; set; }
        public float? DcMoneyOrderPersonaPercent { get; set; }
        public float? DcMoneyOrderCompanyPercent { get; set; }
        public int? DcMoneyOrderPersonaAmount { get; set; }
        public int? DcMoneyOrderCompanyAmount { get; set; }
        public int? DcMoneyOrderPersonaExemptTransactions { get; set; }
        public int? DcMoneyOrderCompanyExemptTransactions { get; set; }
        public float? DcTransfiYaPersonaPercent { get; set; }
        public float? DcTransfiYaCompanyPercent { get; set; }
        public int? DcTransfiYaPersonaAmount { get; set; }
        public int? DcTransfiYaCompanyAmount { get; set; }
        public int? DcTransfiYaPersonaExemptTransactions { get; set; }
        public int? DcTransfiYaCompanyExemptTransactions { get; set; }
        public float? CiBankAvalMassiveTransactionPersonaPercent { get; set; }
        public float? CiBankAvalMassiveTransactionCompanyPercent { get; set; }
        public int? CiBankAvalMassiveTransactionPersonaAmount { get; set; }
        public int? CiBankAvalMassiveTransactionCompanyAmount { get; set; }
        public int? CiBankAvalMassivePersonaExemptTransactions { get; set; }
        public int? CiBankAvalMassiveCompanyExemptTransactions { get; set; }
        public float? CiCollectionAgreementPersonaPercent { get; set; }
        public float? CiCollectionAgreementCompanyPercent { get; set; }
        public int? CiCollectionAgreementPersonaAmount { get; set; }
        public int? CiCollectionAgreementCompanyAmount { get; set; }
        public int? CiCollectionAgreementPersonaExemptTransactions { get; set; }
        public int? CiCollectionAgreementCompanyExemptTransactions { get; set; }
        public float? CoBankingCorrespondantPersonaPercent { get; set; }
        public float? CoBankingCorrespondantCompanyPercent { get; set; }
        public int? CoBankingCorrespondantPersonaAmount { get; set; }
        public int? CoBankingCorrespondantCompanyAmount { get; set; }
        public int? CoBankingCorrespondantPersonaExemptTransactions { get; set; }
        public int? CoBankingCorrespondantCompanyExemptTransactions { get; set; }
        public float? CiQREntreCuentasPropiasTransactionPersonaPercent { get; set; }
        public float? CiQREntreCuentasPropiasTransactionCompanyPercent { get; set; }
        public int? CiQREntreCuentasPropiasTransactionPersonaAmount { get; set; }
        public int? CiQREntreCuentasPropiasTransactionCompanyAmount { get; set; }
        public int? CiQREntreCuentasPropiasPersonaExemptTransactions { get; set; }
        public int? CiQREntreCuentasPropiasCompanyExemptTransactions { get; set; }
        public float? CiQREntreCuentasInterAvalTransactionPersonaPercent { get; set; }
        public float? CiQREntreCuentasInterAvalTransactionCompanyPercent { get; set; }
        public int? CiQREntreCuentasInterAvalTransactionPersonaAmount { get; set; }
        public int? CiQREntreCuentasInterAvalTransactionCompanyAmount { get; set; }
        public int? CiQREntreCuentasInterAvalPersonaExemptTransactions { get; set; }
        public int? CiQREntreCuentasInterAvalCompanyExemptTransactions { get; set; }
        public float? CiQREntreCuentasInterOperablesTransactionPersonaPercent { get; set; }
        public float? CiQREntreCuentasInterOperablesTransactionCompanyPercent { get; set; }
        public int? CiQREntreCuentasInterOperablesTransactionPersonaAmount { get; set; }
        public int? CiQREntreCuentasInterOperablesTransactionCompanyAmount { get; set; }
        public int? CiQREntreCuentasInterOperablesPersonaExemptTransactions { get; set; }
        public int? CiQREntreCuentasInterOperablesCompanyExemptTransactions { get; set; }
        public float? CoQREntreCuentasPropiasTransactionPersonaPercent { get; set; }
        public float? CoQREntreCuentasPropiasTransactionCompanyPercent { get; set; }
        public int? CoQREntreCuentasPropiasTransactionPersonaAmount { get; set; }
        public int? CoQREntreCuentasPropiasTransactionCompanyAmount { get; set; }
        public int? CoQREntreCuentasPropiasPersonaExemptTransactions { get; set; }
        public int? CoQREntreCuentasPropiasCompanyExemptTransactions { get; set; }
        public float? CoQREntreCuentasInterAvalTransactionPersonaPercent { get; set; }
        public float? CoQREntreCuentasInterAvalTransactionCompanyPercent { get; set; }
        public int? CoQREntreCuentasInterAvalTransactionPersonaAmount { get; set; }
        public int? CoQREntreCuentasInterAvalTransactionCompanyAmount { get; set; }
        public int? CoQREntreCuentasInterAvalPersonaExemptTransactions { get; set; }
        public int? CoQREntreCuentasInterAvalCompanyExemptTransactions { get; set; }
        public float? CoQREntreCuentasInterOperablesTransactionPersonaPercent { get; set; }
        public float? CoQREntreCuentasInterOperablesTransactionCompanyPercent { get; set; }
        public int? CoQREntreCuentasInterOperablesTransactionPersonaAmount { get; set; }
        public int? CoQREntreCuentasInterOperablesTransactionCompanyAmount { get; set; }
        public int? CoQREntreCuentasInterOperablesPersonaExemptTransactions { get; set; }
        public int? CoQREntreCuentasInterOperablesCompanyExemptTransactions { get; set; }
        public float? ComQREntreCuentasPropiasTransactionPersonaPercent { get; set; }
        public float? ComQREntreCuentasPropiasTransactionCompanyPercent { get; set; }
        public int? ComQREntreCuentasPropiasTransactionPersonaAmount { get; set; }
        public int? ComQREntreCuentasPropiasTransactionCompanyAmount { get; set; }
        public int? ComQREntreCuentasPropiasPersonaExemptTransactions { get; set; }
        public int? ComQREntreCuentasPropiasCompanyExemptTransactions { get; set; }
        public float? ComQREntreCuentasInterAvalTransactionPersonaPercent { get; set; }
        public float? ComQREntreCuentasInterAvalTransactionCompanyPercent { get; set; }
        public int? ComQREntreCuentasInterAvalTransactionPersonaAmount { get; set; }
        public int? ComQREntreCuentasInterAvalTransactionCompanyAmount { get; set; }
        public int? ComQREntreCuentasInterAvalPersonaExemptTransactions { get; set; }
        public int? ComQREntreCuentasInterAvalCompanyExemptTransactions { get; set; }
        public float? ComQREntreCuentasInterOperablesTransactionPersonaPercent { get; set; }
        public float? ComQREntreCuentasInterOperablesTransactionCompanyPercent { get; set; }
        public int? ComQREntreCuentasInterOperablesTransactionPersonaAmount { get; set; }
        public int? ComQREntreCuentasInterOperablesTransactionCompanyAmount { get; set; }
        public int? ComQREntreCuentasInterOperablesPersonaExemptTransactions { get; set; }
        public int? ComQREntreCuentasInterOperablesCompanyExemptTransactions { get; set; }
        public int? SentFundsDays { get; set; }
        public bool IsDefaultAgreement { get; set; }
        public int? AgreementId { get; set; }
        public int? CoPaymentPspAgreementsReloadsPersonaAmount { get; set; }
        public float? CoPaymentPspAgreementsReloadsPersonaPercent { get; set; }
        public int? CoPaymentPspAgreementsReloadsPersonaExemptTransactions { get; set; }
        public int? CoPaymentPspAgreementsReloadsCompanyAmount { get; set; }
        public float? CoPaymentPspAgreementsReloadsCompanyPercent { get; set; }
        public int? CoPaymentPspAgreementsReloadsCompanyExemptTransactions { get; set; }
    }
}