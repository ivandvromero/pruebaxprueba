import { Injectable } from '@nestjs/common';
import { pepsWithPendingStatus } from '../../shared/mocks/peps-with-pending';
import { PepsRepository } from '../../repository/peps.repository';
import { PaginationFindPepsResponse } from '../../shared/pagination/find-peps-pagination-response';
import { IFindPepsDto } from '../../shared/interfaces/find-peps-dto.interface';
@Injectable()
export class FindPepsWithPendingService {
  private pepsWithPendingStatus = pepsWithPendingStatus;
  constructor(private readonly repository: PepsRepository) {}

  async run(query: IFindPepsDto): Promise<PaginationFindPepsResponse> {
    const peps =
      query.statusLevel === 1
        ? this.pepsWithPendingStatus
        : await this.repository.findHistorical(query.statusLevel, query.status);
    const length = peps.length;
    const paginationResponse = new PaginationFindPepsResponse(
      peps,
      query.limit,
      query.offset,
      length,
    );
    return paginationResponse;
  }
}
