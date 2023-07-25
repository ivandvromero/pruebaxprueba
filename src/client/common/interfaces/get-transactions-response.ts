import { ApiProperty } from '@nestjs/swagger';
import { ITransaction } from './transaction.interface';

export class PaginationNewTransactionResponse {
  @ApiProperty({
    description: 'Array of adjustments',
  })
  results: ITransaction[];

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

  constructor(
    transactions: ITransaction[],
    limit: number,
    offset: number,
    count: number,
    page: number,
  ) {
    this.results = transactions.slice(
      offset * limit,
      +offset * +limit + +limit,
    );
    this.current_page = page;
    this.per_page = limit === 0 ? count : limit;
  }
}
