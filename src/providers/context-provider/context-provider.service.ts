//Libraries
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';

//Interfaces
import { CertificateStrategy } from './interfaces/certificate-strategy.interface';

//Constants
import { certitificateTypeStrategies } from '../../modules/accounts/constants/api';

//Data Transfer Objects (DTO)
import { HeaderDTO } from '../../shared/models/common-header.dto';
import {
  GetCertificateStrategyDataInputDto,
  GetCertificateStrategyDataResponseDto,
} from '../../modules/accounts/dto/accounts.dto';

//Providers
import { PtsService } from '../pts/pts.service';
import { AccountDbService } from '../../db/accounts/account.service';

//Utils
import { createHeadersStructure } from '../dale/utils/common';

//Error Handling
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../shared/code-errors/error-codes.enum';
import { Logger } from '@dale/logger-nestjs';
import { AdlService } from '../adl/adl.service';
import { ConfigurationService } from '../dale/services/configuration.service';

@Injectable()
export class ContextProviderService {
  constructor(
    private readonly httpService: HttpService,
    private readonly ptsService: PtsService,
    private readonly accountDbService: AccountDbService,
    private readonly logger: Logger,
    private readonly adlService: AdlService,
    private readonly configurationService: ConfigurationService,
  ) {}
  public strategy: CertificateStrategy;
  setStrategy(templateName: string): CertificateStrategy {
    this.strategy = new certitificateTypeStrategies[templateName](
      this.ptsService,
      this.accountDbService,
      this.adlService,
      this.configurationService,
    );
    return this.strategy;
  }
  async generateCertificateData(
    inputData: GetCertificateStrategyDataInputDto,
    headers: HeaderDTO,
  ): Promise<GetCertificateStrategyDataResponseDto> {
    const certificateData = await this.strategy.getInfo(inputData, headers);
    return certificateData;
  }
  async generateCertificate(data: GetCertificateStrategyDataResponseDto) {
    try {
      const url = `${process.env.PDF_GENERATE_SERVICE_URL}/pdfgenerate`;
      const { data: result } = await lastValueFrom(
        this.httpService.post(url, data, {
          headers: createHeadersStructure(),
        }),
      );
      return result;
    } catch (error) {
      this.logger.error('Error generateCertificate', error);
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN023, error);
    }
  }
}
