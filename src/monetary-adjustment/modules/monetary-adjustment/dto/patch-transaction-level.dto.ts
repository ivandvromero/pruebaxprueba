import { IsIn, IsNotEmpty, IsNumber, IsPositive } from 'class-validator';
import { TransactionLevel } from '../../../shared/enums/transaction-level.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PatchTransactionLevelDTO {
  @IsNotEmpty()
  @IsNumber()
  @IsPositive()
  @IsIn([TransactionLevel.UNO, TransactionLevel.DOS, TransactionLevel.TRES])
  @ApiProperty({
    example: 2,
    description: 'transaction level, can be 1, 2 or null',
  })
  newTransactionLevel: number;
}
