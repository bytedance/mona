import { ComponentType } from '@bytedance/mona-shared';
// 转为xx-xx的形式
export const transformNodeName = (key: string) => {
  // webview 单独处理，或者写一个map
  if (key === 'Webview') {
    return ComponentType['web-view'];
  }

  let styleValue = key.replace(/\.?([A-Z]+)/g, function (_x, y) {
    return '-' + y.toLowerCase();
  });

  if (styleValue.startsWith('-')) {
    styleValue = styleValue.replace(/^-/, '');
  }

  //@ts-ignore
  return ComponentType[styleValue];
};
