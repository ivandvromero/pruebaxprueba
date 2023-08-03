import {
  GetCertificateStrategyDataInputDto,
  GetCertificateStrategyDataResponseDto,
} from '../../../modules/accounts/dto/accounts.dto';
import { HeaderDTO } from '../../../shared/models/common-header.dto';

export interface CertificateStrategy {
  getInfo(
    inputData: GetCertificateStrategyDataInputDto,
    headers: HeaderDTO,
  ): Promise<GetCertificateStrategyDataResponseDto>;
}
