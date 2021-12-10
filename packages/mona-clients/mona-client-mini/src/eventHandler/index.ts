import ServerElement from '../reconciler/ServerElement';
import { BUBBLE_EVENTS, eventMap, MonaEvent } from './contants';

export const isPropagationStop: Record<string, boolean> = {};
BUBBLE_EVENTS.forEach(item => {
  isPropagationStop[item.slice(2).toLowerCase()] = false;
});

function checkPropagation(eventName: string, node: ServerElement) {
  console.log('node', node);
  const parent = node.parent;
  // 冒泡事件到root->代表本次冒泡完成->初始化false
  if (!parent) {
    isPropagationStop[eventName] = false;
    return;
  }

  // bug: 这里eventName名称的问题
  // 父元素没有绑定事件->继续向上
  // @ts-ignore
  if (!parent.props?.[eventMap[eventName]]) {
    stopPropagation(eventName, parent);
  }

  // 父元素绑定了事件，此时isPropagationStop[eventName] = true, 父元素的绑定不会触发
  return;
}

function stopPropagation(eventName: string, node: ServerElement) {
  isPropagationStop[eventName] = true;
  checkPropagation(eventName, node);
}

export default function createEventHandler(node: ServerElement, cb: (...params: any) => void) {
  return (e: MonaEvent, ...rest: any[]) => {
    console.log('createEventHandler', isPropagationStop, node);

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
