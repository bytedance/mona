import { CALLBACK_SYMBOL } from '../utils/constants';
import { baseComponentPropsMap } from '../components/prop';
import { isEventName, isObject, warn } from '../utils/utils';
import ServerElement from './ServerElement';
import { plainStyle } from '../utils/transformStyle';

/**
 * picker-view 组件： indicatorStyle,maskStyle
 * input\textarea组件: placeholderStyle
 */
const styleMap: Record<string, boolean> = {
  style: true,
  placeholderStyle: true,
  indicatorStyle: true,
  maskStyle: true,
};

const filterPropsMap: Record<string, boolean> = {
  key: true,
  children: true,
  ref: true,
};

export function processProps(props: Record<string, any>, node: ServerElement) {
  let key: string;
  let cbKey: string;
  const newProps: Record<string, any> = {};
  for (key in props) {
    if (filterPropsMap[key]) {
    } else if (isEventName(key)) {
      cbKey = `${CALLBACK_SYMBOL}_${node.key}_${key}`;
      node.taskController.addCallback(cbKey, props[key]);
      newProps[key] = cbKey;
    } else if (styleMap[key]) {
      warn(`${key} 属性的值，对象数据量过大时，会影响渲染性能，请考虑使用其他方式`);
      if (isObject(props[key])) {
        newProps[key] = plainStyle(props[key]);
      } else {
        newProps[key] = props[key];
      }
    } else {
      newProps[key] = props[key];
    }
  }
  console.log('updatePayload', node.key, newProps);
  return newProps;
}

/**
 * 需更新的2种情况
 * ①新无旧有,设为null。
 * ②新旧value不同的。
 */
export function diffProperties(oldProps: Record<string, any>, newProps: Record<string, any>) {
  let propKey: string;
  const propUpdateObj: Record<string, any> = {};
  let styleKey: string;
  let oldStyle: any, newStyle: any;
  for (propKey in oldProps) {
    if (filterPropsMap[propKey]) {
      continue;
    } else if (styleMap[propKey]) {
      oldStyle = oldProps[propKey] ?? {};
      newStyle = newProps[propKey] ?? {};
      if (isObject(oldStyle)) {
        for (styleKey in oldStyle) {
          if (!newStyle.hasOwnProperty(styleKey)) {
            propUpdateObj[propKey] = newProps[propKey];
            break;
          }
        }
      }
      // TODO:区分string、object
    } else if (!newProps.hasOwnProperty(propKey)) {
      propUpdateObj[propKey] = null;
    }
  }
  let newProp: string;
  let oldProp: string;
  for (propKey in newProps) {
    newProp = newProps[propKey];
    oldProp = oldProps ? oldProps[propKey] : null;

    if (
      newProp === oldProp ||
      (newProp == null && oldProp == null) ||
      !newProps.hasOwnProperty(propKey) ||
      filterPropsMap[propKey]
    ) {
      continue;
    } else {
      if (styleMap[propKey]) {
        newStyle = newProps[propKey] ?? {};
        oldStyle = oldProps[propKey] ?? {};
        if (isObject(newStyle)) {
          for (styleKey in newStyle) {
            if (oldStyle[styleKey] !== newStyle[styleKey]) {
              propUpdateObj[propKey] = newProp;
              break;
            }
          }
        } else {
          propUpdateObj[propKey] = newProp;
        }
      } else {
        propUpdateObj[propKey] = newProp;
      }
    }
  }

  return propUpdateObj;
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
