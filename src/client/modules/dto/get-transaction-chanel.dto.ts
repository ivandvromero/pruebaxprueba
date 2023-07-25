import { ApiProperty } from '@nestjs/swagger';
import { TransactionChannelDto } from './transaction-chanel.dto';

export class GetTransactionChannelDto {
  @ApiProperty({
    example: [
      {
        id: 'COU0001',
        description:
          'COU0001 - Transferencia: Con cargo (Débito) a un Deposito Electrónico y abono a cuentas Aval',
      },
      {
        id: 'COU0002',
        description:
          'COU0002 - Transferencia: Con cargo a un Deposito Electrónico y abono a cuentas entidades NO Aval',
      },
    ],
    description: 'Transaction channels available in mambu',
  })
  transactionChannel: TransactionChannelDto[];
}
