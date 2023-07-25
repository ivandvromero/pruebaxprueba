export class CreateTransactionBodyDto {
  headerRQ: {
    msgId: string;
    timestamp: string;
  };
  securityRQ: {
    hostId: string;
    channelId: string;
  };
  messageRQ: {
    account: string;
    currency?: string;
    amount: number;
    transactionChannelId: string;
    transactionReason: string;
    type: string;
    importeComision: number;
    importeIva: number;
    importeGMF: number;
  };
  constructor(
    depositNumber: string,
    amount: number,
    transactionType: string,
    transactionChannel: string,
    fees: number,
    vat: number,
    gmf: number,
  ) {
    this.headerRQ = {
      msgId: 'PanelAdm449',
      timestamp: '1678718570',
    };
    this.securityRQ = {
      hostId: 'hostname',
      channelId: 'BACKOFFICE',
    };
    this.messageRQ = {
      account: depositNumber,
      amount: amount,
      currency: 'COP',
      transactionChannelId: transactionChannel,
      transactionReason: '',
      type: transactionType === 'CREDIT' ? 'CREDITO' : 'DEBITO',
      importeComision: fees,
      importeGMF: gmf,
      importeIva: vat,
    };
  }
}
