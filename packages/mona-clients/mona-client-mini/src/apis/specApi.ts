import { promisify } from '@bytedance/mona-shared';
export const mini = new Proxy(
  {},
  {
    get: (_: any, prop: string) => {
      if (!tt) {
        return console.log('当前非小程序环境，不可使用');
      } else if (!tt[prop] || typeof tt[prop] !== 'function') {
        return console.log(`当前小程序环境尚未实现${prop}方法`);
      } else if (prop.toLowerCase().endsWith('sync')) {
        return tt[prop];
      } else {
        return promisify(tt[prop]);
      }
    },
    set: () => false,
  },
);
