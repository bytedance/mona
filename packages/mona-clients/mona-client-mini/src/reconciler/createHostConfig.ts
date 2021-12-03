import scheduler from 'scheduler';
import TaskController from './TaskController';
import ServerElement from './ServerElement';
import { processProps } from './processProps';

const {
  unstable_scheduleCallback: scheduleDeferredCallback,
  unstable_cancelCallback: cancelDeferredCallback,
  unstable_shouldYield: shouldYield,
  unstable_now: now,
} = scheduler;

const emptyObject = {};
// const emptyFunc = function () {};
// TODO: android低版本兼容问题，尽量不要引入polyfill

function changedProps(oldObj: Record<string, any>, newObj: Record<string, any>) {
  // Return a diff between the new and the old object
  const uniqueProps = new Set([...Object.keys(oldObj), ...Object.keys(newObj)]);
  const props = Array.from(uniqueProps).filter(propName => oldObj[propName] !== newObj[propName]);

  // const finalChangedProps = dealEvent(changedProps);

  return props;
}

// eslint-disable-next-line max-lines-per-function
export default function createHostConfig() {
  const hostConfig = {
    createInstance(type: string, props: any, taskController: TaskController) {
      // console.log('createInstance', new ServerElement({ type, props, taskController }));
      return new ServerElement({ type, props, taskController });
    },

    createTextInstance(text: string, taskController: TaskController) {
      const element = new ServerElement({ type: 'ptext', taskController });
      element.text = text;
      return element;
    },

    appendInitialChild(parent: ServerElement, child: ServerElement) {
      // console.log('appendInitialChild', child);
      parent.appendChild(child);
    },

    finalizeInitialChildren() {
      return false;
    },

    // 这里有必要diff吗
    prepareUpdate(node: ServerElement, _type: string, oldProps: any, newProps: any) {
      processProps(oldProps, node);

      processProps(newProps, node);

      return changedProps(oldProps, newProps).filter(prop => prop !== 'children');
    },
    shouldSetTextContent() {
      return false;
    },

    getRootHostContext() {
      return emptyObject;
    },
    getChildHostContext() {
      return emptyObject;
    },
    getPublicInstance(inst: any) {
      return inst;
    },
    clearContainer() {
      console.log('clearContainer');
    },

    prepareForCommit() {
      // empty
      return null;
    },
    resetAfterCommit: (taskController: TaskController) => {
      taskController.applyUpdate();
    },
    preparePortalMount: () => {},
    now,

    // ========== Mutation Methods ===========
    appendChild(parent: ServerElement, child: ServerElement) {
      // console.log('appendChild', child);
      parent.appendChild(child);
    },
    // appendAllChildren(children: ServerElement[]) {},

    appendChildToContainer(container: TaskController, child: ServerElement) {
      // console.log('appendChildToContainer', container, child);
      container.appendChild(child);
      // setTimeout(function () {
      //   var t = new ServerElement({
      //     type: 'ptext',
      //     taskController: container,
      //   });
      //   t.text = 'dddd';
      //   container.appendChild(t);
      //   container.applyUpdate();
      //   setTimeout(function () {
      //     container.removeChild(t);
      //     container.applyUpdate();
      //   }, 1000);
      // }, 1000);
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

    resetTextContent() {
      // empty
    },

    commitTextUpdate(textInstance: ServerElement, oldText: string, newText: string) {
      // WorkerElement.markSent(textInstance);
      if (oldText !== newText) {
        textInstance.text = newText;
      }
    },

    commitMount(_instance: any, updatePayload: any) {
      if (updatePayload.length) {
        throw new Error('not yet implemented');
      }
    },

    commitUpdate(node: ServerElement, _updatePayload: any, _type: any, _oldProps: any, newProps: any) {
      node.props = newProps;
      node.updateProps();
    },

    schedulePassiveEffects: scheduleDeferredCallback,
    cancelPassiveEffects: cancelDeferredCallback,
    shouldYield,
    scheduleDeferredCallback,
    cancelDeferredCallback,
    supportsMutation: true,
  };
  return hostConfig;
}
