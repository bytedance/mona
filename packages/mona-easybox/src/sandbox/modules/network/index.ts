import { SandboxOptions } from '@/sandbox';
import fetchFactory from './fetch';
import XMLHttpRequestFactory from './xhr';

export default (options: SandboxOptions) => {
  return {
    fetch: fetchFactory(options.network),
    XMLHttpRequest: XMLHttpRequestFactory(options.network),
  };
};
