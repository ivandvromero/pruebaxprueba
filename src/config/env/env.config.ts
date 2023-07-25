import * as dotenv from 'dotenv';
import * as path from 'path';
import * as fs from 'fs';

const filename = process.env.NODE_ENV === 'test' ? 'test.env' : 'dev.env';
const tsPath = path.resolve(__dirname, `../../../${filename}`);
const jsPath = path.resolve(__dirname, `../../../../${filename}`);
dotenv.config({ path: fs.existsSync(tsPath) ? tsPath : jsPath });

const SECRET_CONFIG = {
  documentation: 'SECRET_DOC_CONFIG',
  api: 'SECRET_CONFIG',
};

const setupEnvConfig = () => {
  switch (
    process.env.CLOUD_SERVICE_PROVIDER &&
    process.env.CLOUD_SERVICE_PROVIDER.toUpperCase()
  ) {
    case 'AWS':
      return (process.env = {
        ...process.env,
        ...(SECRET_CONFIG[process.env.SERVICE_TYPE] &&
        process.env[SECRET_CONFIG[process.env.SERVICE_TYPE]]
          ? JSON.parse(process.env[SECRET_CONFIG[process.env.SERVICE_TYPE]])
          : {}),
      });
    case 'AZURE':
      return process.env;
    default:
      return process.env;
  }
};
export const enviroments = {
  dev: '.env',
  stag: '.stag.env',
  prod: '.prod.env',
};
// setup env variables for secret config as per the environment
setupEnvConfig();

export enum TypeTransactionEvent {
  INT_TRAN_DO_DALE2 = 'INT_TRAN_DO_DALE2',
  EnviarDale2 = 'EnviarDale2.RecibirDale2_PTS_DEPOSIT_CASH_IN',
  EnviarDale2Reverse = 'RecibirDale2_PTS_DEPOSIT_CASH_IN',
  RecibirDale2 = 'RecibirDale2',
  Retiro_ATM_OTP = 'Retiro_ATM_OTP',
  Cell2CellHost = 'Cell2CellHost',
}
export enum TypeTransactionPts {
  INT_TRAN_DO_DALE2 = '3',
  RecibirDale2 = 'A5',
  EnviarDale2 = 'B3',
  Retiro_ATM_OTP = 'A0',
  Cell2CellEnviar = 'X5',
  Cell2CellRecibir = 'X2',
}
export enum TypeTransactionEventLog {
  INT_TRAN_DO_DALE2 = 'intrasolucion',
  EnviarDale2 = 'transfiya',
  RecibirDale2 = 'transfiya',
  Retiro_ATM_OTP = 'retiro_atm_otp',
  Retiro_ATM_OTP_GIROS = 'retiro_atm_otp_giros',
  RETIRO_CB = 'retiro_cb_otp',
  CELL2CELL_CASHIN = 'celltocell',
  CELL2CELL_CASHOUT = 'celltocell',
  INT_TRAN_DO_D2D1 = 'intrasolucion_dale_2_dale_1',
  TMA_CASHIN = 'tma',
  INTRAD1D2_CASHIN = 'intrasolucion_dale_1_dale_2',
  'PSE-Recarga' = 'pse_recargas',
  PANEL_ADM_CASHOUT = 'ajustes_montarios',
  PANEL_ADM_CASHIN = 'ajustes_monetarios',
  RecargaCB = 'cashin_cb',
  Pagos_PSE = 'pse_pagos',
}
