import { baseComponentPropsMap } from '../components/prop';
import { isEventName } from '../utils/utils';
export function updateProps(props: Record<string, any>) {
  let key: string;
  const newProps: Record<string, any> = {};
  for (key in props) {
    if (key === 'key' || key === 'children' || key === 'ref') {
    } else if (isEventName(key)) {
      processEvent(newProps, key, props[key]);
    } else if (key === 'style') {
      newProps[key] = props[key] || '';
    } else {
      newProps[key] = props[key];
    }
  }
  return newProps;
}

/**
 * TODO: 1. 支持支持stopPropagation
 * 2. 事件名称处理，优化为编译时
 */
export function processEvent(obj: Record<string, any>, event: string, callback: any) {
  if (BUBBLE_EVENTS.includes(event)) {
    //优化为编译时
    obj[baseComponentPropsMap[event]] = callback;
  } else {
    obj[event] = callback;
  }
}

export const BUBBLE_EVENTS = [
  'onClick',
  'onTap',
  'onLongPress',
  'onLongTap',
  'onTouchStart',
  'onTouchMove',
  'onTouchEnd',
  'onTouchcancel',
  'onTransitionEnd',
  'onAnimationStart',
  'onAnimationIteration',
  'onAnimationEnd',
];
