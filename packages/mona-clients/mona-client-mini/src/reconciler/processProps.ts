import { CALLBACK_SYMBOL, isEventName, isFunction, isObject, monaPrint, plainStyle } from '@/utils';
import ServerElement from './ServerElement';
import createEventHandler from '../eventHandler';

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
  let propKey: string;
  let cbKey: string;
  const newProps: Record<string, any> = {};
  for (propKey in props) {
    if (filterPropsMap[propKey]) {
    } else if (isEventName(propKey)) {
      // 临时
      if (propKey === 'onClick') {
        propKey = 'onTap';
      }

      cbKey = `${CALLBACK_SYMBOL}_${node.key}_${propKey}`;

      if (isFunction(props[propKey])) {
        node.taskController.addCallback(cbKey, createEventHandler(node, propKey, props[propKey]));
        // newProp有，oldProp无的加入更新队列
        if (node.props?.[propKey] !== cbKey) {
          newProps[propKey] = cbKey;
        }
      } else {
        node.taskController.removeCallback(cbKey);
        newProps[propKey] = props[propKey];
      }
    } else if (styleMap[propKey]) {
      if (isObject(props[propKey])) {
        monaPrint.warn(`${propKey} 属性的值，对象数据量过大时，会影响渲染性能，请考虑使用其他方式`);
        newProps[propKey] = plainStyle(props[propKey]);
      } else {
        newProps[propKey] = props[propKey];
      }
    } else {
      newProps[propKey] = props[propKey];
    }
  }
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
      oldStyle = oldProps[propKey];
      newStyle = newProps[propKey];
      if (isObject(oldStyle)) {
        for (styleKey in oldStyle) {
          // 小程序中style 为 'color:white; font-size:16rpx;'的形式。所以有一个不同，style全更新
          if (!newStyle?.hasOwnProperty(styleKey)) {
            propUpdateObj[propKey] = newProps[propKey];
            break;
          }
        }
      }
    } else if (!newProps.hasOwnProperty(propKey)) {
      // undefined 代表读取默认属性，null代表设为空
      propUpdateObj[propKey] = undefined;
    }
  }
  let newProp: any;
  let oldProp: any;
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
        oldStyle = oldProp ?? {};
        if (isObject(newProp)) {
          for (styleKey in newProp) {
            if (oldStyle[styleKey] !== newProp[styleKey]) {
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

// export const BUBBLE_EVENTS = [
//   'onClick',
//   'onTap',
//   'onLongPress',
//   'onLongTap',
//   'onTouchStart',
//   'onTouchMove',
//   'onTouchEnd',
//   'onTouchcancel',
//   'onTransitionEnd',
//   'onAnimationStart',
//   'onAnimationIteration',
//   'onAnimationEnd',
// ];
