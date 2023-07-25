export class AdjustmentReportsDto {
  transactionCode: string;
  transactionName: string;
  adjustmentType: string;
  value: number;
  depositNumber: string;
  capturerUser: string;
  dateCapture: Date;
  verifierUser: string;
  dateVerification: Date;
  approverUser: string;
  dateApprover: Date;
  adjustmentsState: string;
  comment?: string;
}
