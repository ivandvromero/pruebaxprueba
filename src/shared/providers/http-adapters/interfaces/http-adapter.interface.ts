import { AxiosResponse } from 'axios';

export interface IHttpAdapter {
  get<T>(url: string, headers?: any, params?: any, auth?: any): Promise<T>;
  post<T>(url: string, headers: any, body: any, auth?: any): Promise<T>;
  postMambu(
    url: string,
    headers: any,
    body: any,
    auth?: any,
  ): Promise<AxiosResponse>;
}
