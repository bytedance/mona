import scheduler from 'scheduler';
import TaskController from './TaskController';
import ServerElement from './ServerElement';

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
    prepareUpdate(_domElement: any, _type: string, oldProps: any, newProps: any) {
      // console.log('prepareUpdate', { domElement, type, oldProps, newProps });
      // console.log(
      //   'prepareUpdate',
      //   changedProps(oldProps, newProps).filter(prop => prop !== 'children'),
      // );

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
      console.log('appendChild', child);
      parent.appendChild(child);
    },
    // appendAllChildren(children: ServerElement[]) {},

    appendChildToContainer(container: TaskController, child: ServerElement) {
      console.log('appendChildToContainer', container, child);
      container.appendChild(child);
      // setTimeout(() => {
      //   const t = new ServerElement({ type: 'ptext', taskController: container });
      //   // const c = new ServerElement({ type: 'ptext', taskController: child.taskController });
      //   t.text = 'dddd';
      //   // t.appendChild(c);
      //   child.key = 1233;
      //   container.appendChild(child);
      //   container.applyUpdate();
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

    removeChildFromContainer() {},

    resetTextContent() {
      // empty
    },

    commitTextUpdate(textInstance: ServerElement, oldText: string, newText: string) {
      // WorkerElement.markSent(textInstance);
      if (oldText !== newText) {
        textInstance.text = newText;
        // textInstance.requestUpdate({
        //   method: 'commitTextUpdate',
        //   key: textInstance.key,
        //   text: newText,
        // });
      }
    },

    commitMount(_instance: any, updatePayload: any) {
      
      if (updatePayload.length) {
        throw new Error('not yet implemented');
      }
    },
    commitUpdate(_instance: any, updatePayload: any, type: any, oldProps: any, newProps: any) {
      console.log('commitUpdate', { updatePayload, type, oldProps, newProps });
      if (updatePayload.length) {
        // throw new Error('not yet implemented')
        // sendMessage({
        //   method: 'commitUpdate',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
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
