import { NetWorkBlock } from './utils';
import { NetWork } from '../../../index';

const XhrOpen = XMLHttpRequest.prototype.open;

export default function XMLHttpRequestFactory(netWork: NetWork) {
  return class XMLHttpRequestPatch extends XMLHttpRequest {
    constructor() {
      super();
    }

    open(method: string, url: string | URL, ...args: any[]) {
      let urlStr = url as string;
      if (url instanceof URL) {
        urlStr = url.toString();
      }

      const block = NetWorkBlock(netWork, urlStr);
      if (block.message) {
        console.error(' XMLHttpRequest.send ', block.message);
      } else {
        //@ts-ignore
        return XhrOpen.call(this, method, url, ...args);
      }
    }
  };
}
