export const transactionCodes = [
  {
    code: 'COU0001',
    description:
      'COU0001 - Transferencia: Con cargo (Débito) a un Deposito Electrónico y abono a cuentas Aval',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0001A',
    description:
      'COU0001A - Ajuste Débito por Transferencia con cargo (Débito) a un Deposito Electrónico y abono a cuentas Aval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0001R',
    description:
      'COU0001R - Reversión cargo a Deposito Electrónico  por transferencia a cuentas Aval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0002',
    description:
      'COU0002 - Transferencia: Con cargo a un Deposito Electrónico y abono a cuentas entidades NO Aval',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0002A',
    description:
      'COU0002A - Ajuste Débito por Transferencia con cargo a un Deposito Electrónico y abono a cuentas entidades NO Aval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0002R',
    description:
      'COU0002R - Reversión cargo a Deposito Electrónico por transferencia a cuentas entidades NO Aval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0003A',
    description:
      'COU0003A - Ajuste Débito por Transferencia INTRASOLUCION- Con Cargo a un Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0003R',
    description:
      'COU0003R - Reversión cargo a Deposito Electrónico  por Transferencia: INTRASOLUCION-',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0003M',
    description:
      'COU0003M - Reversión cargo a Deposito Electrónico  por Transferencia: INTRASOLUCION (Ajuste manual)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0004',
    description:
      'COU0004 - Transferencia: INTRASOLUCION- Con Cargo a un Deposito Electrónico por compras establecimientos de Ccio ',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0004A',
    description:
      'COU0004A - Ajuste Débito Transferencia: INTRASOLUCION Con Cargo a un Deposito Electrónico por compras establecimientos de Ccio ',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0004R',
    description:
      'COU0004R - Reversión cargo a Deposito Electrónico por Transferencia INTRASOLUCION  en compras establecimientos de Ccio ',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0005',
    description:
      'COU0005 - Retiros en cajero automático ATH  Con cargo a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0005A',
    description:
      'COU0005A - Ajuste Débito por Retiro en cajero automático ATH Con cargo a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0005R',
    description:
      'COU0005R - Reversión cargo a Deposito Electrónico por Retiros Cajero automático ATH',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0006',
    description:
      'COU0006 - Retiros en Corresponsales Bancarios CB Con cargo a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0006A',
    description:
      'COU0006A - Ajuste Débito por Retiro en Corresponsal Bancario CB Con cargo a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0006R',
    description:
      'COU0006R - Reversión cargo a Deposito Electrónico por  Retiros en Corresponsal Bancario CB',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0009',
    description:
      'COU0009 - Débito al deposito electrónico origen para dispersión de fondos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0009A',
    description:
      'COU0009A - Ajuste al deposito electrónico origen para dispersión de fondos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0009R',
    description:
      'COU0009R - Reversión al deposito electrónico destino por dispersión de fondos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0010',
    description: 'COU0010 - Débito al Deposito por compra Botón de Pagos.',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0010A',
    description:
      'COU0010A - Ajuste Débito al Deposito por compra Botón de Pagos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0010R',
    description:
      'COU0010R - Reversión cargo a Deposito por compra Botón de Pagos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0010RT',
    description: 'COU0010RT - Retracto con abono al deposito - Botón de pago',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0011',
    description:
      'COU0011 - Retiros en cajero automático con Tarjeta Débito (Débito) Cajeros Nacionales',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0011A',
    description:
      'COU0011A - Ajuste Débito por Retiro en cajero automático con TD (Débito) Cajeros Nacionales',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0011R',
    description:
      'COU0011R - Reversión (crédito) del cargo por retiro con Tarjeta Débito en Cajero automático Cajeros Nacionales',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0012',
    description:
      'COU0012 - Pago TD Dale - Cargo a un Deposito Electrónico por compras E-commerce ',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0012A',
    description:
      'COU0012A - Ajuste Débito por pago TD Dale! - Cargo a un Deposito Electrónico por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0012R',
    description:
      'COU0012R - Reversión cargo a Deposito Electrónico por pago TD Dale! -  por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0012DV',
    description:
      'COU0012DV - Devolución crédito a Deposito Electrónico por pago TD Dale! - por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0012RD',
    description:
      'COU0012RD - Reversión devolución Débito a Deposito Electrónico por pago TD Dale!-por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0013',
    description:
      'COU0013 - Pago TD Dale - Cargo a un Deposito Electrónico por compras establecimientos de Ccio POS',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0013A',
    description:
      'COU0013A - Ajuste Débito por pago TD Dale! - Cargo a un Deposito Electrónico por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0013R',
    description:
      'COU0013R - Reversión cargo a Deposito Electrónico por pago TD Dale! - por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0013DV',
    description:
      'COU0013DV - Devolución crédito a Deposito Electrónico por pago TD Dale! - por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0013RD',
    description:
      'COU0013RD - Reversión devolución Débito a Deposito Electrónico por pago TD Dale!-por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0015',
    description:
      'COU0015 - Retiros en cajero automático Internacional en Tarjeta Débito (Débito)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0015A',
    description:
      'COU0015A - Ajuste Débito por Retiro en cajero automático Internacional con TD (Débito)',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0015R',
    description:
      'COU0015R - Reversión (crédito) del cargo por retiro con Tarjeta Débito en Cajero automático Internacional',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0016',
    description:
      'COU0016 - Pago TD Dale - Cargo a un Deposito Electrónico por compras establecimientos de Cio internacionales - Presencial',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0016A',
    description:
      'COU0016A - Ajuste Débito por pago TD Dale! - Cargo a un Deposito Electrónico por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0016R',
    description:
      'COU0016R - Reversión cargo a Deposito Electrónico por pago TD Dale! -  por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0016DV',
    description:
      'COU0016DV - Devolución Crédito a Deposito Electrónico por pago TD Dale! -  por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0016RD',
    description:
      'COU0016RD - Reversión devolución Débito a Deposito Electrónico por pago TD Dale!-por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0017',
    description:
      'COU0017 - Transferencia código QR con Débito a un Deposito Electrónico de PN',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0017A',
    description:
      'COU0017A - Ajuste Débito por transferencia código QR con Débito a un Deposito Electrónico de PN',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0017R',
    description:
      'COU0017R - Reversión (crédito) Deposito Electrónico - Transferencia código QR PN',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0018',
    description:
      'COU0018 - Transferencia código QR con cargo Débito a un Deposito Electrónico por compras establecimientos de Ccio',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0018A',
    description:
      'COU0018A - Ajuste Débito por transferencia código QR con cargo Débito a un Deposito Electrónico por compras establecimientos de Ccio',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0018R',
    description:
      'COU0018R - Reversión cargo a Deposito Electrónico - Transferencia código QR por compras establecimientos de Coció',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0019',
    description: 'COU0019 - Giros -  Con cargo a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0019A',
    description:
      'COU0019A - Ajuste Débito por Giros -con cargo a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0019R',
    description: 'COU0019R - Reversión cargo a Deposito Electrónico por Giros',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0020',
    description: 'COU0020 - Pago Servicios Públicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0020A',
    description: 'COU0020A - Ajuste pago Servicios Públicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0020R',
    description: 'COU0020R - Reversión Pagos Servicios Públicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0021',
    description:
      'COU0021 - Transferencias Ya! con cargo a un Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0021A',
    description:
      'COU0021A - Ajuste Débito por Transferencias Ya! con cargo a un Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0021R',
    description:
      'COU0021R - Reversión Transferencias Ya! con abono a  Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'COU0022',
    description:
      'COU0022 - Pago TD Dale - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0022A',
    description:
      'COU0022A - Ajuste Débito por Pago TD Dale - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0022R',
    description:
      'COU0022R - Reversión cargo a Deposito Electrónico por Pago TD Dale - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0022DV',
    description:
      'COU0022DV - Devolución Crédito cargo a Deposito Electrónico por Pago TD Dale - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0022RD',
    description:
      'COU0022RD - Reversión devolución Débito cargo a Deposito Electrónico por Pago TD Dale-Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0023',
    description: 'COU0023 - Recargas a Celular',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0023A',
    description: 'COU0023A - Ajuste Recargas a Celular',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0023R',
    description: 'COU0023R - Reverso Recargas a Celular',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0024',
    description: 'COU0024 - Débito al depósito por Recaudo Referenciado',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0024A',
    description:
      'COU0024A - Ajuste Débito al depósito por Recaudo Referenciado',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0024R',
    description:
      'COU0024R - Reversión (crédito) al depósito por Recaudo Referenciado',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0025',
    description:
      'COU0025 - Transferencia código QR con cargo Débito a un Deposito Electrónico por compras usuarios SABI',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0025A',
    description:
      'COU0025A - Ajuste Débito por transferencia código QR con cargo Débito a un Deposito Electrónico por compras usuarios SABI',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0025R',
    description:
      'COU0025R - Reversión cargo a Deposito Electrónico - Transferencia código QR por compras usuarios SABI',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0026',
    description: 'COU0026 - Pagos con botón pagos PSE',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0026A',
    description: 'COU0026A - Ajuste Débito por pagos con botón pagos PSE',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0026R',
    description:
      'COU0026R - Reversión cargo a Deposito Electrónico  por pagos con botón pagos PSE',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0027',
    description:
      'COU0027 - Retiros en cajero automático con TD LifeMiles (Débito) Cajeros Nacionales',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0027A',
    description:
      'COU0027A - Ajuste Débito por Retiro en cajero automático con TD LifeMiles (Débito) Cajeros Nacionales',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0027R',
    description:
      'COU0027R - Reversión (crédito) del cargo por retiro con TD LifeMiles en Cajero automático Cajeros Nacionales',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0028',
    description:
      'COU0028 - Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras E-commerce',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0028A',
    description:
      'COU0028A - Ajuste Débito por pago TD LifeMiles - Cargo a un Deposito Electrónico por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0028R',
    description:
      'COU0028R - Reversión cargo a Deposito Electrónico por pago TD LifeMiles - por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0028DV',
    description:
      'COU0028DV - Devolución crédito a Deposito Electrónico por pago TD LifeMiles - por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0028RD',
    description:
      'COU0028RD - Reversión devolución Débito a Deposito Electrónico por pago TD LifeMiles - por compras E-commerce',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0029',
    description:
      'COU0029 - Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras establecimientos de Ccio POS',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0029A',
    description:
      'COU0029A - Ajuste Débito por pago TD LifeMiles - Cargo a un Deposito Electrónico por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0029R',
    description:
      'COU0029R - Reversión cargo a Deposito Electrónico por pago TD LifeMiles - por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0029DV',
    description:
      'COU0029DV - Devolución crédito a Deposito Electrónico por pago TD LifeMiles - por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0029RD',
    description:
      'COU0029RD - Reversión devolución Débito a Deposito Electrónico por pago TD LifeMiles - por compras establecimientos de Ccio POS',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0030',
    description:
      'COU0030 - Retiros en cajero automático Internacional con TD LifeMiles (Débito)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0030A',
    description:
      'COU0030A - Ajuste Débito por Retiro en cajero automático Internacional con TD LifeMiles (Débito)',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0030R',
    description:
      'COU0030R - Reversión (crédito) del cargo por retiro con TD LifeMiles en Cajero automático Internacional ',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0031',
    description:
      'COU0031 - Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras establecimientos de Cio internacionales - Presencial',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0031A',
    description:
      'COU0031A - Ajuste Débito por pago TD LifeMiles - Cargo a un Deposito Electrónico por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0031R',
    description:
      'COU0031R - Reversión cargo a Deposito Electrónico por pago TD LifeMiles -  por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0031DV',
    description:
      'COU0031DV - Devolución Crédito a Deposito Electrónico por pago TD LifeMiles -  por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0031RD',
    description:
      'COU0031RD - Reversión devolución Débito a Deposito Electrónico por pago TD LifeMiles -  por compras establecimientos de Ccio internacionales - Presencial',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0032',
    description:
      'COU0032 - Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0032A',
    description:
      'COU0032A - Ajuste Débito por Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0032R',
    description:
      'COU0032R - Reversión cargo a Deposito Electrónico por Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0032DV',
    description:
      'COU0032DV - Devolución Crédito cargo a Deposito Electrónico por Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0032RD',
    description:
      'COU0032RD - Reversión devolución Débito cargo a Deposito Electrónico por Pago TD LifeMiles - Cargo a un Deposito Electrónico por compras e-commerce internacionales',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0033',
    description:
      'COU0033 - Transacción QR Entre Cuentas con Débito a un Depósito Electrónico Interoperable',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0033A',
    description:
      'COU0033A - Ajuste Débito Transacción QR Entre Cuentas Interoperable',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0033R',
    description:
      'COU0033R - Reversión (crédito) Depósito Electrónico - Transacción QR Entre Cuentas Interoperable',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0034',
    description:
      'COU0034 - Transacción QR Entre Cuentas con Débito a un Depósito Electrónico Interaval',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0034A',
    description:
      'COU0034A - Ajuste Débito Transacción QR Entre Cuentas Interaval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0034R',
    description:
      'COU0034R - Reversión (crédito) Depósito Electrónico - Transacción QR Entre Cuentas Interaval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0035',
    description:
      'COU0035 - Transacción QR Entre Cuentas con Débito a un Depósito Electrónico dale! a dale!',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0035A',
    description:
      'COU0035A - Ajuste Débito Transacción QR Entre Cuentas dale! a dale!',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COU0035R',
    description:
      'COU0035R - Reversión (crédito) Depósito Electrónico - Transacción QR Entre Cuentas dale! a dale!',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'COU0036',
    description:
      'COU0036 - Transferencias Cel2Cel con cargo a un Depósito Electrónico ',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0036A',
    description:
      'COU0036A - Ajuste Débito por Transferencias Cel2Cel con cargo a un Depósito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0036R',
    description:
      'COU0036R - Reversión Transferencias Cel2Cel con abono a Depósito Electrónico.',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COU0003',
    description:
      'COU0003 - Transferencia: INTRASOLUCION- Con Cargo a un Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0001',
    description:
      'CIN0001 - Transferencia: De cuentas Aval con abono (crédito) a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0001A',
    description:
      'CIN0001A - Ajuste crédito por transferencia: De cuentas Aval con abono a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0001R',
    description:
      'CIN0001R - Reversión abono a Deposito Electrónico  en  transferencia de cuentas Aval (Cargo al Dep)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0002',
    description:
      'CIN0002 - Transferencia: De cuentas de entidades NO Aval con abono (crédito) a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0002A',
    description:
      'CIN0002A - Ajuste crédito por transferencia: De cuentas entidades NO Aval  con abono a Deposito Electrónico a través de PSE',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0002R',
    description:
      'CIN0002R - Reversión abono Deposito Electrónico en transferencia de cuentas Entidades NO Aval (Cargo al Dep)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0003',
    description:
      'CIN0003 - Transferencia: Utilización TC Aval con abono (crédito) a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0003R',
    description:
      'CIN0003R - Reversión abono a Deposito electrónico por  Transferencia  Utilización TC Aval (Cargo al Dep)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0003A',
    description:
      'CIN0003A - Ajuste crédito por transferencia: Utilización TC Aval con abono a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0004',
    description:
      'CIN0004 - Transferencia: Utilización TC entidades NO Aval con abono (crédito) a Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0004A',
    description:
      'CIN0004A - Ajuste crédito por transferencia: Utilización TC NO Aval con abono a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0005',
    description:
      'CIN0005 - Transferencia: INTRASOLUCION- Con Abono (crédito) a un Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0005A',
    description:
      'CIN0005A - Ajuste crédito por transferencia: INTRASOLUCION- Con Abono a un Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0005R',
    description:
      'CIN0005R - Reversión abono a Deposito Electrónico  por Transferencia: INTRASOLUCION- (Cargo al Dep)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0007',
    description:
      'CIN0007 - Abono a un Deposito Electrónico en consignación realizada en un CB',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0007A',
    description:
      'CIN0007A - Ajuste por abono a un Deposito Electrónico en consignación realizada en un CB',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0007R',
    description:
      'CIN0007R - Reversión Abono a un Deposito Electrónico en consignación realizada en un CB',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0008',
    description:
      'CIN0008 - Abono al deposito electrónico destino por dispersión de fondos (masivo)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0008A',
    description:
      'CIN0008A - Ajuste crédito a deposito electrónico destino por dispersión de fondos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0008R',
    description:
      'CIN0008R - Reverso crédito a deposito electrónico destino por dispersión de fondos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0009',
    description:
      'CIN0009 - Botón de Pagos: Con Abono a un Deposito Electrónico a comercios',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0009A',
    description:
      'CIN0009A -Ajuste con Abono (crédito) al comercio, por uso de Botón de Pagos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0009R',
    description:
      'CIN0009R - Reversión con Cargo (debito) a Deposito Electrónico  de comercio por Botón de pagos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0009RT',
    description: 'CIN0009RT - Retracto con cargo al deposito - Botón de pago',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0010',
    description:
      'CIN0010 - Transferencia por dispersión de archivos con abono (crédito) a Deposito Electrónico.',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0010A',
    description:
      'CIN0010A - Ajuste crédito a transferencia por dispersión de archivos  con abono a Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0010R',
    description:
      'CIN0010R - Reversión abono al Deposito Electrónico en transferencia, por dispersión de archivos(Cargo al Deposito)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0011',
    description:
      'CIN0011 - Pago TD Dale!- Abono (crédito) a un Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0011A',
    description:
      'CIN0011A - Ajuste crédito por pago TD Dale! - Abono a un Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0011R',
    description:
      'CIN0011R - Reversión abono a Deposito Electrónico  por Pago TD Dale! - (Cargo al Dep)',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0012',
    description:
      'CIN0012 - Cash Back Driver Uber Abono a un deposito electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0012A',
    description:
      'CIN0012A - Ajuste crédito por Cash Back Driver Uber Abono a un deposito electrónico',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0012R',
    description:
      'CIN0012R - Reversión abono a Deposito Electrónico  por Cash Back Driver Uber',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0013',
    description:
      'CIN0013 - Transferencia código QR con abono a un deposito electrónico de PN',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0013A',
    description:
      'CIN0013A - Ajuste crédito por transferencia código QR con abono a un deposito electrónico de PN',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0013R',
    description:
      'CIN0013R - Reversión (debito) transferencia código QR con abono a un deposito electrónico de PN',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0014',
    description:
      'CIN0014 - Transferencia código QR con abono a un Deposito Electrónico por compras establecimientos de Ccio',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0014A',
    description:
      'CIN0014A - Ajuste crédito por transferencia código QR con abono a un Deposito Electrónico por compras establecimientos de Ccio ',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0014R',
    description:
      'CIN0014R - Reversión cargo a Deposito Electrónico - Transferencia código QR por compras establecimientos de Ccioo',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0016',
    description: 'CIN0016 - Abono al depósito por transferencia masiva Aval',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0016A',
    description:
      'CIN0016A - Ajuste del abono al depósito por transferencia masiva Aval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0016R',
    description:
      'CIN0016R - Reversión del abono al depósito por transferencia masiva Aval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0017',
    description: 'CIN0017 - Asociación TC Cash In cargue deposito electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0017A',
    description:
      'CIN0017A - Ajuste crédito asociación TC Cash In cargue deposito electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0017R',
    description:
      'CIN0017R - Reversión asociación TC Cash In cargue deposito electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0018',
    description:
      'CIN0018 - Transferencias Ya! con abono a un Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0018A',
    description:
      'CIN0018A - Ajuste crédito por Transferencias Ya! con abono a un Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0018R',
    description:
      'CIN0018R - Reversión Transferencias Ya! con cargo a  Deposito Electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: 'COMISSION,TAX,GMF',
  },
  {
    code: 'CIN0019',
    description: 'CIN0019 - Crédito al depósito por Recaudo Referenciado',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0019A',
    description:
      'CIN0019A - Ajuste crédito al depósito por Recaudo Referenciado',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0019R',
    description:
      'CIN0019R - Reversión (débito) al depósito por Recaudo Referenciado',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0020',
    description:
      'CIN0020 - Transferencia código QR - proveedores contrato SABI',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0020A',
    description:
      'CIN0020A - Ajuste crédito por transferencia código QR - proveedores contrato SABI',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0020R',
    description:
      'CIN0020R - Reversión cargo a Deposito Electrónico - Transferencia código QR proveedores contrato SABI',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0021',
    description: 'CIN0021 - Transferencia servicio de Visa Direct – OCT',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0021A',
    description:
      'CIN0021A - Ajuste crédito por transferencia servicio de Visa Direct – OCT',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0021R',
    description:
      'CIN0021R - Reversión cargo a Deposito Electrónico por transferencia servicio de Visa Direct – OCT',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0022',
    description: 'CIN0022 - Transacción QR Entre Cuentas Interoperable',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0022A',
    description:
      'CIN0022A - Ajuste Crédito Transacción QR Entre Cuentas Interoperable',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0022R',
    description:
      'CIN0022R - Reversión cargo a Depósito Electrónico Transacción QR Entre Cuentas Interoperable',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0023',
    description: 'CIN0023 - Transacción QR Entre Cuentas Interaval',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0023A',
    description:
      'CIN0023A - Ajuste Crédito Transacción QR Entre Cuentas Interaval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0023R',
    description:
      'CIN0023R - Reversión cargo a Depósito Electrónico Transacción QR Entre Cuentas Interaval',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0024',
    description: 'CIN0024 - Transacción QR Entre Cuentas dale! a dale!',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0024A',
    description:
      'CIN0024A - Ajuste Crédito Transacción QR Entre Cuentas dale! a dale!',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'CIN0024R',
    description:
      'CIN0024R - Reversión cargo a Depósito Electrónico Transacción QR Entre Cuentas dale! a dale!',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'CIN0025',
    description: 'CIN0025 - Incentivos Abono a un depósito electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0025A',
    description:
      'CIN0025A - Ajuste crédito por Incentivos Abono a un depósito electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0025R',
    description:
      'CIN0025R - Reversión abono a Depósito Electrónico por Incentivos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0026',
    description:
      'CIN0026 - Transferencia por dispersión subsidios DPS con abono (crédito) a Depósito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0026A',
    description:
      'CIN0026A - Ajuste crédito a transferencia por dispersión subsidios DPS con abono a Depósito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0026R',
    description:
      'CIN0026R - Reversión abono al Depósito Electrónico en transferencia por dispersión subsidios DPS (Cargo al Depósito)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0027',
    description:
      'CIN0027 - Transferencias Cel2Cel con abono a un Depósito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0027A',
    description:
      'CIN0027A - Ajuste crédito por Transferencias Cel2Cel con abono a un Depósito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'CIN0027R',
    description:
      'CIN0027R - Reversión Transferencias Cel2Cel con cargo a Depósito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0001',
    description:
      'COM0001 - Comisión por retiros en Cajero Automático con Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0001R',
    description:
      'COM0001R - Reversión Comisión por retiros en Cajero Automático con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0002',
    description:
      'COM0002 - Comisión por Retiros en Corresponsal Bancario con Cargo a Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0002R',
    description:
      'COM0002R - Reversión Comisión por Retiros en Corresponsal Bancario con Cargo a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0003',
    description:
      'COM0003 - Comisión por Transferencias a Cuentas Aval con Cargo (debito) a Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0003R',
    description:
      'COM0003R - Reversión de Comisión por Transferencias a Cuentas Aval con Abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0004',
    description:
      'COM0004 - Comisión por Transferencias a Cuentas NO Aval con Cargo (debito) a Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0004R',
    description:
      'COM0004R - Reversión de la Comisión por Transferencias a Cuentas NO Aval con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0005',
    description:
      'COM0005 - Comisión por Transferencias INTRASOLUCION con Cargo (debito) a Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0005R',
    description:
      'COM0005R - Reversión Comisión por Transferencias intrasolución con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0007',
    description:
      'COM0007 - Comisión por dispersión de fondos con cargo (debito) a deposito electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0007R',
    description:
      'COM0007R - Reversión Comisión por dispersión de fondos con abono (crédito) a deposito',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0008',
    description:
      'COM0008 - Comisión por uso Botón de pagos con Cargo (debito) a Depósitos Electrónicos (comercio)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0008R',
    description:
      'COM0008R - Reversión Comisión por uso Botón de pagos con Abono (crédito) a Depósitos Electrónicos (comercio)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0009',
    description:
      'COM0009 - Comisión por retiros con TD en Cajero Automático AVAL con Cargo (debito) al deposito',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0009R',
    description:
      'COM0009R - Reversión Comisión por retiros con TD en Cajero Automático AVAL con abono (crédito) al deposito',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0010',
    description:
      'COM0010 - Emisión TD con Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0010R',
    description:
      'COM0010R - Reversión, emisión TD con  Abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0011',
    description:
      'COM0011 - Reexpedición de TD con Cargo (debito) a Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0011R',
    description:
      'COM0011R - Reversión de Comisión por reexpedición de TD con Abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0012',
    description:
      'COM0012 - Cuota de Manejo TD con Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0012R',
    description:
      'COM0012R - Reversión cobro cuota de Manejo TD con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0013',
    description:
      'COM0013 - Comisión por retiros en Cajero Automático otras redes Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0013R',
    description:
      'COM0013R - Reversión Comisión por retiros en Cajero Automático otras redes con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0014',
    description:
      'COM0014 - Comisión por retiros internacionales en Cajero Automático Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0014R',
    description:
      'COM0014R - Reversión Comisión por retiros internacionales en Cajero Automático con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0015',
    description: 'COM0015 - Comisión por uso de códigos QR',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0015R',
    description:
      'COM0015R - Reversión Comisión por uso de códigos QR abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0016',
    description: 'COM0016 - Comisión Giros',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0016R',
    description:
      'COM0016R - Reversión Comisión Giros abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0017',
    description: 'COM0017 - Comisión Transferencias YA',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0017R',
    description:
      'COM0017R - Reversión Comisión Transferencias Ya (crédito) a depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0018',
    description:
      'COM0018 - Comisión por Recaudo Referenciado con Cargo (debito) a Depósitos Electrónicos (intrasolución)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0018R',
    description:
      'COM0018R - Reversión Comisión por Recaudo Referenciado con abono (crédito) a Depósitos Electrónicos (intrasolución)',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0019',
    description: 'COM0019 - Comisión Botón PSE',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0019R',
    description: 'COM0019R - Reversión Comisión Botón PSE',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0020',
    description: 'COM0020 - Comisión Habilitación Saldos SABI',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0020R',
    description: 'COM0020R - Reversión Comisión Habilitación Saldos SABI',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0021',
    description:
      'COM0021 - Comisión por retiros con TD LifeMiles en Cajero Automático AVAL con Cargo (debito) al deposito',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0021R',
    description:
      'COM0021R - Reversión Comisión por retiros con TD LifeMiles en Cajero Automático AVAL con abono (crédito) al deposito',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0022',
    description:
      'COM0022 - Emisión TD LifeMiles con Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0022R',
    description:
      'COM0022R - Reversión emisión TD LifeMiles con Abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0023',
    description:
      'COM0023 - Reexpedición de TD LifeMiles con Cargo (debito) a Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0023R',
    description:
      'COM0023R - Reversión de Comisión por reexpedición de TD LifeMiles con Abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0024',
    description:
      'COM0024 - Cuota de Manejo TD LifeMiles con Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0024R',
    description:
      'COM0024R - Reversión cobro cuota de Manejo TD LifeMiles con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0025',
    description:
      'COM0025 - Comisión por retiros TD LifeMiles en Cajero Automático otras redes Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0025R',
    description:
      'COM0025R - Reversión Comisión por retiros TD LifeMiles en Cajero Automático otras redes con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0026',
    description:
      'COM0026 - Comisión por retiros internacionales TD LifeMiles en Cajero Automático Cargo (debito) al Deposito Electrónico',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0026R',
    description:
      'COM0026R - Reversión Comisión por retiros internacionales TD LifeMiles en Cajero Automático con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer-DebitCard',
      'GpotVerifier',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0027',
    description:
      'COM0027 - Comisión por Transacción QR Entre Cuentas Interoperable',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0027R',
    description:
      'COM0027R - Reversión Comisión por Transacción QR Entre Interoperable Cuentas abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0028',
    description:
      'COM0028 - Comisión por Transacción QR Entre Cuentas Interaval',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0028R',
    description:
      'COM0028R - Reversión Comisión por Transacción QR Entre Cuentas Interaval abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'COM0029',
    description:
      'COM0029 - Comisión por Transacción QR Entre Cuentas dale! a dale!',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'COM0029R',
    description:
      'COM0029R - Reversión Comisión por Transacción QR Entre Cuentas dale! a dale! abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'GMF1001',
    description:
      'GMF1001 - GMF generado por cargo (debito) en Depósitos Electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'GMF1001A',
    description:
      'GMF1001A - GMF generado por Ajuste debito en Depósitos electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Capturer-DebitCard',
      'MonetaryAdjustment-Validator',
      'GpotVerifier',
      'MonetaryAdjustment-Approver',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'GMF1001R',
    description:
      'GMF1001R - Reversión GMF generado por cargo a Deposito electrónico',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Capturer-DebitCard',
      'MonetaryAdjustment-Validator',
      'GpotVerifier',
      'MonetaryAdjustment-Approver',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Crédito',
    activeFields: '',
  },
  {
    code: 'IVA1001',
    description:
      'IVA1001 - Iva Cobrado sobre Comisión con Cargo a Depósitos electrónicos',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'IVA1001R',
    description:
      'IVA1001R - Reversión Iva Cobrado sobre Comisión por Cargos a Depósitos electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Capturer-DebitCard',
      'MonetaryAdjustment-Validator',
      'GpotVerifier',
      'MonetaryAdjustment-Approver',
      'MonetaryAdjustment-Approver-DebitCard',
    ],
    type: 'Débito',
    activeFields: '',
  },
  {
    code: 'RET0001',
    description:
      'RET0001 - Retención en la fuente: Cargo en Cta Deposito Electrónico por retención sobre intereses ganados',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'RET0001A',
    description:
      'RET0001A - Ajuste Retención en la Fte con Cargo en Cta Deposito Electrónico por retención sobre intereses ganados',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'RET0001R',
    description:
      'RET0001R - Reversión Retención en la Fte con Cargo en Cta Deposito Electrónico por retención sobre intereses ganados',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0002',
    description:
      'OTS0002 - Cambio de estado de un Deposito Electrónico: De Activo a Inactivo (temporalidad por definir)',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0003',
    description:
      'OTS0003 - Cambio de estado de un Deposito Electrónico: De Activo a Congelado',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0004',
    description:
      'OTS0004 - Cambio de estado de un Deposito Electrónico: De Inactivo a Cancelado',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0005',
    description:
      'OTS0005 - Cambio de estado de un Deposito Electrónico: De Congelado a Cancelado',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0007',
    description:
      'OTS0007 - Cancelación de un Deposito Electrónico: De activo a Cancelado  por decisión de la Sedpe',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0008',
    description:
      'OTS0008 - Cambio de estado de un Deposito Electrónico: De Congelado a Cancelado',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'OTS0010',
    description:
      'OTS0010 - Cancelación de un Deposito Electrónico: De bloqueado a Cancelado  por decisión de la Sedpe',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'SERV0001',
    description:
      'SERV0001 - Cobro suscripción programa dtos y beneficios convenios',
    roles: [],
    type: '',
    activeFields: '',
  },
  {
    code: 'SERV0001R',
    description:
      'SERV0001R - Reversión Cobro suscripción programa dtos y beneficios convenios con abono (crédito) a Depósitos Electrónicos',
    roles: [
      'MonetaryAdjustment-Capturer',
      'MonetaryAdjustment-Validator',
      'MonetaryAdjustment-Approver',
    ],
    type: 'Crédito',
    activeFields: '',
  },
];
