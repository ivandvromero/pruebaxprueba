import { ApiProperty } from '@nestjs/swagger';
import { FileMassiveMonetaryAdjustment } from '../../repositories/file-monetary-adjustment/massive-monetary-adjustment-file.entity';
import { AdjustmentState } from '../enums/adjustment-state.enum';
import { userLevel } from './user-level';

class GetMassiveAdjustmentsResponse {
  @ApiProperty({
    example: '033613a6-e4b4-4733-97b2-025e8f8df7b6',
    description: 'Unique id of the adjustments file',
  })
  id: string;
  createdAt: Date;
  fileName: string;
  adjustmentState: AdjustmentState;
  verifier: string;
  approver: string;
  comment: string;
  hasError: boolean;
  totalCredit: number;
  totalDebit: number;
  totalRecords: number;

  constructor(fileMassiveMonetaryAdjustment: FileMassiveMonetaryAdjustment) {
    const {
      id,
      createdAt,
      formattedName,
      adjustmentState,
      comment,
      hasError,
      totalCredit,
      totalDebit,
      totalRecords,
      adjustments,
    } = fileMassiveMonetaryAdjustment;

    const [adjustment] = adjustments;

    this.id = id;
    this.createdAt = createdAt;
    this.fileName = formattedName;
    this.adjustmentState = adjustmentState;
    this.verifier =
      adjustment?.updateRegister?.user?.length >= 2
        ? adjustment?.updateRegister.user[
            userLevel['MonetaryAdjustment-Validator']
          ]
        : '';
    this.approver =
      adjustment?.updateRegister?.user?.length >= 3
        ? adjustment?.updateRegister.user[
            userLevel['MonetaryAdjustment-Approver']
          ]
        : '';
    this.comment = comment;
    this.hasError = hasError;
    this.totalCredit = totalCredit;
    this.totalDebit = totalDebit;
    this.totalRecords = totalRecords;
  }
}

export class PaginationMassiveAdjustmentsResponse {
  @ApiProperty({
    type: [GetMassiveAdjustmentsResponse],
    description: 'Array of objects',
  })
  results: GetMassiveAdjustmentsResponse[];
  @ApiProperty({
    example: '50',
    description: 'Total of adjustments in database',
  })
  total: number;
  @ApiProperty({
    example: '1',
    description: 'Current page, by default 1',
  })
  current_page: number;
  @ApiProperty({
    example: '10',
    description: 'Quantity of adjustments per page',
  })
  per_page: number;
  @ApiProperty({
    example: '1',
    description: 'Total of pages, starts in 1',
  })
  total_pages: number;

  constructor(
    files: FileMassiveMonetaryAdjustment[],
    limit: number,
    offset: number,
    count: number,
  ) {
    this.results = files.map(
      (files) => new GetMassiveAdjustmentsResponse(files),
    );
    this.total = count;
    this.current_page = offset + 1;
    this.per_page = limit === 0 ? count : limit;
    this.total_pages = limit === 0 ? 1 : Math.ceil(count / limit);
  }
}
