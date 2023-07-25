import { ApiProperty } from '@nestjs/swagger';
import { ITransactionChanel } from '../../common/interfaces/transaction-chanel.interface';

export class TransactionChannelDto implements ITransactionChanel {
  @ApiProperty({
    example: 'COU0001',
    description: 'Transaction channel Id',
  })
  id: string;

  @ApiProperty({
    example:
      'COU0001 - Transferencia: Con cargo (Débito) a un Deposito Electrónico y abono a cuentas Aval',
    description: 'Transaction channel description',
  })
  description: string;
}
