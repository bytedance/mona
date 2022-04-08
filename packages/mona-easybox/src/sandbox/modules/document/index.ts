// proxy document to ban document.cookie and document.title
import Sandbox from '@/sandbox';
import { bindContext, limitedCreateElementNS, limitedCreateElement } from '@/sandbox/utils';

export default (sandbox: Sandbox) => {
  const { options } = sandbox;
  const origin = window.document;
  //@ts-ignore
  const limitedCreateElementWrapper = (...args: any[]) => limitedCreateElement(sandbox, ...args);
  //@ts-ignore
  const limitedCreateElementNSWrapper = (...args: any[]) => limitedCreateElementNS(sandbox, ...args);

  const proxy = new Proxy(origin, {
    get(obj, prop) {
      let value: any;
      switch (prop) {
        case 'body':
          return options.domGetter;
        // case 'location':
        //   return ;
        // case 'defaultView':
        //   return ;
        case 'write':
        case 'writeln':
          return () => {};
        case 'createElement':
          return limitedCreateElementWrapper;
        case 'createElementNS':
          return limitedCreateElementNSWrapper;
        case 'cookie':
          value = '';
          break;
        default:
          value = Reflect.get(obj, prop);
      }
      return bindContext(value, origin);
    },
    set(obj, prop, value, receiver) {
      if (prop === 'title') {
        // console.warn("can't set title in app");
        return true;
      } else if (prop === 'cookie') {
        // console.warn("can't set cookie in app");
        return true;
      }
      return Reflect.set(obj, prop, value, receiver);
    },
  });

  const FakeDocument = function () {
    return proxy;
  };

  return {
    document: proxy,
    Document: FakeDocument,
  };
};
