import { ApiProperty } from '@nestjs/swagger';
import { IFindPeps } from '../interfaces/find-peps.interface';

export class PaginationFindPepsResponse {
  @ApiProperty({
    description: 'Array of peps',
  })
  results: IFindPeps[];

  @ApiProperty({
    example: '50',
    description: 'Total of peps in database',
  })
  total: number;
  @ApiProperty({
    example: '1',
    description: 'Current page, by default 1',
  })
  current_page: number;
  @ApiProperty({
    example: '10',
    description: 'Quantity of peps per page',
  })
  per_page: number;
  @ApiProperty({
    example: '1',
    description: 'Total of pages, starts in 1',
  })
  total_pages: number;

  constructor(peps: any, limit: number, offset: number, count: number) {
    if (Array.isArray(peps)) {
      this.results = peps.slice(offset * limit, +offset * +limit + +limit);
    } else {
      this.results = [];
    }
    this.total = count;
    this.current_page = offset + 1;
    this.per_page = limit === 0 ? count : limit;
    this.total_pages = limit === 0 ? 1 : Math.ceil(count / limit);
  }
}
