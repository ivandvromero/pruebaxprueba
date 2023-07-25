import { TransactionOptions } from '../interfaces/find-transactions-pts-response.interface';

export class FindTransactionsBodyDto {
  headerRQ: {
    msgId: string;
    timestamp: string;
  };
  securityRQ: {
    hostId: string;
    channelId: string;
  };
  messageRQ: {
    filterCriteria: {
      document?: string;
      depositAccount?: string;
      mobilePhone?: string;
      sourceProduct?: {
        sourceBankId?: '';
        sourceAccount: string;
      };
      targetProduct?: {
        beneficiaryBankId?: '';
        beneficiaryAccount: string;
      };
      amount?: string;
      transactionType?: string;
      referenceNumber?: string;
      from: Date;
      to: Date;
      status?: string;
    };
  };
  constructor(options: TransactionOptions) {
    this.headerRQ = {
      msgId: 'PanelAdm449',
      timestamp: '1684610153',
    };

    this.securityRQ = {
      hostId: 'hostname',
      channelId: 'BACKOFFICE',
    };

    this.messageRQ = {
      filterCriteria: {
        document: options.identification,
        depositAccount: options.depositNumber,
        mobilePhone: options.phone,
        sourceProduct: options.originAccountId,
        targetProduct: options.receivingAccountId,
        amount: options.amount,
        transactionType: options.transactionType,
        referenceNumber: options.idTransactionNumber,
        from: options.initialDate,
        to: options.endDate,
        status: options.status,
      },
    };
  }
}
