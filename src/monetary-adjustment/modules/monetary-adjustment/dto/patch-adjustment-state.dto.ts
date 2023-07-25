import { IsIn, IsNotEmpty, IsString } from 'class-validator';
import { AdjustmentState } from '../../../shared/enums/adjustment-state.enum';
import { ApiProperty } from '@nestjs/swagger';

export class PatchAdjustmentStateDTO {
  @IsNotEmpty()
  @IsString()
  @IsIn([
    AdjustmentState.PENDING,
    AdjustmentState.ACCEPTED,
    AdjustmentState.REJECTED,
    AdjustmentState.FAILED,
  ])
  @ApiProperty({
    example: 'PENDING',
    description: 'monetary adjustment status',
  })
  adjustmentState: AdjustmentState;
}
