namespace Dale.Services.DebitCard.Domain.Core.Constans
{
    public class Enums
    {
        public enum StatusTypes
        {
            ScheduledTransactionStatus = 1,
            UserStatus = 2,
            TransactionStatus = 3,
            MerchantRegisterRequestStatus = 4,
            TransferApiStatus = 5,
            DebitcardStatus = 6,
            AgreementStatus = 7,
            DispersionStatus = 8,
            NotificationStatus = 9,
            ClientWithoutElectronicDepositStatus = 10,
            UserAgreementStatus = 11,
            HoldStatuses = 12,
            ParameterStatus = 13,
            CashBackDetails = 14,
            CashBackTransactions = 15,
            MerchantEmployeeStatus = 16,
            CollectionAgreementStatus = 17,
            MassiveInteravalReverseStatus = 19,
            UserPoliticallyExposed = 20,
            PurchaseQRStatus = 21,
            TransferOfFundsToAvalAccounts = 22
        }

        public enum ApplicationUserStatus
        {
            Preactive,
            Active,
            Inactive,
            Canceled,
            Frozen,
            Blocked,
            NotLinked
        }

        public enum TransactionStatus
        {
            Pending,
            Success,
            Failed,
            Expired,
            Rejected,
            Canceled,
            PendingValidationPse,
            ApprovedDebit,
            Validated
        }

        public enum UserAgreementStatus
        {
            Assigned,
            Active,
            Inactive,
            Removed
        }

        public enum CashBackTransactionStatus
        {
            FailureForNoUber,
            FailureForDEInactive,
            FailureForLimit,
            Process,
            Failure,
            FailureForNoBenefits,
            FailureForNoSelectedUber,
            NoProcess,
            FailureForNoCategory
        }
        public struct CategoryTransactions
        {
            public const string AddingFunds = "01";
            public const string Transfer = "02";
            public const string WithDrawal = "03";
            public const string AtmCostQuery = "04";
            public const string MonetaryAdjustment = "05";
            public const string Reversal = "06";
            public const string Novelty = "07";
            //Do not use this yet, for avoid confusion with Transfer(Payment)
            public const string Purchase = "08";
            public const string Others = "09";
            public const string AtmCostQueryWithdrawals = "10";
            public const string CreditEnablements = "13";
            //Create for trnsaction queries but this transaction category does not exists yet
            public const string DebitCard = "99";
        }

        public struct TypeTransactions
        {
            public const string AddingFunds_CreditCardToK7 = "001";
            public const string AddingFunds_AvalAccountToK7 = "002";
            public const string AddingFunds_PSEToK7 = "003";
            public const string AddingFunds_BankCorrespondent = "004";
            public const string AddingFunds_TransfiYa = "005";
            public const string AddingFunds_Micropayment = "006";

            public const string Transfer_K7_Payment = "001";
            public const string Transfer_K7_Charge = "002";
            public const string Transfer_DispersionOfFunds = "003";
            public const string Transfer_DispersionOfFunds_ByFile = "005";
            public const string Transfer_QR_Payment = "006";
            public const string Transfer_TransfiYa = "007";
            public const string Transfer_DepositByBankAval = "008";
            public const string Transfer_CollectionAgreement = "009";
            public const string Transfer_TransfiYa_Charge = "010";
            public const string Transfer_OctCardToCard = "011";

            //DPE-218. This group belong to Types with CategoryId=3. All types in this enum, should be grouped by Category but it's not.
            public const string WithDrawal_ATM = "001";
            public const string WithDrawal_ATM_Transfer = "002";
            public const string WithDrawal_OTP_BankCorrespondent = "003";
            public const string WithDrawal_TransferToAvalAccount = "070";
            public const string WithDrawal_Debit_Paying_Customer_PSP = "071"; //DPE-218. is like Cashout. Previous Type 001 with category=11 created to PSP

            public const string AtmCostQuery_ATM = "001";

            //DPE-218. This group belongs to Types with CategoryId=3. All types in this enum, should be exists & grouped by Category but it's not.
            public const string MonetaryAdjustment_DebitByCashInFromAval = "001";
            public const string MonetaryAdjustment_DebitByTransfer = "002";
            public const string MonetaryAdjustment_DebitBywithdrawATMWithCode = "003";
            public const string MonetaryAdjustment_CreditByCashInWithAvalToK7 = "004";
            public const string MonetaryAdjustment_CreditByCashInWithCreditCardToK7 = "005";
            public const string MonetaryAdjustment_CreditByCashInFromK7 = "006";
            public const string MonetaryAdjustment_DebitByPaymentButton = "007";
            public const string MonetaryAdjustment_CreditByPaymentButton = "008";
            public const string MonetaryAdjustment_CreditByCashInWithAval = "009";
            public const string MonetaryAdjustment_DebitByDispersionOfFunds = "010";
            public const string MonetaryAdjustment_CreditByDispersionOfFunds = "011";
            public const string MonetaryAdjustment_CreditByBankCorrespondents = "012";
            public const string MonetaryAdjustment_CreditDispersePerFile = "013";
            public const string MonetaryAdjustment_CreditBytQR = "014";
            public const string MonetaryAdjustment_DebitByQR = "015";
            //public const string MonetaryAdjustment_ = "016"; ... 016 code is there in the db but not added here by developer. So change the name here when required.
            public const string MonetaryAdjustment_CreditByTransfiYa = "017";
            public const string MonetaryAdjustment_DebitByTransfiYa = "018";
            public const string MonetaryAdjustment_CreditByMicropayment = "019";
            //public const string MonetaryAdjustment_ = "020"; ... 020 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "021"; ... 021 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "022"; ... 022 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "023"; ... 023 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "024"; ... 024 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "025"; ... 025 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "026"; ... 026 code is there in the db but not added here by developer. So change the name here when required.
            //public const string MonetaryAdjustment_ = "027"; ... 027 code is there in the db but not added here by developer. So change the name here when required.
            public const string MonetaryAdjustment_CreditByAdjustmentDispersionOfFund = "028";
            public const string MonetaryAdjustment_CreditByCollectionAgreement = "029";
            public const string MonetaryAdjustment_DebitByCollectionAgreement = "030";
            public const string MonetaryAdjustment_TransferOctCardToCard = "031";
            public const string MonetaryAdjustment_PurcharsePSE = "032";
            public const string MonetaryAdjustment_WithDrawal_OTP_BankCorrespondent = "054";
            public const string MonetaryAdjustment_DebtAdjustmentForTransferOfFundsToGuaranteeAccount = "072";
            //DPE-218. MonetaryAdjustment_ = "073" Exists in the db,  but not added here by developer. So must be active it when required.
            public const string MonetaryAdjustment_To_Debit_Paying_Customer_PSP = "074";  //DPE-218. Adjustment to PSP Payment (Servicios Públicos)

            //DPE-218. This group belongs to Types with CategoryId=6. All DB types for this enum, should be exists & grouped by Category but it's not.
            public const string Reversal_ChargeByWithdrawalATMWithCode = "001";
            public const string Reversal_ChargeByWithdrawalAval = "002";
            public const string Reversal_ChargeByTransferToK7 = "003";
            public const string Reversal_CashInFromAvalToK7 = "004";
            public const string Reversal_CashInFromCreditCardToK7 = "005";
            public const string Reversal_CashInFromK7 = "006";
            public const string Reversal_DebitByPaymentButton = "007";
            public const string Reversal_CreditByPaymentButton = "008";
            public const string Reversal_CreditByCashInWithAval = "009";
            public const string Reversal_DebitByDispersionOfFunds = "010";
            public const string Reversal_CreditByDispersionOfFunds = "011";
            public const string Reversal_AddingFundsByBankCorrespondents = "012";
            public const string Reversal_DebitDispersePerFile = "013";
            public const string Reversal_DebitByQR = "014";
            public const string Reversal_CreditByQR = "015";
            public const string Reversal_ChargeByWithdrawalATMWithDC = "016";
            public const string Reversal_ChargeByWithdrawalATMNoAvalWithDC = "017";
            public const string Reversal_ChargeByWithdrawalATMInternationalWithDC = "018";
            public const string Reversal_PurchasePresentialDebitCard = "019";
            public const string Reversal_PurchaseNoPresentialDebitCard = "020";
            public const string Reversal_PurchasePresentialDebitCardInternational = "021";
            public const string Reversal_PurchaseNoPresentialDebitCardInternational = "022";
            public const string Reversal_ATMTransfer = "023";
            public const string Reversal_DebitByTransfiYa = "024";
            public const string Reversal_CreditByTransfiYa = "025";
            public const string Reversal_PurchaseRetractDebitFromMerchant = "026";
            public const string Reversal_PurchaseRetractCreditToClient = "027";
            public const string Reversal_AutomaticPurchaseRetractDebitFromMerchant = "028";
            public const string Reversal_AutomaticPurchaseRetractCreditToClient = "029";
            //public const string Reversal_ = "030"; ... 030 code is there in the db but not added here by developer. So change the name here when required.
            public const string Reversal_DebitByMicropayment = "031";
            public const string Reversal_IssueDebitCard = "032";
            public const string Reversal_ReissueDebitCard = "033";
            public const string Reversal_DispersionOfFund = "034";
            public const string Reversal_DebitByCollectionAgreement = "035";
            public const string Reversal_CreditByCollectionAgreement = "036";
            public const string Reversal_TransferOctCardToCard = "037";
            public const string Reversal_PurcharsePSE = "038";
            public const string Reversal_IVA = "039";
            public const string Reversal_GMF = "040";
            public const string Reversal_CommissionWithDrawalATM = "041";
            public const string Reversal_CommissionenWithDrawalBankingCorrespondat = "042";
            public const string Reversal_CommissionTransferAvalAccounts = "043";
            public const string Reversal_CommissionTransferNoAvalAccounts = "044";
            public const string Reversal_CommissionTransferIntrasolucion = "045";
            public const string Reversal_CommissionDispersionFunds = "046";
            public const string Reversal_CommissionPaymentButton = "047";
            public const string Reversal_CommissionWithDrawalDCATMAval = "048";
            public const string Reversal_CommissionWithDrawalDCATMNoAval = "049";
            public const string Reversal_CommissionWithDrawalDCATMInternational = "050";
            public const string Reversal_CommissionQR = "051";
            public const string Reversal_WithDrawal_OTP_BankCorrespondent = "057";
            public const string Reversal_ReversalForTransferOfFundsToAval = "073";
            public const string Reversal_RefundPresentialDebitCard = "074";
            public const string Reversal_RefundNoPresentialDebitCard = "075";
            public const string Reversal_RefundPresentialDebitCardInternational = "076";
            public const string Reversal_RefundNoPresentialDebitCardInternational = "077";
            //DPE-218. Reversal_ = "078" Exists in the db,  but not added here by developer. So must be active it when required.
            public const string Reversal_To_Debit_Paying_Customer_PSP = "079"; //DPE-218. Reversal to PSP Payment (Servicios Públicos)

            public const string Novelty_StatusChange = "001";

            public const string Purchase_PaymentButton = "001";
            public const string Purchase_PaymentButtonRefund = "002";
            public const string Purchase_RecipientTransfer = "003";
            public const string Purchase_DebitTransfer = "004";
            public const string Purchase_PresentialDebitCard = "005";
            public const string Purchase_NoPresentialDebitCard = "006";
            public const string Purchase_PresentialDebitCardInternational = "007";
            public const string Purchase_NoPresentialDebitCardInternational = "008";
            public const string Purchase_PSE = "009";
            public const string Purchase_PaymentsByPSE = "009";

            public const string Others_IssueDebitCard = "001";
            public const string Others_ReissueDebitCard = "002";
            public const string Others_ReissueDebitCardForFraud = "003";
            public const string Others_DrivingFee = "004";
            //public const string Others_ = "005"; ... 005 code is there in the db but not added here by developer. So change the name here when required.
            public const string Others_ATM = "006";
            public const string Others_ATMOthersDebitCard = "007";
            public const string Others_InternationalDebitCard = "008";
            public const string Others_AgreementBenefits = "009";
            public const string Others_ReversalAgreementBenefits = "010";
            public const string Others_CashBack = "011";
            public const string Others_RefundPresentialDebitCard = "012";
            public const string Others_RefundNoPresentialDebitCard = "013";
            public const string Others_RefundPresentialDebitCardInternational = "014";
            public const string Others_RefundNoPresentialDebitCardInternational = "015";
            public const string Others_HandlingFeeLMPay = "016";
            public const string Others_HandlingFeeWaloPay = "087";

            public const string AtmCostQueryWithdrawals_ATM = "001";
            public const string AtmCostQueryWithdrawals_ATMNoAVAL = "002";
            public const string AtmCostQueryWithdrawals_ATMInternational = "003";

            public const string CreditEnablements_CreditEnablement = "001";

            //dpe-157 pendiente informar que no diferencia reverses cashin de cashout
            #region DPE-QR
            public const string Accredit_Transaction_EPD_Collecting_Customer_Internal_Transactions = "058"; //cashin
            public const string Debit_Transaction_EPD_Paying_Customer_Internal_Transactions = "059";
            public const string Adjustment_Debit_Commerce_EPD_Internal_Transactions = "060";
            public const string Adjustment_Credit_Commerce_EPD_Internal_Transactions = "061";
            public const string Reversal_With_Debit_Electronic_Deposit_EPD_Internal_Transactions = "062";

            public const string Accredit_Transaction_EPD_Collecting_Customer_Inter_Aval = "063";  //cashin InterAval
            public const string Debit_Transaction_EPD_Paying_Customer_Inter_Aval = "064"; //cashout
            public const string Adjustment_Debit_Commerce_EPD_Inter_Aval = "065";
            public const string Adjustment_Credit_Commerce_EPD_Inter_Aval = "066";
            public const string Reversal_With_Debit_Electronic_Deposit_EPD_Inter_Aval = "067";

            public const string Accredit_Transaction_EPD_Collecting_Customer_Interoperable_Transactions = "068";  //Cashin interoperable
            public const string Debit_Transaction_EPD_Paying_Customer_Interoperable_Transactions = "069"; //cashout
            public const string Adjustment_Debit_Commerce_EPD_Interoperable_Transactions = "070";
            public const string Adjustment_Credit_Commerce_EPD_Interoperable_Transactions = "071";
            public const string Reversal_With_Debit_Electronic_Deposit_EPD_Interoperable_Transactions = "072";
            #endregion

        }

        public enum DebitCardStatus
        {
            Generated = 0,
            Assigned,
            Active,
            Blocked,
            Cancelled,
            BlockByEmbossing,
            Unblock
        }

        public enum TransactionTaggingType
        {

            CashInAval = 0,
            ReverseCashInAval = 1,
            CashInCreditCard = 2,
            CashInCreditCardNoGuarantee = 3,
            CashInNonAvalPSE = 4,
            ReverseCashInNonAvalPSE = 5,
            CashOutAval = 6,
            ReverseCashOutAval = 7,
            CashOutNonAval = 8,
            ReverseCashOutNonAval = 9,
            CashOutAtm = 10,
            IntraSolution = 11,
            IntrasolutionCredit = 12,
            IntrasolutionWithCreditToBank = 13,
            IntrasolutionDebit = 14,
            IntrasolutionPurchase = 15,
            IntrasolutionSalesCredit = 16,
            IntrasolutionPurchaseDebit = 17,
            IntrasolutionPurchaseWithCreditToBank = 18,
            SenderGMF = 19,
            RecieverGMF = 20,
            SenderFee = 21,
            RecieverFee = 22,
            SenderIVA = 23,
            RecieverIVA = 24,
            ReverseCashoutAtm = 25,
            IntrasolutionDebitReverse = 26,
            DebitAdjustment = 27,
            CreditAdjustment = 28,
            AdjustmentFee = 29,
            AdjustmentGMF = 30,
            AdjustmentIVA = 31,
            StateChangeActiveToInactive = 32,
            StateChangeActiveToDisabled = 33,
            StateChangeInactiveToCanceled = 34,
            StateChangeInactiveToActive = 35,
            StateChangeFrozenToCanceled = 36,
            StateChangeBlockedToCanceled = 37,
            PaymentButton = 38,
            PaymentButtonCredit = 39,
            PaymentButtonDebit = 40,
            DispersionOfFundsDebit = 41,
            DispersionOfFundsCredit = 42,
            PaymentButtonCreditReverse = 43,
            CashInBankCorrespondant = 44,
            PaymentButtonDebitReverse = 45,
            PurchaseNoPresentialDebitCard = 46,
            IntrasolutionQRCustomerToCustomer = 47,
            IntrasolutionQRDebit = 48,
            IntrasolutionQRCredit = 49,
            CashInBankCorrespondantReverse = 50,
            WithdrawalDebitCardATM = 51,
            ReverseWithdrawalDebitCardATM = 52,
            DebitCardIssuance = 53,
            DebitCardReIssuance = 54,
            DebitCardHandlingFee = 55,
            CashOutAtmTransfered = 56,
            ReverseCashoutAtmTransfered = 57,
            WithdrawalDebitCardATMNoAVAL = 58,
            ReverseWithdrawalDebitCardATMNoAVAL = 59,
            WithdrawalDebitCardATMInternational = 60,
            ReverseWithdrawalDebitCardATMInternational = 61,
            PurchasePOS = 62,
            ReversePurchasePOS = 63,
            PurchasePOSInternational = 64,
            ReversePurchasePOSInternational = 65,
            PurchaseEcommerce = 66,
            ReversePurchaseEcommerce = 67,
            PurchaseEcommerceInternational = 68,
            ReversePurchaseEcommerceInternational = 69,
            StateChangeActiveToFrozen = 70,
            StateChangeActiveToCanceled = 71,
            ReverseDebitCardIssuance = 72,
            ReverseDebitCardReIssuance = 73,
            CostDebitCardATM = 74,
            CostDebitCardATMNoAVAL = 75,
            CostDebitCardATMInternational = 76,
            CostDebitCardPurchase = 77,
            DebitCardHandlingFeeReverse = 78,
            AgreementBenefits = 79,
            ReverseAgreementBenefits = 80,
            DispersionOfFundsWithoutElectronicDeposit = 81,
            TransfiYA = 82,
            TransfiYADebit = 83,
            TransfiYACredit = 84,
            DispersionReverseWithoutElectronicDeposit = 85,
            DispersionAdjustmentWithoutElectronicDeposit = 86,
            PurchaseRetractDebit = 87,
            PurchaseRetractCredit = 88,
            CashbackUberdriver = 89,
            CashbackUberdriverReverse = 90,
            TransfiYAReverseDebit = 91,
            TransfiYAReverseCredit = 92,
            MicroPaymentCredit = 93,
            MicroPaymentReverseCredit = 94,
            MicroPaymentReverseDebit = 95,
            IntrasolutionQRCustomerToMerchant = 96,
            IntrasolutionQRMerchantToCustomer = 97,
            IntrasolutionQRMerchantToMerchant = 98,
            CashInAvalMassiveTransaction = 99,
            TransferOctCardToCard = 100,
            ReverseTransferOctCardToCard = 101,
            ReverseCashInAvalMassiveTransaction = 102,
            PaymentPseAuthorize = 103,
            ReversePaymentPseAuthorize = 104,
            RefundPOS = 105,
            RefundPOSInternational = 106,
            RefundEcommerce = 107,
            RefundEcommerceInternational = 108,
            CashOutCB = 109,
            ReverseCashOutCB = 110,
            DebitCardIssuanceLifeMiles = 111,
            DebitCardReIssuanceLifeMiles = 112,
            ReverseDebitCardIssuanceLifeMiles = 113,
            PaymentGMF = 114,
            PaymentIVA = 115,
            ReverseGMF = 116,
            ReverseIVA = 117,
            WithdrawalCashInBankCorrespondantWithElectronicDeposit = 118,
            WithdrawalCashInBankCorrespondantWithElectronicDepositReverse = 119,
            TransferAccountAvalWithElectronicDeposit = 120,
            TransferAccountAvalWithElectronicDepositReverse = 121,
            TransferAccountNoAvalWithElectronicDeposit = 122,
            TransferAccountNoAvalWithElectronicDepositReverse = 123,
            TransferIntrasolutionWithElectronicDeposit = 124,
            TransferIntrasolutionWithElectronicDepositReverse = 125,
            DispersionOfFundsWithElectronicDeposit = 126,
            DispersionOfFundsWithElectronicDepositReverse = 127,
            PaymentButtonWithElectronicDeposit = 128,
            PaymentButtonWithElectronicDepositReverse = 129,
            WithdrawalDebitCardATMAVAL = 130,
            WithdrawalDebitCardATMAVALReverse = 131,
            HandlingFeeDebitCardWithElectronicDeposit = 132,
            AdjustmentHandlingFeeDebitCardWithElectronicDeposit = 133,
            QRCode = 134,
            QRCodeReverse = 135,
            SubscriptionBenefitsCovenants = 136,
            ReverseSubscriptionBenefitsCovenants = 137,
            BankDrafts = 138,
            BankDraftsReverse = 139,
            TransfiYAReverse = 140,
            ReferencedCollectionWithElectronicDeposit = 141,
            ReferencedCollectionWithElectronicDepositReverse = 142,
            ButtonPSE = 143,
            ButtonPSEReverse = 144,
            WithdrawalDebitCardATMLifeMiles = 145,
            WithdrawalDebitCardATMNoAVALLifeMiles = 146,
            WithdrawalDebitCardATMInternationalLifeMiles = 147,
            ReverseWithdrawalDebitCardATMNoAVALLifeMiles = 148,
            ReverseWithdrawalDebitCardATMInternationalLifeMiles = 149,
            ReverseWithdrawalDebitCardATMLifeMiles = 150,

            #region DPE QR Between Accounts
            #region CashIn InterAval
            ReverseWithDebitElectronicDepositEPDInterAval = 151,
            CashInTransactionBetweenAccountsInterAval = 152,
            AdjustmentTransactionCreditBetweenAccountsInterAval = 153,
            #endregion
            #region CashOut InterAval
            CashOutTransactionBetweenAccountsInterAval = 154,
            AdjustmentTransactionDebitBetweenAccountsInterAval = 155,
            ReverseWithDebitElectronicDepositEPDCashOutInterAval = 156,
            #endregion
            #region CashIn Date! a Dale!
            CashinTransactionBetweenAccountsdaletodale = 157,
            AdjustmentCreditTransactionBetweenAccountsdaletodale = 158,
            ReverseWithCreditElectronicDepositEPDCashIndaletodale = 159,
            #endregion
            #region CashOut Date! a Dale!
            CashOutTransactionBetweenAccountsdaletodale = 160,
            AdjustmentDebitTransactionBetweenAccountsdaletodale = 161,
            ReverseWithDebitElectronicDepositEPDCashOutdaletodale = 162,
            #endregion
            #region CashIn InterOp
            CashinTransactionBetweenAccountsInterOp = 163,
            AdjustmentCreditTransactionBetweenAccountsInterOp = 164,
            ReverseWithCreditElectronicDepositEPDCashInInterOp = 165,
            #endregion
            #region CashOut InterOp
            CashOutTransactionBetweenAccountsInterOp = 174,   //DPE-157. Corregido (se usaban los mismos de cashin 163,164,165)
            AdjustmentDebitTransactionBetweenAccountsInterOp = 175,
            ReverseWithDebitElectronicDepositEPDCashOutInterOp = 176,
            #endregion
            #endregion

            #region Reverse of return
            ReverseOfRefundFaceToFacePurchaseWithDCToMerchantByDataphone = 166, // COU0013RD
            ReverseOfRefundOfaNonFaceToFacePurchaseWithDCToECommerceBusiness = 167,  // COU0012RD
            ReverseOfRefundFaceToFacePurchaseWithDCToInternationalBusinessByDataphone = 168, // COU0016RD
            ReverseOfRefundNonFaceToFacePurchaseWithDCToBusinessByInternationalECommerce = 169, // COU0022RD

            ReverseOfRefundFaceToFacePurchaseWithDCToMerchantByDataphoneLifeMiles = 170, // COU0029RD
            ReverseOfRefundOfaNonFaceToFacePurchaseWithDCToECommerceBusinessLifeMiles = 171, // COU0028RD
            ReverseOfRefundFaceToFacePurchaseWithDCToInternationalBusinessByDataphoneLifeMiles = 172, // COU0031RD
            ReverseOfRefundNonFaceToFacePurchaseWithDCToBusinessByInternationalECommerceLifeMiles = 173, // COU0032RD

            //El siguiente a usar debe ser el 177 (174 es cashout interop)
            #endregion
            IncentivesPaymentElectronicDeposit = 174, //CIN0025
            AdjustmentCreditIncentivesPaymentElectronicDeposit = 175,//CIN0025A
            ReverseCreditIncentivesPaymentElectronicDeposit = 176,//CIN0025R
            TransferDispersalDPSSubsidiesPaymentElectronicDeposit = 177,//CIN0026
            AdjustmentCreditTransferDispersalDPSSubsidiesPaymentElectronicDeposit = 178,//CIN0026A
            ReverseTransferDispersalDPSSubsidiesPaymentElectronicDeposit = 179,//CIN0026R
            DebitCardLMHandlingFee = 180,
            AdjustmentDebitCardLMHandlingFee = 181,
            DebitCardLMHandlingFeeReverse = 182,
            CashBackUber = 183,
            DebitCardWaloHandlingFee = 194,
        }

        public enum Gender
        {
            Male,
            Female
        }

        public enum TransactionKind
        {
            Credit,
            Debit
        }

        public struct TransactionCodes
        {
            public const string HandlingFeeLM = "COM0024";
            public const string HandlingFeeWalo = "COM0030";
            public const string CashBackUber = "CIN0012";
        }

        public struct AthErrorCode
        {
            public const string ATM_TRANSACCION_EXITOSA = "";
            public const string ATM_TRANSACCION_DECLINADA_CUENTA_ORIGEN_BLOQUEADA = "0002";
            public const string ATM_TRANSACCION_DECLINADA_INCONVENIENTES_TECNICOS = "0003";
            public const string ATM_CANTIDAD_EXCEDE_MONTO_MAXIMO_POR_TRANSACCION = "0005";
            public const string ATM_TRANSACCION_DECLINADA_EXCEDE_NUMERO_DE_RETIROS_DI = "0006";
            public const string ATM_CUENTA_CANCELADA = "0007";
            public const string ATM_RECHAZO_POR_FONDOS_INSUFICIENTES = "0008";
            public const string ATM_TIEMPO_DE_RESPUESTA_EXPIRADO = "0004";
            public const string ATM_REVERSO_DECLINADO = "0011";
            public const string ATM_TRANSACCION_INVALIDA = "0012";
            public const string ATM_MONTO_INVALIDO = "0013";
            public const string ATM_ERROR_FORMATO = "0014";
            public const string ATM_NO_EXISTE_CUENTA_CREDITO = "0015";
            public const string ATM_TRANSACCION_DUPLICADA = "0016";
            public const string ATM_CUENTA_CREDITO_NO_EXISTE = "0017";
            public const string ATM_INCORRECT_PIN = "0018";
            public const string ATM_EXPIRED_CARD_PICK_UP = "0019";
            public const string ATM_PREVENTIVE_BLOCK = "0020";
            public const string ATM_SUSPECTED_FRAUD = "0021";
            public const string ATM_LOST_CARD_PICK_UP = "0022";
            public const string ATM_STOLEN_CARD_PICK_UP = "0023";
            public const string ATM_RESTRICTED_CARD_PICK_UP = "0024";
            public const string ATM_TRANSACTION_NOT_PERMITTED_TO_TERMINAL = "0025";
            public const string ATM_RESTRICTED_CARD = "0026";
            public const string ATM_SECURITY_VIOLATION = "0027";
            public const string ATM_ALLOWABLE_PIN_TRIES_EXCEEDED = "0028";
            public const string MASSIVE_BASE_VALOR_NO_PERMITIDO = "0029";
            public const string MASSIVE_BASE_APLICACION_INVALIDA = "0030";
            public const string MASSIVE_BASE_CUENTA_NO_ACTIVA = "0031";
            public const string MASSIVE_BASE_CUENTA_RELACIONADA_NO_EXISTE = "0032";
            public const string MASSIVE_BASE_AUTORIZADOR_NO_DISPONIBLE = "0033";
            public const string MASSIVE_BASE_FONDOS_INSUFICIENTES = "0034";
            public const string MASSIVE_BASE_REGISTRO_NO_ENCONTRADO = "0035";
            public const string MASSIVE_BASE_CUENTA_CANCELADA = "0036";
            public const string MASSIVE_BASE_TRANSACCION_EXITOSA = "0037";
            public const string MASSIVE_REVERSE_TRANSACCION_EXITOSA = "0038";
            public const string MASSIVE_REVERSE_VALOR_NO_PERMITIDO = "0039";
            public const string MASSIVE_REVERSE_APLICACION_INVALIDA = "0040";
            public const string MASSIVE_REVERSE_CUENTA_CANCELADA = "0041";
            public const string MASSIVE_REVERSE_CUENTA_NO_ACTIVA = "0042";
            public const string MASSIVE_REVERSE_CUENTA_RELACIONADA_NO_EXISTE = "0043";
            public const string MASSIVE_REVERSE_AUTORIZADOR_NO_DISPONIBLE = "0044";
            public const string MASSIVE_REVERSE_FONDOS_INSUFICIENTES = "0045";
            public const string MASSIVE_REVERSE_REGISTRO_NO_ENCONTRADO = "0046";
        }

        public struct AgreementsTypeCodes
        {
            public const string K7 = "K7";
            public const string Uber = "UBER";
            public const string LifeMiles = "LMFIS";
            public const string Dlocal = "Dlocal";
            public const string K72 = "K72";
            public const string Walo = "WALO";
        }

        public struct ProductTypeCodes
        {
            public const int ElectronicDeposit = 1;
        }

        public enum SystemSettingKeys
        {
            UVT,
            SMLV,
            IVA,
            GMF,
            GMF_LIMIT_1_CON,
            GMF_LIMIT_2_CON,
            SEDPE_BAL_CAP_CON,
            SEDPE_MON_OUTFLOW_CAP_CON,
            GMF_LIMIT_1_VAL,
            GMF_LIMIT_2_VAL,
            SEDPE_BAL_CAP_VAL,
            SEDPE_OUT_CAP_VAL,
            SEDPE_BROWSER_LIMIT,
            CANCEL_USER_JOB_HOUR,
            LINKAGE_MANGER_EMAIL,
            COMMERCIAL_LEADER_K7_EMAIL,
            FREQUENCY_SENDING_MQ,
            CUSTOMER_DEFULT_PERSON_TYPE,
            PAYMENT_API_K7_APPROVAL_URI_PATH,
            PAYMENT_API_K7_RESUME_URI_PATH,
            EASY_PAYMENT_MINIMUM_AMOUNT,
            EASY_PAYMENT_MAXIMUM_AMOUNT,
            FREQUENCY_CHECKING_API_PAYMENT_REQUESTS,
            APIPAYMENT_MAX_VALIDITY_MINUTES,
            PURCHASE_PMT_BTN_FILE_GENRATION_TIME,
            DISPERSION_OF_FUNDS_FILE_GENERATION_TIME,
            BANK_CORRESPONDENT_FILE_GENERATION_TIME,
            PENDING_TRANSACTIONS_EXECUTION_TIME,
            REFRESHTOKEN_DEFAULT_TIMEOUT,
            TOKEN_DEFAULT_TIMEOUT_MILISECONDS,
            UIAF_ENCRYPTED_FILE,
            DATA_ANALITYCS_ENCRYPTED_FILE,
            ENT_ENCRYPTED_FILE,
            NOTIFICATION_USER_EXECUTION_TIME,
            NURA_CODE_ACH,
            ASD_NIT,
            PAYMENT_BTN_ENCRYPTED_FILE,
            DISPERSION_OF_FUNDS_ENCRYPTED_FILE,
            MAX_CREDITCARDS_BY_USER,
            MAX_CREDITCARDS_BY_ACCOUNTS,
            PSE_ENCRYPTED_FILE,
            WITHDRAW_TIMES_CHECK,
            WITHDRAW_TIME_CHECK,
            QR_TRASACTIONS_MIN_DAILY,
            QR_TRASACTIONS_MAX_DAILY,
            QR_TRASACTIONS_TOTAL_DAILY,
            QR_TRASACTIONS_MAX_MONTHLY,
            QR_TRASACTIONS_TOTAL_MONTHLY,
            PRODUCTION_ENVIRONMENT,
            MAX_NOTIFICATION_COUNT_PREACTIVE_USERS,
            UBER_AGREEMENT_SPECIAL_CODE,
            BANK_CORRESNPONDENT_ENCRYPTED_FILE,
            REVERSAL_TIME_FOR_PAYMENT_BUTTON_TRANSACTION,
            FOGAFIN_MOUNTS,
            TY_TRASACTIONS_MAX_DAILY,
            TY_TRASACTIONS_MAX_TRANSACTION,
            MICRO_PAY_MIN_RANGE,
            MICRO_PAY_MAX_RANGE,
            MICRO_PAY_TIME_EXPIRATION,
            MICRO_PAY_COMPENSATION,
            RECAPTCHA_SCORE_PARAMETER,
            PAYMENT_RETRACT_DAYS_LIMIT,
            TRANSFERTX_ENCRYPTED_FILE,
            DEBITCARDS_NUMBER_OF_AUTO_ISSUANCES,
            EXEMPTION_OF_UBER_BENEFITS_CHARGE,
            NUMBER_OF_EXEMPTION_OF_UBER_BENEFITS_NOT_CHARGE,
            DEBITCARDS_MAX_ATTEMPTS_OF_AUTO_ISSUANCES,
            DEBITCARDS_DELAY_TIME_BETWEEN_AUTO_ISSUANCE,
            LOG_BOOK_ENCRYPTED_FILE,
            PERIODICITY_MESSAGE_DEBIT_CARD,
            CASHBACK_ENCRYPTED_FILE,
            DEBITCARD_INVENTORY_ENCRYPTED_FILE,
            NOTIFICATIONCONTROL_TIMES_CHECK,
            NOTIFICATIONCONTROL_INTERVALTIME_CHECK,
            DEBITCARD_CONCILATION_ENCRYPTED_FILE,
            ENABLE_GEMALTO,
            DISPERSION_FILE_OTP_EXPIRE_TIME,
            MERCHANT_PENDING_REQUESTS_STATUS_CHANGE_EXECUTION_TIME,
            COLLECTION_AGREEMENT_OPTION,
            MAX_COLLECTION_AGREEMENT_REFERENCES,
            HIDE_COMMERCIAL_DATA_OPTION,
            CHANGE_PHONE_NUMBER_OTP_EXPIRE_TIME,
            ADD_EMPLOYEE_OTP_EXPIRE_TIME,
            WITHDRAW_OTP_CAP,
            WITHDRAW_DEBITCARD_CAP,
            WITHDRAW_OTHERAVAL_DEBITCARD_CAP,
            WITHDRAW_INTERNATIONAL_DEBITCARD_CAP,
            WITHDRAW_DEBITCARD_CAP_VALUE,
            WITHDRAW_DEBITCARD_CAP_COUNT,
            PSE_RECHARGE_TRASACTIONS_MAX_TRANSACTION,
            REFRESH_TOKEN_MAX_VALIDITY_DAYS_AFTER_USER_NO_ACTIVITY,
            CHANGE_EMAIL_OTP_EXPIRE_TIME,
            PARTIAL_PROCESSED_ADJUSTMENT_RECOVERY_DAYS_LIMIT,
            BALANCE_UPDATE_MAX_ATTEMPTS_LIMIT,
            ENTAthFileSecuritySettings,
            FOGAFIN_ENCRYPTED_FILE,
            MIN_TRANSACTION_INTERNAL_QR,
            MAX_TRANSACTION_INTERNAL_QR,
            MIN_TRANSACTION_INTERAVAL_QR,
            MAX_TRANSACTION_INTERAVAL_QR,
            MIN_TRANSACTION_INTEROPERABLE_QR,
            MAX_TRANSACTION_INTEROPERABLE_QR,
            LOG_BOOK_ENCRYPTED_FILE_DALE,
            PAYMENT_RETRACT_DAYS_LIMIT_QRENTRECUENTAS, //DPE-86
            WITHDRAW_OTP_CB_CAP,
            WITHDRAW_OTP_CB_CAP_VALUE,
            WITHDRAW_OTP_CB_CAP_COUNT,
            DOT_ENT_FILE_FORTH_FIELD_VALUE_QRBETWEENACCOUNTS, //DPE-169
            BinnacleDaysDaysToGetReport,
            MODAL_INVITATION_TIME, // K7ADC-1938
            ACTIVE_LM_HANDLING_FEE,
            ACTIVE_WALO_HANDLING_FEE
        }

        public struct SpecialCodes
        {
            public const string UBER = "F0YG";
        }

        public struct CASHBACKTRANSACTIONUBER
        {
            public const int MCC = 5541;
            public const int MCCADITIONAL = 5542;
            public const string MTI = "0100";
            public const string MTIREVERSE = "0420";
        }
    }
}
