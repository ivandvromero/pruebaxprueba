export class AdlCheckTrxInput {
  unique_id: string;
  job: string;
  DocumentNumber: string;
  AccountNumber: string;
  StartDate: string;
  EndDate: string;
}

export class AdlCheckTrxOutput {
  unique_id: string;
  status_code: number;
  response: {
    Name: string;
    AccountNumber: string;
    StartDate: string;
    EndDate: string;
    Summary: {
      BalanceInitial: number;
      TotalAbonos: number;
      TotalCharges: number;
      TotalCommission: number;
      TotalIVA: number;
      TotalGMF: number;
      TotalRetention: number;
      BalanceFinal: number;
    };
    Details: [
      {
        DateTransacion: string;
        TimeTransacion: string;
        Concept: string;
        Debit: number;
        Credit: number;
        Balance: number;
      },
      {
        DateTransacion: string;
        TimeTransacion: string;
        Concept: string;
        Debit: number;
        Credit: number;
        Balance: number;
      },
      {
        DateTransacion: string;
        TimeTransacion: string;
        Concept: string;
        Debit: number;
        Credit: number;
        Balance: number;
      },
    ];
  };
}
