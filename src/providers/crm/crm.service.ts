import { HttpService } from '@nestjs/axios';
import { Inject, Injectable } from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import {
  CRM_BASE_URL,
  CRM_PASS_LOGIN,
  CRM_USER_LOGIN,
  endpointsCRM,
} from './constants/api';
import { Logger } from '@dale/logger-nestjs';
import { ConsultarCRMDTO } from './dto/consultar/crmConsulRequest.dto';
import { plainToInstance } from 'class-transformer';
import { DepositResponseCRM } from './dto/actualizar/crmActualResponse.dto';
import { ClientProxy } from '@nestjs/microservices';

@Injectable()
export class ServiceCRM {
  constructor(
    private httpService: HttpService,
    private logger: Logger,
    @Inject('KAFKA_CLIENT') private kafkaService: ClientProxy,
  ) {}

  async consultElectronicDeposit(
    params: ConsultarCRMDTO,
  ): Promise<DepositResponseCRM> {
    try {
      let param: any = undefined;
      const auth = {
        username: CRM_USER_LOGIN,
        password: CRM_PASS_LOGIN,
      };
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      if (params?.depositNumber && params?.identification)
        param = `q=dl_NumeroDeDeposito_c=${params.depositNumber}&q=dl_Contacto_Id_c=${params.identification}`;
      else {
        this.logger.error('Error');
      }
      const url = `${CRM_BASE_URL}${endpointsCRM.CONSULT_ELECTRONIC_DEPOSIT}?${param}`;
      const { data: response } = await lastValueFrom(
        this.httpService.get(url, { auth: auth }),
      );
      this.logger.log('Response CRM OK consult elctronic deposit');
      let transformObj: DepositResponseCRM = null;
      transformObj = plainToInstance(DepositResponseCRM, response);
      return transformObj;
    } catch (error) {
      this.logger.error('error generateToken', error);
    }
  }

  async updateElectronicDeposit(
    params: DepositResponseCRM,
  ): Promise<DepositResponseCRM> {
    try {
      const auth = {
        username: CRM_USER_LOGIN,
        password: CRM_PASS_LOGIN,
      };
      process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';
      //Filtrar por fecha si viene mas de un objeto
      if (params.items.length > 0) {
        params.items = params.items.sort((a, b) => {
          const dateA = new Date(a.dl_Fecha_De_Creacion_c).getTime();
          const dateB = new Date(b.dl_Fecha_De_Creacion_c).getTime();
          return dateB - dateA;
        });
      }

      const body = {
        dl_Contacto_Id_c: params.items[0].dl_Contacto_Id_c,
        dl_cambio_estado_c: params.items[0].dl_cambio_estado_c,
        dl_razon_c_estado_c: params.items[0].dl_razon_c_estado_c,
        dl_estado_deposito2_c: params.items[0].dl_estado_deposito2_c,
        dl_responsable_deposito_c: params.items[0].dl_responsable_deposito_c,
      };
      const url = `${CRM_BASE_URL}${endpointsCRM.CONSULT_ELECTRONIC_DEPOSIT}/${params.items[0].Id}`;

      let { data: response } = await lastValueFrom(
        this.httpService.patch(url, body, { auth: auth }),
      );
      this.logger.log('Response uno patch Electronic deposit', response);
      response = plainToInstance(DepositResponseCRM, response);
      return response;
    } catch (error) {
      console.log('error generateToken', error);
    }
  }
}
