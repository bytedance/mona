import { ComponentType } from '@bytedance/mona-shared';
// 无需渲染子节点的元素
export const noChildElements = new Set([
  ComponentType['progress'],
  ComponentType['icon'],
  ComponentType['rich-text'],
  ComponentType['input'],
  ComponentType['textarea'],
  ComponentType['slider'],
  ComponentType['switch'],
  ComponentType['camera'],
  ComponentType['live-player'],
  ComponentType['video'],
  ComponentType['image'],
  ComponentType['canvas'],
  ComponentType['map'],
  ComponentType['ad'],
  ComponentType['open-data'],
  ComponentType['web-view'],
  ComponentType['ptext'],
]);
