import { ComponentType, ComponentAliasMap } from '@bytedance/mona-shared';

// PickerView->picker-view->ComponentType压缩后的形式
export const transformNodeName = (key: string) => {
  // CompressNodeType babel插件会压缩jsxName,此时key为压缩后的key
  if (ComponentAliasMap[key]) {
    return String(key);
  }

  if (key === 'Webview') {
    // webview 单独处理，或者写一个map
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
