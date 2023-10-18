/* eslint-disable */
import opFetch from './request';

export class OpenSpiService {
  uriPrefix: string = 'https://lgw.jinritemai.com';
  constructor() {}

  GetInvokeRequestForLightApp(req: any, headers: any, opts?: any) {
    const uri = `${this.uriPrefix}/local/debug/invoke/request`;
    const body = req;
    return opFetch(uri, { method: 'POST', headers, body }, opts);
  }

  GetInvokeResponseForLightApp(req: any, headers: any, opts?: any) {
    const uri = `${this.uriPrefix}/local/debug/invoke/response`;
    const body = req;
    return opFetch(uri, { method: 'POST', headers, body }, opts);
  }
}

export const openSpiServiceClient = new OpenSpiService();
