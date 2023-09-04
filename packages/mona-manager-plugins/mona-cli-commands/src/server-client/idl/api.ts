/* eslint-disable */
import opFetch from './request';

import * as base from './base';
export { base };

export class OpenSpiService {
  uriPrefix: string = 'https://lgw.jinritemai.com';
  constructor() {}

  GetInvokeRequestForLightApp(req: any, headers: any) {
    const uri = `${this.uriPrefix}/localhost/invoke/request`;
    const body = req;
    return opFetch(uri, { method: 'POST', headers, body });
  }

  GetInvokeResponseForLightApp(req: any, headers: any) {
    const uri = `${this.uriPrefix}/localhost/invoke/response`;
    const body = req;
    return opFetch(uri, { method: 'POST', headers, body });
  }
}

export const openSpiServiceClient = new OpenSpiService();
