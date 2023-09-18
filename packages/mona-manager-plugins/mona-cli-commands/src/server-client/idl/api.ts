/* eslint-disable */
import opFetch from './request';

export class OpenSpiService {
  uriPrefix: string = 'https://lgw.jinritemai.com';
  constructor() {}

  GetInvokeRequestForLightApp(req: any, headers: any) {
    const uri = `${this.uriPrefix}/local/debug/invoke/request`;
    const body = req;
    return opFetch(uri, { method: 'POST', headers, body });
  }

  GetInvokeResponseForLightApp(req: any, headers: any) {
    const uri = `${this.uriPrefix}/local/debug/invoke/response`;
    const body = req;
    return opFetch(uri, { method: 'POST', headers, body });
  }
}

export const openSpiServiceClient = new OpenSpiService();
