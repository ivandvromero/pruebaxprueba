import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AxiosAdapter } from '../http-adapters/axios-adapter';
import { endpoints } from './constants/api';
import { DepositResponseCRMByPartyNumber } from './interfaces';
import { CardResponseCRMByContactRelated } from './interfaces/cards-response.interface';
import { NaturalResponseByParamsCRM } from './interfaces/natural-person-response.interface';

@Injectable()
export class CRMConnector {
  constructor(
    private readonly configService: ConfigService,
    private readonly http: AxiosAdapter,
  ) {}

  private auth = {
    username: this.configService.get('config.crm.username'),
    password: this.configService.get('config.crm.password'),
  };

  private rootPath = this.configService.get('config.crm.url');

  async getNaturalPersonByParams(
    param: string,
  ): Promise<NaturalResponseByParamsCRM> {
    const url = `${this.rootPath}${endpoints.CLIENT}${param}`;
    const clientData = await this.http.get<NaturalResponseByParamsCRM>(
      url,
      undefined,
      undefined,
      this.auth,
    );
    return clientData;
  }

  async getCards(partyId: string): Promise<CardResponseCRMByContactRelated> {
    const url = `${this.rootPath}${endpoints.CARD}?q=dl_Contacto_Id_c='${partyId}'`;
    const cardData = await this.http.get<CardResponseCRMByContactRelated>(
      url,
      undefined,
      undefined,
      this.auth,
    );
    return cardData;
  }

  async getDeposits(param: string): Promise<DepositResponseCRMByPartyNumber> {
    const url = `${this.rootPath}${endpoints.DEPOSITS}${param}`;
    const deposits = await this.http.get<DepositResponseCRMByPartyNumber>(
      url,
      undefined,
      undefined,
      this.auth,
    );
    return deposits;
  }
}
