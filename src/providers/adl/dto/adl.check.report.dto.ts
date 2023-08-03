export class AdlCheckTrxReportInput {
  unique_id: string;
  job: string;
  DocumentNumber: string;
  AccountNumber: string;
  Year: number;
}

export class AdlCheckTrxReportOutput {
  unique_id: string;
  status_code: number;
  response: {
    Name: string;
    Email: string;
    DocumentNumber: string;
    AccountNumber: string;
    Year: number;
    Summary: {
      TotalBase: number;
      TotalGMF: number;
    };
  };
}
