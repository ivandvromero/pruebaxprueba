import { Injectable, Inject, CACHE_MANAGER } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { HttpService } from '@nestjs/axios';
import { lastValueFrom } from 'rxjs';
import {
  AccountStatuses,
  CreateAccountServiceResponse,
  AccountDetailsByClientIdResponse,
  AccountDetailsByAccountIdResponse,
  AccountNumbersByClientIdResponse,
} from '../../modules/accounts/dto/accounts.dto';
import {
  accountDetailsSchema,
  accountDetailsByAccountIdResponseSchema,
} from '../../modules/accounts/constants/schema';
import { accountConfig } from './config/account-config';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const objectMapper = require('object-mapper');
import {
  endpoints,
  MAMBU_URL,
  MAMBU_ACCEPT,
  MAMBU_API_KEY,
} from './constants/api';
import { clientStateEnum } from 'src/shared/enums/crm-enum';

@Injectable()
export class MambuService {
  constructor(
    private httpService: HttpService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async createAccount(
    clientId: string,
    productId: string,
    accountType: string,
    accountName: string,
    uniqueRequestId?: string,
  ): Promise<CreateAccountServiceResponse> {
    const header = {
      Accept: MAMBU_ACCEPT,
      apikey: MAMBU_API_KEY,
    };
    if (uniqueRequestId) {
      header['Idempotency-Key'] = uniqueRequestId;
    }
    // create current account in Mambu
    const { data: response } = await lastValueFrom(
      this.httpService.post(
        `${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}`,
        {
          accountHolderKey: clientId,
          productTypeKey: productId,
          accountType,
          name: accountName,
          ...accountConfig,
        },
        {
          headers: header,
        },
      ),
    );
    await this.cacheManager.del(`${clientId}_existing_accounts`);
    return objectMapper(response, accountDetailsSchema);
  }

  async accountDetailsByClientId(
    clientId: string,
    accountState?: AccountStatuses,
  ): Promise<AccountDetailsByClientIdResponse[]> {
    const { data: response } = await lastValueFrom(
      this.httpService.get(`${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}`, {
        headers: {
          Accept: MAMBU_ACCEPT,
          apikey: MAMBU_API_KEY,
        },
        params: {
          accountHolderId: clientId,
          accountHolderType: accountConfig.accountHolderType,
          accountState,
        },
      }),
    );
    return response.map((accountDetails) =>
      objectMapper(accountDetails, accountDetailsSchema),
    );
  }

  async accountNumbersByClientId(
    clientId: string,
  ): Promise<AccountNumbersByClientIdResponse> {
    const { data: response } = await lastValueFrom(
      this.httpService.get(`${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}`, {
        headers: {
          Accept: MAMBU_ACCEPT,
          apikey: MAMBU_API_KEY,
        },
        params: {
          accountHolderId: clientId,
          accountHolderType: accountConfig.accountHolderType,
        },
      }),
    );
    const existingAccounts = response.map(
      (accountDetails) => accountDetails.id,
    );
    return { accountNumbers: existingAccounts };
  }

  async accountDetailsByAccountId(
    accountId: string,
  ): Promise<AccountDetailsByAccountIdResponse> {
    const { data: response } = await lastValueFrom(
      this.httpService.get(
        `${MAMBU_URL}${endpoints.DEPOSIT_ACCOUNT}/${accountId}`,
        {
          headers: {
            Accept: MAMBU_ACCEPT,
            apikey: MAMBU_API_KEY,
          },
        },
      ),
    );
    return objectMapper(response, accountDetailsByAccountIdResponseSchema);
  }

  async actualizarDepositoMAMBU(
    accountDeposit: number,
    state: clientStateEnum,
  ): Promise<any> {
    let param;
    if (state === clientStateEnum.BLOQUEADO) {
      param = `deposit-accounts-changestate`;
    } else if (state === clientStateEnum.CONGELADO) {
      param = `deposit-accounts-createblockfund`;
    }
    const { data: response } = await lastValueFrom(
      this.httpService.get(`${MAMBU_URL}${param}`, {
        headers: {
          Accept: MAMBU_ACCEPT,
          apikey: MAMBU_API_KEY,
        },
      }),
    );
    return response;
  }
}
