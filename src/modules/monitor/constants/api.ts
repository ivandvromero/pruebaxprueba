//Strategies
import { TmaRecibirStrategy } from '../strategies/tma-recibir.strategy';
import { IntrasolutionStrategy } from '../strategies/intrasolution.strategy';
import { TransfiyaEnviarStrategy } from '../strategies/transfiya-enviar.strategy';
import { TransifyaRecibirStrategy } from '../strategies/transfiya-recibir.strategy';
import { TransfiyaReversoStrategy } from '../strategies/transfiya-reverso.strategy';
import { Cell2cellEnviarStrategy } from '../strategies/cell-to-cell-enviar.strategy';
import { IntrasolutionD2D1Strategy } from '../strategies/intrasolution-d2d1.strategy';
import { Cell2cellRecibirStrategy } from '../strategies/cell-to-cell-recibir.strategy';
import { TmaRecibirReversoStrategy } from '../strategies/tma-recibir-reverso.strategy';
import { GeneracionOtpRetiroAtmStrategy } from '../strategies/generacion_otp_retiro_atm.strategy';
import { Cell2cellEnviarReversoStrategy } from '../strategies/cell-to-cell-enviar-reverso.strategy';
import { RetiroAtmOtpReverseCashStrategy } from '../strategies/reverso-retiro-atm.strategy';

export const transactionTypeStrategies = {
  'INT_TRAN_DO_DALE2_PTS_TRANSFER_DO-IT-SCUR': IntrasolutionStrategy,
  EnviarDale2_PTS_WITHDRAW_CASH_OUT: TransfiyaEnviarStrategy,
  RecibirDale2_PTS_DEPOSIT_CASH_IN: TransifyaRecibirStrategy,
  CELL2CELL_CASHOUT_PTS_WITHDRAW_CASH_OUT: Cell2cellEnviarStrategy,
  'EnviarDale2_PTS_REVERSE_CASH-OUT': TransfiyaReversoStrategy,
  'INT_TRAN_DO_D2D1_PTS_TRANSFER_DO-IT-SCUR': IntrasolutionD2D1Strategy,
  CELL2CELL_CASHIN_PTS_DEPOSIT_CASH_IN: Cell2cellRecibirStrategy,
  'CELL2CELL_CASHOUT_PTS_REVERSE_CASH-OUT': Cell2cellEnviarReversoStrategy,
  TMA_CASHIN_PTS_DEPOSIT_CASH_IN: TmaRecibirStrategy,
  Retiro_ATM_OTP_PTS_WITHDRAW_CASH_OUT: GeneracionOtpRetiroAtmStrategy,
  TMA_CASHIN_PTS_REVERSE_CASH_IN: TmaRecibirReversoStrategy,
  'Retiro_ATM_OTP_PTS_REVERSE_CASH-OUT': RetiroAtmOtpReverseCashStrategy,
};
