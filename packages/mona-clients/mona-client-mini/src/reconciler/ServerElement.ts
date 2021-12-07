import { NodeTask } from '../utils/constants';
// import { processProps } from './processProps';
import TaskController, { Task } from './TaskController';

let id = 1;
function generateId() {
  return id++;
}

export const NodeType = {
  ROOT: 'monaRoot',
  VIEW: 'view',
  TEXT: 'text',
  BUTTON: 'button',
  IMAGE: 'image',
  PTEXT: 'ptext',
};
const formatNodeType: Record<string, string> = {
  span: NodeType.TEXT,
  div: NodeType.VIEW,
  img: NodeType.IMAGE,
};
export interface RenderNode {
  key: number;
  type: string;
  props: Record<string, any>;
  nodes: Record<number, RenderNode>;
  children: number[];
  text: string;
}
export const NODE_MAP_NAME = 'nodes';

export default class ServerElement {
  type: string;
  taskController: TaskController;
  props?: any;
  text?: string;
  key: number;
  children: Map<number, ServerElement>;
  parent: ServerElement | null;
  firstChildKey: number | null = null;
  lastChildKey: number | null = null;
  prevSiblingKey: number | null = null;
  nextSiblingKey: number | null = null;
  mounted: boolean;

  deleted: boolean;

  constructor({
    type,
    props,
    taskController,
  }: {
    type: string;
    taskController: TaskController;
    props?: Record<string, any>;
  }) {
    this.type = formatNodeType[type] ?? type;
    this.props = props;
    this.key = generateId();
    this.taskController = taskController;
    this.children = new Map();
    this.parent = null;
    this.deleted = false;
    this.mounted = false;
  }

  requestUpdate(task: Task) {
    this.taskController.requestUpdate(task);
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
    // console.log('&', 'appendChild', child);

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
      // TODO
      // only element
      this.firstChildKey = null;
      this.lastChildKey = null;
    }

    this.children.delete(child.key);

    child.reset();

    // TODO:函数都去除引用
    // 得更新到视图后再删除？
    child.taskController.removeCallback(child.key);

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
      // added as first child, prepended
      prevSibling.nextSiblingKey = child.key;
    } else {
      // added in between
      this.firstChildKey = child.key;
    }
    child.deleted = false;
    // console.log('&', 'insertBefore', child);

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
    const nodes: RenderNode['nodes'] = {};
    let currKey = this.firstChildKey;
    let currItem: ServerElement | null = currKey ? this.children.get(currKey)! : null;
    while (currItem) {
      nodes[currKey!] = currItem.serialize();
      children.push(currKey!);

      currKey = currItem.nextSiblingKey;
      currItem = currKey ? this.children.get(currKey)! : null;
    }

    return {
      key: this.key,
      type: this.type,
      text: this.text!,
      props: this.props,
      children: children,
      [NODE_MAP_NAME]: nodes,
    };
  }
  reset() {
    this.parent = null;
    this.deleted = true;
    this.mounted = false;
    this.nextSiblingKey = null;
    this.prevSiblingKey = null;
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
        nodePath.unshift(currNode);
      }
      currNode = currNode.parent;
    }
    for (let i = 0; i < nodePath.length; i++) {
      const child = nodePath[i];
      res.push(NODE_MAP_NAME);
      res.push(child.key);
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
