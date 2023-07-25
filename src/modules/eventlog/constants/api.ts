import { RetiroAtmOtpEventLogStrategy } from '../strategies/retiro_otp.strategy';
import { Cell2CellCashInEventLogStrategy } from '../strategies/c2c-cashin.strategy';
import { IntrasolutionAndReverseEventLogStrategy } from '../strategies/intrasolution-and-reverse.strategy';
import { Cell2CellCashOutEventLogStrategy } from '../strategies/c2c-cashout.strategy';
import { TransifyaEnviarEventLogStrategy } from '../strategies/transfiya-enviar.strategy';
import { TransifyaRecibirEventLogStrategy } from '../strategies/transfiya-recibir.strategy';
import { RetiroAtmOtpReveseEventLogStrategy } from '../strategies/retiro_otp_reverse.strategy';
import { TransifyaEnviarReverseEventLogStrategy } from '../strategies/transfiya-enviar-reverse.strategy';
import { Cell2CellCashOutReverseEventLogStrategy } from '../strategies/c2c-cashout-reverse.strategy';
import { IntrasolutionD2D1AndReverseEventLogStrategy } from '../strategies/instrasolution-d2d1-and-reverse.strategy';
import { TMARecibirEventLogStrategy } from '../strategies/tma-recibir.strategy';
import { IntrasolutionD1D2EventLogStrategy } from '../strategies/instrasolution-d1d2.strategy';
import { CashinPseStrategy } from '../strategies/cashin-pse-strategy';
import { TMACashInReverseEventLogStrategy } from '../strategies/tma-cashin-reverse.strategy';
import { PanelAdminDepositEventLogStrategy } from '../strategies/panel-admin-deposit.strategy';
import { PanelAdminWithdrawEventLogStrategy } from '../strategies/panel-admin-withdraw.strategy';
import { RecargaCbEventLogStrategy } from '../strategies/recarga_cb.strategy';
import { RecargaCbReverseEventLogStrategy } from '../strategies/recarga_cb_reverse.strategy';
import { RetiroCbOtpEventLogStrategy } from '../strategies/retiro_otp_cb.strategy';
import { RetiroCbOtpReverseEventLogStrategy } from '../strategies/retiro_otp_cb_reverse.strategy';
import { PsePaymentEventLogStrategy } from '../strategies/pse-payment.strategy';

export const transactionEventLogTypeStrategies = {
  'INT_TRAN_DO_DALE2_PTS_TRANSFER_DO-IT-SCUR': {
    strategy: IntrasolutionAndReverseEventLogStrategy,
    typeOperator: ['debit', 'credit'],
  },
  EnviarDale2_PTS_WITHDRAW_CASH_OUT: {
    strategy: TransifyaEnviarEventLogStrategy,
    typeOperator: ['debit'],
  },
  'EnviarDale2_PTS_REVERSE_CASH-OUT': {
    strategy: TransifyaEnviarReverseEventLogStrategy,
    typeOperator: ['credit'],
  },
  RecibirDale2_PTS_DEPOSIT_CASH_IN: {
    strategy: TransifyaRecibirEventLogStrategy,
    typeOperator: ['credit'],
  },
  Retiro_ATM_OTP_PTS_WITHDRAW_CASH_OUT: {
    strategy: RetiroAtmOtpEventLogStrategy,
    typeOperator: ['debit'],
  },
  'Retiro_ATM_OTP_PTS_REVERSE_CASH-OUT': {
    strategy: RetiroAtmOtpReveseEventLogStrategy,
    typeOperator: ['credit'],
  },
  CELL2CELL_CASHIN_PTS_DEPOSIT_CASH_IN: {
    strategy: Cell2CellCashInEventLogStrategy,
    typeOperator: ['credit'],
  },
  CELL2CELL_CASHOUT_PTS_WITHDRAW_CASH_OUT: {
    strategy: Cell2CellCashOutEventLogStrategy,
    typeOperator: ['debit'],
  },
  'CELL2CELL_CASHOUT_PTS_REVERSE_CASH-OUT': {
    strategy: Cell2CellCashOutReverseEventLogStrategy,
    typeOperator: ['credit'],
  },
  'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR': {
    strategy: IntrasolutionD2D1AndReverseEventLogStrategy,
    typeOperator: ['debit', 'credit'],
  },
  TMA_CASHIN_PTS_DEPOSIT_CASH_IN: {
    strategy: TMARecibirEventLogStrategy,
    typeOperator: ['credit'],
  },
  TMA_CASHIN_PTS_REVERSE_CASH_IN: {
    strategy: TMACashInReverseEventLogStrategy,
    typeOperator: ['debit'],
  },
  INTRAD1D2_CASHIN_PTS_DEPOSIT_CASH_IN: {
    strategy: IntrasolutionD1D2EventLogStrategy,
    typeOperator: ['credit'],
  },
  'PSE-Recarga_PTS_DEPOSIT_CASH_IN': {
    strategy: CashinPseStrategy,
    typeOperator: ['credit'],
  },
  PANEL_ADM_CASHIN_PTS_DEPOSIT_CASH_IN: {
    strategy: PanelAdminDepositEventLogStrategy,
    typeOperator: ['credit'],
  },
  PANEL_ADM_CASHOUT_PTS_WITHDRAW_CASH_OUT: {
    strategy: PanelAdminWithdrawEventLogStrategy,
    typeOperator: ['debit'],
  },
  RecargaCB_PTS_DEPOSIT_CASH_IN: {
    strategy: RecargaCbEventLogStrategy,
    typeOperator: ['credit'],
  },
  RecargaCB_PTS_REVERSE_CASH_IN: {
    strategy: RecargaCbReverseEventLogStrategy,
    typeOperator: ['debit'],
  },
  RETIRO_CB_PTS_WITHDRAW_CASH_OUT: {
    strategy: RetiroCbOtpEventLogStrategy,
    typeOperator: ['debit'],
  },
  'RETIRO_CB_PTS_REVERSE_CASH-OUT': {
    strategy: RetiroCbOtpReverseEventLogStrategy,
    typeOperator: ['credit'],
  },
  Pagos_PSE_PTS_WITHDRAW_CASH_OUT: {
    strategy: PsePaymentEventLogStrategy,
    typeOperator: ['debit'],
  },
};
export const providerNameADL = 'ADL';

export const credit_ordinals = ['120', '130', '140', '150'];

export const strategiesWithReverse = [
  'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR',
  'INT_TRAN_DO_DALE2_PTS_TRANSFER_DO-IT-SCUR',
];
