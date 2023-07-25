import { Injectable } from '@nestjs/common';
import { PepsRepository } from '../../repository/peps.repository';
import { PepStatus } from '../../shared/enums/pep-status.enum';

@Injectable()
export class HistoricalPepsService {
  constructor(private readonly repository: PepsRepository) {}

  run(statusLevel: number, status: PepStatus) {
    return this.repository.findHistorical(statusLevel, status);
  }
}
