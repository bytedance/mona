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

const childHostContext = {};
const rootHostContext = {};
const DISPLAY_NONE = 'display:none !important;';

export default function createHostConfig() {
  const hostConfig = {
    createInstance(type: string, props: any, taskController: TaskController) {
      const node = new ServerElement({ type, props: props ?? {}, taskController });
      node.props = processProps(props, node);
      return node;
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

    appendChildToContainer(container: TaskController, child: ServerElement) {
      container.appendChild(child);
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

    commitUpdate(node: ServerElement, updatePayload: any, _type: any, _oldProps: any, _newProps: any) {
      const updateProps = processProps(updatePayload, node);
      let propKey: string;
      node.props = node.props || {};
      for (propKey in updateProps) {
        node.props[propKey] = updateProps[propKey];
      }
      node.update('props', updateProps);
    },

    hideInstance(node: ServerElement) {
      if (!isObject(node.props)) {
        node.props = {};
      }
      node.props.style = DISPLAY_NONE;
      node.update('props', { style: DISPLAY_NONE });
    },

    // TODO: suspense fallback执行完之后，appendChild和unhideInstance会同时执行，这两个方法有重复，待优化
    unhideInstance(node: ServerElement, props: any = {}) {
      node.update('props', processProps({ ...props, style: props.hasOwnProperty('style') ? props.style : null }, node));
    },

    hideTextInstance(node: ServerElement) {
      node.text = '';
      node.update('', { text: '' });
    },

    unhideTextInstance(node: ServerElement, text: string) {
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
