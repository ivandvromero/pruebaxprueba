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
import { AccountDbService } from '../../../db/accounts/account.service';
import { AdlService } from '../../../providers/adl/adl.service';

//Constants
import {
  transformationsForTableFields,
  statementsTableHeaders,
} from '../constants/strategies';

//Error Handling
import { InternalServerExceptionDale } from '@dale/manage-errors-nestjs';
import { ErrorCodesEnum } from 'src/shared/code-errors/error-codes.enum';

@Injectable()
export class AccountStatementsStrategy implements CertificateStrategy {
  constructor(
    private readonly ptsService: PtsService,
    private readonly accountDbService: AccountDbService,
    private readonly adlService: AdlService,
  ) {}
  async getInfo(
    requestData: GetCertificateStrategyDataInputDto,
    headers: HeaderDTO,
  ): Promise<GetCertificateStrategyDataResponseDto> {
    const joinNames = [
      requestData.user.firstName,
      requestData.user.secondName,
      requestData.user.firstSurname,
      requestData.user.secondSurname,
    ];
    const names = joinNames.join(' ').split('  ').join(' ').toUpperCase(); // Replace 2 spaces with 1 when a name is missing
    const data = await this.getValues();
    const templateData: GetCertificateStrategyDataResponseDto = {
      templateName: requestData.templateName,
      data: [
        ...requestData.params,
        {
          key: 'names',
          value: names,
        },
        {
          key: 'initial_balance',
          value: Number(data.Summary.BalanceInitial),
        },
        {
          key: 'final_balance',
          value: data.Summary.BalanceFinal,
        },
        {
          key: 'total_payments',
          value: data.Summary.TotalAbonos,
        },
        {
          key: 'total_charges',
          value: data.Summary.TotalCharges,
        },
        {
          key: 'total_commission',
          value: data.Summary.TotalCommission,
        },
        {
          key: 'total_iva',
          value: data.Summary.TotalIVA,
        },
        {
          key: 'total_gmf',
          value: data.Summary.TotalGMF,
        },
        {
          key: 'total_holding',
          value: data.Summary.TotalRetention,
        },
        {
          key: 'interest_rate',
          value: 0,
        },
        {
          key: 'TableHead',
          value: statementsTableHeaders,
        },
        {
          key: 'TableBody',
          value: transformationsForTableFields(data.Details),
        },
      ],
    };

    return templateData;
  }
  async getValues() {
    // (userId, accountId, year, month) // these fields are in the requestData.params
    try {
      const informartionRequest = {
        unique_id: 'mi_postman_32',
        job: 'trx',
        DocumentNumber: '555556655555', // userId,
        AccountNumber: '2000207', // accountId,
        StartDate: '2023-05-16', // (new Date(year, month + 1, 1)).toISOString().split('T')[0] // First day of the month
        EndDate: '2023-05-23', // (new Date(year, month + 1, 0)).toISOString().split('T')[0] // Last day of the month
      };
      return (await this.adlService.checkTrx(informartionRequest)).response;
    } catch (error) {
      throw new InternalServerExceptionDale(ErrorCodesEnum.ACN024, error);
    }
  }
}
