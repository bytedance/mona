import { NetWork } from '../../../index';
import { NetWorkBlock } from './utils';

export default function fetchFactory(netWork: NetWork) {
  return function fetchProxy(input: RequestInfo, options?: RequestInit) {
    const block = NetWorkBlock(netWork, input.toString());
    const canSend = !block.message;

    if (canSend) return window.fetch(input.toString(), options);

    const blob = new Blob();

    const init = {
      status: 404,
      statusText: block.message,
    };

    const response = new Response(blob, init);

    return new Promise(resolve => {
      resolve(response);
    });
  };
}
