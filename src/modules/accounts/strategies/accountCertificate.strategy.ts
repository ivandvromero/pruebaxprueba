//Libraries
import { Injectable } from '@nestjs/common';

//Data Transfer Objects (DTO)
import {
  GetCertificateStrategyDataInputDto,
  GetCertificateStrategyDataResponseDto,
} from '../dto/accounts.dto';
import { HeaderDTO } from '../../../shared/models/common-header.dto';

//Interfaces
import { CertificateStrategy } from '../../../providers/context-provider/interfaces/certificate-strategy.interface';

//Providers
import { PtsService } from '../../../providers/pts/pts.service';
import { AdlService } from '../../../providers/adl/adl.service';
import { AccountDbService } from '../../../db/accounts/account.service';
import { ConfigurationService } from '../../../providers/dale/services/configuration.service';

//Constants
import { PTS_BASE_URL, endpointsPTS } from '../constants/api';

//Error Handling
import {
  BadRequestExceptionDale,
  NotFoundExceptionDale,
} from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from '../../../shared/code-errors/error-codes.enum';

@Injectable()
export class AccountCertificateStrategy implements CertificateStrategy {
  constructor(
    private readonly ptsService: PtsService,
    private readonly accountDbService: AccountDbService,
    private readonly adlService: AdlService,
    private readonly configurationService: ConfigurationService,
  ) {}
  async getInfo(
    inputData: GetCertificateStrategyDataInputDto,
    headers: HeaderDTO,
  ): Promise<GetCertificateStrategyDataResponseDto> {
    try {
      const url = `${PTS_BASE_URL}${
        endpointsPTS.LIMITS_ACCUMULATORS +
        'AK-MAMBU-' +
        inputData.accountId +
        '/account-info'
      }`;
      const withBalance = inputData.params.find(
        (element) => element.key === 'withBalance',
      );
      withBalance.value = withBalance.value == 'true';

      const certificateData: GetCertificateStrategyDataResponseDto = {
        templateName: inputData.templateName,
        data: [...inputData.params],
      };
      const fullNameValues = [
        inputData.user.firstName,
        inputData.user.secondName,
        inputData.user.firstSurname,
        inputData.user.secondSurname,
      ];
      const filterFullNameValues = fullNameValues.filter((element) => {
        return element !== undefined && element !== '';
      });
      const holderName = filterFullNameValues.join(' ').toUpperCase();

      if (withBalance.value) {
        const ptsResponse = await this.ptsService.get(url);
        certificateData.data.push({
          key: 'accountBalance',
          value: ptsResponse.messageRS.accountAvailableAmount,
        });
      }

      const userId = inputData.user.id;
      const [account] = await this.accountDbService.getAccountsByUserId(
        userId,
        headers,
      );

      if (!account) {
        throw new NotFoundExceptionDale(
          ErrorCodesEnum.ACN019,
          'No se encontro informacion de la cuenta en la base de datos Account con el userId ingresado',
        );
      }
      const date = new Date(account.updateAt);
      const clientType: string =
        await this.configurationService.getDocumentTypeFullNameById(
          inputData.user.documentType,
        );
      certificateData.data.push(
        {
          key: 'phoneNumber',
          value: inputData.user.phoneNumber,
        },
        {
          key: 'documentType',
          value: clientType,
        },
        {
          key: 'documentNumber',
          value: inputData.user.documentNumber,
        },
        {
          key: 'holderName',
          value: holderName,
        },
        {
          key: 'accountId',
          value: inputData.accountId,
        },
        {
          key: 'accountOpeningDate',
          value: date.valueOf(),
        },
      );
      console.log('certificateData :>> ', certificateData);
      return certificateData;
    } catch (error) {
      if (error instanceof BadRequestExceptionDale) {
        throw new NotFoundExceptionDale(
          ErrorCodesEnum.ACN018,
          'No se encontro informacion de la cuenta en PTS con el accountId ingresado',
        );
      }
      throw error;
    }
  }
}
