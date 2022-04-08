import Sandbox from '@/sandbox';
import fetchFactory from './fetch';
import XMLHttpRequestFactory from './xhr';

export default (sandbox: Sandbox) => {
  const { options } = sandbox;
  return {
    fetch: fetchFactory(options.network),
    XMLHttpRequest: XMLHttpRequestFactory(options.network),
  };
};
