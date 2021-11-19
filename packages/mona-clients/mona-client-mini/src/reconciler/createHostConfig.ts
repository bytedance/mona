// @ts-nocheck
import TaskController from './TaskController';
import ServerElement from './ServerElement';

const emptyObject = {};

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
    appendInitialChild(parent: ServerElement, child: ServerElement) {
      parent.appendChild(child);
    },

    createInstance(type: string, props: any, taskController: TaskController) {
      return new ServerElement({ type, props, taskController });
    },

    createTextInstance(text: string, taskController: TaskController) {
      const element = new ServerElement({ type: 'text', taskController });
      element.text = text;
      return element;
    },

    // finalizeInitialChildren(element: ServerElement, type: string, props: any) {
    //     const result = {}
    //     Object.keys(props).forEach((key) => {
    //         if (isEventName(key) && typeof props[key] === 'function') {
    //             const eventKey = generateEventKey();
    //             result[key] = eventKey;
    //             // 进入事件池
    //             eventPool.set(eventKey, props[key]);
    //         } else if (key !== 'children') {
    //             result[key] = props[key];
    //         }
    //     })
    //     element.props = result;
    //     return false
    // },

    // getPublicInstance(inst:) {
    //     return inst
    // },
    // clearContainer() {
    //     console.log('clearContainer')
    // },

    prepareForCommit() {
      // empty
    },
    resetAfterCommit() {
      // empty
    },
    resetTextContent(element: ServerElement) {
      // empty
    },

    prepareUpdate(domElement: any, type: string, oldProps: any, newProps: any) {
      return changedProps(oldProps, newProps).filter(prop => prop !== 'children');
    },

    getRootHostContext(rootInstance: any) {
      return emptyObject;
    },

    getChildHostContext(parentHostContext: any, type: string) {
      return emptyObject;
    },

    shouldSetTextContent(type: string, props: any) {
      return false;
    },

    now: () => {
      // noop
    },

    // useSyncScheduling: true,
    supportsMutation: true,

    appendAllChildren(children: ServerElement[]) {
      // console.log('appendAllChildren', children);
    },
    appendChild(parent: ServerElement, child: ServerElement) {
      // console.log('appendChild', child.sent, child)
      const identifier = { child, method: 'appendChild' };
      // const identifier = child.sent
      //     ? { childKey: child.key, method: 'appendExistingChild' }
      //     : { child: child, method: 'appendChild'}
      // WorkerElement.markSent(child)
      parent.appendChild(child);
      parent.requestUpdate({
        parentKey: parent.key,
        ...identifier,
      });
    },

    appendChildToContainer(parent: ServerElement, child: ServerElement) {
      // console.log('appendChildToContainer', child.children.get(2).children.get(1).children.size);
      // WorkerElement.markSent(child)
      // console.log('mark end all');
      parent.requestUpdate({
        method: 'appendChildToContainer',
        child,
      });
      // console.log('send', child)
    },

    removeChild(parent: ServerElement, child: ServerElement) {
      parent.removeChild(child);
      parent.requestUpdate({
        method: 'removeChild',
        parentKey: parent.key,
        childKey: child.key,
      });
    },

    removeChildFromContainer(parent: ServerElement, child: ServerElement) {
      // debugger
      // throw new Error('not yet implemented')
      // sendMessage({
      //   method: 'removeChildFromContainer',
      //   parentInstance, child
      // })
    },

    insertBefore(parent: ServerElement, child: ServerElement, beforeChild: ServerElement) {
      // const identifier = child.sent
      //     ? { childKey: child.key, method: 'insertExistingBefore' }
      //     : { child: child, method: 'insertBefore'}
      const identifier = { child, method: 'insertBefore' };
      // WorkerElement.markSent(child)
      parent.insertBefore(child, beforeChild);
      parent.requestUpdate({
        parentKey: parent.key,
        beforeKey: beforeChild.key,
        ...identifier,
      });
    },

    commitUpdate(instance: any, updatePayload: any, type: any, oldProps: any, newProps: any) {
      if (updatePayload.length) {
        // throw new Error('not yet implemented')
        // sendMessage({
        //   method: 'commitUpdate',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
    },

    commitMount(instance: any, updatePayload: any, type: any, oldProps: any, newProps: any) {
      if (updatePayload.length) {
        throw new Error('not yet implemented');
        // sendMessage({
        //   method: 'commitMount',
        //   instance, updatePayload, type, oldProps, newProps
        // })
      }
    },

    commitTextUpdate(textInstance: ServerElement, oldText: string, newText: string) {
      // WorkerElement.markSent(textInstance);
      textInstance.text = newText;
      textInstance.requestUpdate({
        method: 'commitTextUpdate',
        key: textInstance.key,
        text: newText,
      });
    },
  };
  return hostConfig;
}
