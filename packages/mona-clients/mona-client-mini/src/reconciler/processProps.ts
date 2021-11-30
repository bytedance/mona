import { CALLBACK_SYMBOL } from '../utils/constants';
import { baseComponentPropsMap } from '../components/prop';
import { isEventName } from '../utils/utils';
import ServerElement from './ServerElement';
export function processProps(props: Record<string, any>, node: ServerElement) {
  let key: string;
  const newProps: Record<string, any> = {};
  for (key in props) {
    if (key === 'key' || key === 'children' || key === 'ref') {
    } else if (isEventName(key)) {
      const cbKey = `${CALLBACK_SYMBOL}_${node.key}_${key}`;
      node.taskController.addCallback(cbKey, props[key]);
      processEvent(newProps, key, cbKey);
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
 * 2. 事件名称处理，编译时添加名称
 */
export function processEvent(obj: Record<string, any>, event: string, cbKey: any) {
  if (BUBBLE_EVENTS.includes(event)) {
    //优化为编译时
    obj[baseComponentPropsMap[event]] = cbKey;
  } else {
    obj[event] = cbKey;
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
