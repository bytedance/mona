import { ComponentType, MiniComponentAliasMap } from '@bytedance/mona-shared';

// PickerView->picker-view
export const formatReactNodeName = (key: string) =>
  key.replace(/\.?([A-Z]+)/g, (_, str) => '-' + str.toLowerCase()).replace(/^-/, '');

// PickerView->picker-view
export const formatPropsName = (key: string) => {
  if (key.startsWith('on')) {
    return key.toLowerCase().replace(/^on/, 'bind');
  }
  return key.replace(/\.?([A-Z]+)/g, (_, str) => '-' + str.toLowerCase()).replace(/^-/, '');
};
// PickerView->picker-view->ComponentType压缩后的形式
export const compressNodeName = (key: string) => {
  // TransformJsxNamePlugin babel插件会压缩jsxName,此时key为压缩后的key
  if (MiniComponentAliasMap[key]) {
    return String(key);
  }

  if (key === 'Webview') {
    // webview individualization
    return ComponentType['web-view'];
  }

  return ComponentType[formatReactNodeName(key) as keyof typeof ComponentType];
};
