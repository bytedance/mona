import { NodeTask } from '../utils';
// import { processProps } from './processProps';
import TaskController, { Task } from './TaskController';
import { ComponentType } from '@bytedance/mona-shared';

let id = 1;

export function generateId() {
  return id++;
}

export const NodeType = {
  ROOT: 'root',
  PTEXT: ComponentType.ptext,
};

export interface RenderNode {
  COMPLIER_KEY: number;
  COMPLIER_TYPE: string;
  COMPLIER_PROPS: Record<string, any>;
  COMPLIER_NODES: Record<number, RenderNode>;
  COMPLIER_CHILDREN: number[];
  COMPLIER_TEXT: string;
}

export default class ServerElement {
  type: string;
  taskController: TaskController;
  props?: any;
  text?: string;
  key: number;
  children: Map<number, ServerElement> = new Map();
  parent: ServerElement | null = null;
  firstChildKey: number | null = null;
  lastChildKey: number | null = null;
  prevSiblingKey: number | null = null;
  nextSiblingKey: number | null = null;
  mounted: boolean = false;
  deleted: boolean = false;
  eventsCallbackList = new Set<string>();

  constructor(type: string, taskController: TaskController, props?: Record<string, any>) {
    this.type = type;
    this.props = props;
    this.key = generateId();
    this.taskController = taskController;
  }

  requestUpdate(task: Task) {
    this.taskController.requestUpdate(task);
  }

  // 清楚自身&子节点挂载的callback
  clearEvents() {
    // Set.forEach传入要包裹一层函数 ,否则this指向会改变
    // bug case: forEach(this.taskController.removeCallback)
    this.eventsCallbackList.forEach(c => {
      this.taskController.removeCallback(c);
    });
    let currKey = this.firstChildKey;
    let currItem: ServerElement | null = currKey ? this.children.get(currKey)! : null;
    while (currItem) {
      currItem.clearEvents();
      currKey = currItem.nextSiblingKey;
      currItem = currKey ? this.children.get(currKey)! : null;
    }
  }

  addCallback(cbKey: string, cb: (...args: any) => any) {
    this.eventsCallbackList.add(cbKey);
    this.taskController.addCallback(cbKey, cb);
  }

  appendChild(child: ServerElement) {
    if (this.children.get(child.key)) {
      this.removeChild(child);
    }
    this.children.set(child.key, child);
    child.parent = this;
    if (!this.firstChildKey) {
      this.firstChildKey = child.key;
    } else if (this.lastChildKey) {
      child.prevSiblingKey = this.lastChildKey;
      const oldLastChild = this.children.get(this.lastChildKey);

      if (oldLastChild) {
        oldLastChild.nextSiblingKey = child.key;
      }
    }
    this.lastChildKey = child.key;
    child.deleted = false;

    if (this.isMounted()) {
      this.requestUpdate({
        targetNode: child.serialize(),
        type: NodeTask.SPLICE,
        parentPath: this.path,
        taskNode: this,
        children: this.orderedChildren,
        key: child.key,
      });
    }
  }

  removeChild(child: ServerElement) {
    const prevSibling = child.prevSiblingKey ? this.children.get(child.prevSiblingKey) : null;
    const nextSibling = child.nextSiblingKey ? this.children.get(child.nextSiblingKey) : null;

    if (prevSibling && nextSibling) {
      // middle element
      prevSibling.nextSiblingKey = nextSibling.key;
      nextSibling.prevSiblingKey = prevSibling.key;
    } else if (prevSibling) {
      // last element
      prevSibling.nextSiblingKey = null;
      this.lastChildKey = prevSibling.key;
    } else if (nextSibling) {
      // first element
      this.firstChildKey = nextSibling.key;
      nextSibling.prevSiblingKey = null;
    } else {
      this.firstChildKey = null;
      this.lastChildKey = null;
    }

    this.children.delete(child.key);

    child.delete();

    if (this.isMounted()) {
      this.requestUpdate({
        targetNode: null,
        children: this.orderedChildren,
        type: NodeTask.SPLICE,
        parentPath: this.path,
        taskNode: this,
        key: child.key,
      });
    }
  }

  insertBefore(child: ServerElement, nextSibling: ServerElement) {
    if (this.children.get(child.key)) {
      this.removeChild(child);
    }
    this.children.set(child.key, child);
    const prevSibling = nextSibling.prevSiblingKey ? this.children.get(nextSibling.prevSiblingKey) : null;

    child.parent = this;

    child.nextSiblingKey = nextSibling.key;
    nextSibling.prevSiblingKey = child.key;
    child.prevSiblingKey = prevSibling ? prevSibling.key : null;

    if (prevSibling) {
      prevSibling.nextSiblingKey = child.key;
    } else {
      this.firstChildKey = child.key;
    }
    child.deleted = false;
    if (this.isMounted()) {
      this.requestUpdate({
        targetNode: child.serialize(),
        type: NodeTask.SPLICE,
        parentPath: this.path,
        taskNode: this,
        key: child.key,
        children: this.orderedChildren,
      });
    }
  }

  update(propPath: string, updatePropsMap: Record<string, any>) {
    let propKey: string;
    const path = this.path;
    propPath && path.push(propPath);
    for (propKey in updatePropsMap) {
      this.requestUpdate({
        type: NodeTask.UPDATE,
        taskNode: this,
        key: this.key,
        propName: propKey,
        propValue: updatePropsMap[propKey],
        path,
      });
    }
  }

  serialize(): RenderNode {
    const children = [];
    const nodes: RenderNode['COMPLIER_NODES'] = {};
    let currKey = this.firstChildKey;
    let currItem: ServerElement | null = currKey ? this.children.get(currKey)! : null;
    while (currItem) {
      nodes[currKey!] = currItem.serialize();
      children.push(currKey!);

      currKey = currItem.nextSiblingKey;
      currItem = currKey ? this.children.get(currKey)! : null;
    }

    return {
      COMPLIER_KEY: this.key,
      COMPLIER_TYPE: this.type,
      COMPLIER_TEXT: this.text!,
      COMPLIER_PROPS: this.props,
      COMPLIER_CHILDREN: children,
      COMPLIER_NODES: nodes,
    };
  }

  delete() {
    this.clearEvents();
    this.nextSiblingKey = null;
    this.prevSiblingKey = null;
    this.parent = null;
    this.deleted = true;
  }

  get orderedChildren() {
    const children = [];
    let currKey = this.firstChildKey;
    // currKey 不为0
    let currItem: ServerElement | null = currKey ? this.children.get(currKey)! : null;

    while (currItem) {
      children.push(currKey);
      currKey = currItem.nextSiblingKey;
      currItem = currKey ? this.children.get(currKey)! : null;
    }
    return children as number[];
  }

  get path() {
    const nodePath = [];
    const res = [];
    let currNode: ServerElement | null = this;

    while (currNode) {
      if (currNode.type !== NodeType.ROOT) {
        nodePath.push(currNode);
      }
      currNode = currNode.parent;
    }

    for (let i = nodePath.length - 1; i >= 0; i--) {
      res.push(COMPLIER_NODES_STR, nodePath[i].key);
    }
    return res;
  }

  isMounted(): boolean {
    return this.parent ? this.parent.isMounted() : this.mounted;
  }

  isDeleted(): boolean {
    return this.deleted ? this.deleted : this.parent?.isDeleted() ?? false;
  }
}
