import ServerElement from '../reconciler/ServerElement';
import { isPropagationStop, eventReactAliasMap, bubbleEventMap, MonaEvent } from './constants';

function checkPropagation(eventName: string, node: ServerElement) {
  const parent = node.parent;
  // parent空->代表本次冒泡完成->初始化false
  if (!parent) {
    isPropagationStop[eventName] = false;
    return;
  }

  // 父元素没有绑定事件->继续向上
  if (!parent.props?.[eventReactAliasMap[eventName]]) {
    stopPropagation(eventName, parent);
  }

  // 父元素绑定了事件，此时isPropagationStop[eventName] = true, 父元素的绑定不会触发
  return;
}

function stopPropagation(eventName: string, node: ServerElement) {
  isPropagationStop[eventName] = true;
  checkPropagation(eventName, node);
}

export default function createEventHandler(node: ServerElement, eventName: string, cb: (...params: any) => void) {
  if (!bubbleEventMap[eventName]) {
    return cb;
  }

  return (e: MonaEvent, ...rest: any[]) => {
    e.stopPropagation = function () {
      stopPropagation(e.type, node);
    };

    // 为true，代表child调用了stopPropagation,
    if (isPropagationStop[e.type]) {
      checkPropagation(e.type, node);
    } else {
      return cb(e, ...rest);
    }
  };
}
