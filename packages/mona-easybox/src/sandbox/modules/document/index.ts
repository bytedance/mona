// import { SandboxOptions } from "@/sandbox";
import { bindContext, limitedCreateElementNS, limitedCreateElement } from '@/sandbox/utils';

export default () => {
  const origin = window.document;
  const proxy = new Proxy(origin, {
    get(obj, prop) {
      let value: any;
      //createElementNS
      if (prop === 'createElement') {
        value = limitedCreateElement;
      } else if (prop === 'createElementNS') {
        value = limitedCreateElementNS;
      } else if (prop === 'cookie') {
        value = '';
      } else {
        // do not pass reciver, or will cause wrong point Uncaught TypeError: Illegal invocation
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
