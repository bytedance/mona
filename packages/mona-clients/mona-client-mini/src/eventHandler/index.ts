import ServerElement from '../reconciler/ServerElement';
import { isPropagationStop, eventReactAliasMap, bubbleEventMap, MonaEvent } from './constants';

function checkPropagation(eventName: string, node: ServerElement) {
  const parent = node.parent;
  // parent is null  -> bubbling done -> set false
  if (!parent) {
    isPropagationStop[eventName] = false;
    return;
  }

  //  When there is not an event callback on the parent , up up up
  if (!parent.props?.[eventReactAliasMap[eventName]]) {
    stopPropagation(eventName, parent);
  }

  // When there is an event callback on the parent , at this time isPropagationStop[eventName] is true,
  // The parent will not call the callback
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

    // If it is true, it means that children call stopPropagation,
    if (isPropagationStop[e.type]) {
      checkPropagation(e.type, node);
    } else {
      return cb(e, ...rest);
    }
  };
}
