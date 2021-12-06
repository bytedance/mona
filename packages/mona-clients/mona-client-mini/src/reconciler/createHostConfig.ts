import scheduler from 'scheduler';
import TaskController from './TaskController';
import ServerElement from './ServerElement';
import { diffProperties, processProps } from './processProps';
import { isObject } from '../utils/utils';

const {
  unstable_scheduleCallback: scheduleDeferredCallback,
  unstable_cancelCallback: cancelDeferredCallback,
  unstable_shouldYield: shouldYield,
  unstable_now: now,
} = scheduler;

const emptyObject = {};
// const emptyFunc = function () {};
// TODO: android低版本兼容问题，尽量不要引入polyfill

const childHostContext = {};
const rootHostContext = {};

// eslint-disable-next-line max-lines-per-function
export default function createHostConfig() {
  const hostConfig = {
    createInstance(type: string, props: any, taskController: TaskController) {
      // console.log('createInstance', new ServerElement({ type, props, taskController }));
      return new ServerElement({ type, props: props ?? {}, taskController });
    },

    createTextInstance(text: string, taskController: TaskController) {
      const element = new ServerElement({ type: 'ptext', taskController });
      element.text = text;
      return element;
    },

    appendInitialChild(parent: ServerElement, child: ServerElement) {
      parent.appendChild(child);
    },

    finalizeInitialChildren() {
      return false;
    },

    prepareUpdate(_node: ServerElement, _type: string, oldProps: any, newProps: any) {
      return diffProperties(oldProps ?? {}, newProps ?? {});
    },
    shouldSetTextContent() {
      return false;
    },

    getRootHostContext() {
      return rootHostContext;
    },

    getChildHostContext() {
      return childHostContext;
    },

    getPublicInstance(inst: any) {
      return inst;
    },

    prepareForCommit() {
      return null;
    },
    resetAfterCommit: (taskController: TaskController) => {
      taskController.applyUpdate();
    },
    preparePortalMount: () => {},
    now,

    // ========== Mutation Methods ===========
    appendChild(parent: ServerElement, child: ServerElement) {
      parent.appendChild(child);
    },
    // appendAllChildren(children: ServerElement[]) {},

    appendChildToContainer(container: TaskController, child: ServerElement) {
      container.appendChild(child);
      // TODO
      child.mounted = true;
    },

    insertBefore(parent: ServerElement, child: ServerElement, beforeChild: ServerElement) {
      parent.insertBefore(child, beforeChild);
    },
    insertInContainerBefore(parent: ServerElement, child: ServerElement, beforeChild: ServerElement) {
      parent.insertBefore(child, beforeChild);
    },

    removeChild(parent: ServerElement, child: ServerElement) {
      parent.removeChild(child);
    },

    removeChildFromContainer(container: TaskController, child: ServerElement) {
      container.removeChild(child);
    },

    resetTextContent() {},

    commitTextUpdate(textInstance: ServerElement, oldText: string, newText: string) {
      if (oldText !== newText) {
        textInstance.text = newText;
        textInstance.update('', { text: newText });
      }
    },

    commitMount() {},
    commitUpdate(node: ServerElement, updatePayload: any, _type: any, _oldProps: any, newProps: any) {
      node.props = newProps;
      node.update('props', processProps(updatePayload, node));
    },

    hideInstance(node: ServerElement) {
      console.log('hideInstance', node);
      if (isObject(node.props?.style)) {
        node.props.style['display'] = 'none !important';
      } else {
        node.props.style = { display: 'none !important' };
      }
      node.update('props', processProps({ style: node.props.style }, node));
    },
    unhideInstance(node: ServerElement, props: any) {
      console.log('unhideInstance', node, props);

      node.props = props;
      node.update('props', processProps({ style: props.hasOwnProperty('style') ? props.style : null }, node));
    },
    hideTextInstance(node: ServerElement) {
      console.log('hideTextInstance', node);
      node.text = '';
      node.update('', { text: '' });
    },

    unhideTextInstance(node: ServerElement, text: string) {
      console.log('unhideTextInstance', node, text);
      node.text = text;
      node.update('', { text });
    },

    clearContainer() {},
    schedulePassiveEffects: scheduleDeferredCallback,
    cancelPassiveEffects: cancelDeferredCallback,
    shouldYield,
    scheduleDeferredCallback,
    cancelDeferredCallback,
    supportsMutation: true,
  };
  return hostConfig;
}
