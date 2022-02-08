import { isFunction, isObject, plainStyle } from '../utils';
import ServerElement from './ServerElement';
import createEventHandler from '../eventHandler';

/**
 * picker-view ： indicatorStyle,maskStyle
 * input\textarea: placeholderStyle
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
};
export const genCbName = (propKey: string, node: ServerElement) => {
  return `${node.key}${propKey}`;
};
export function processProps(props: Record<string, any>, node: ServerElement) {
  let propKey: string;
  let cbKey: string;

  const newProps: Record<string, any> = {};
  for (propKey in props) {
    if (filterPropsMap[propKey]) {
    } else if (isFunction(props[propKey])) {
      cbKey = genCbName(propKey, node);
      node.addCallback(cbKey, createEventHandler(node, propKey, props[propKey]));
      if (node.props?.[propKey] !== cbKey) {
        newProps[propKey] = cbKey;
      }
    } else if (styleMap[propKey]) {
      if (isObject(props[propKey])) {
        // monaPrint.warn(`${propKey} 属性的值，对象数据量过大时，会影响渲染性能，请考虑使用其他方式`);
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
 * 2 situations that need to be updated
 * 1. new not owned, old owned。
 * 2. new ！== old
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
          // The attribute of style in the miniapp is 'color:white; font-size:16rpx;'
          // There is a property that is different and The style needs to be updated
          if (!newStyle?.hasOwnProperty(styleKey)) {
            propUpdateObj[propKey] = newProps[propKey];
            break;
          }
        }
      }
    } else if (!newProps.hasOwnProperty(propKey)) {
      // undefined: default prop
      // null: set property to empty
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
