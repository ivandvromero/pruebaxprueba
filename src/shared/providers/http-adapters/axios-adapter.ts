import { Injectable } from '@nestjs/common';
import axios, { AxiosBasicCredentials, AxiosResponse } from 'axios';
import { IHttpAdapter } from '../../../shared/providers/http-adapters/interfaces/http-adapter.interface';
import { BadRequestException } from '@dale/exceptions//custom-errors/custom-exception';
import { ErrorCodesEnum } from '@dale/exceptions//code-errors/error-codes.enum';

@Injectable()
export class AxiosAdapter implements IHttpAdapter {
  async get<T>(
    url: string,
    headers?: object,
    params?: object,
    auth?: AxiosBasicCredentials,
  ): Promise<T> {
    try {
      const options = {
        headers: headers,
        params: params,
        auth: auth,
      };
      const data = await axios.get(url, options);
      return data.data;
    } catch (error) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS018,
        'Petición realizada con parámetros incorrectos',
      );
    }
  }
  async post<T>(
    url: string,
    headers?: object,
    body?: any,
    params?: object,
    auth?: any,
  ): Promise<T> {
    try {
      const options = {
        headers: headers,
        params: params,
        auth: auth,
      };
      const { data } = await axios.post(url, body, options);
      return data;
    } catch (error) {
      throw new Error(JSON.stringify(error.response.data));
    }
  }

  async postMambu(
    url: string,
    headers?: object,
    body?: any,
    params?: object,
    auth?: any,
  ): Promise<AxiosResponse> {
    try {
      const options = {
        headers: headers,
        params: params,
        auth: auth,
      };
      return await axios.post(url, body, options);
    } catch (error) {
      throw new BadRequestException(
        ErrorCodesEnum.BOS018,
        'Petición realizada con parámetros incorrectos',
      );
    }
  }
}
