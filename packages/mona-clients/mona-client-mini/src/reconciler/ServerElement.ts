import { NodeUpdate } from '../utils/constants';
import { processProps } from './processProps';
import TaskController, { Task } from './TaskController';

let id = 1;
function generateId() {
  return id++;
}

export const NodeType = {
  ROOT: 'monaRoot',
  VIEW: 'view',
  TEXT: 'text',
  PTEXT: 'ptext',
  BUTTON: 'button',
};

const allTypes = new Set(Object.values(NodeType));
function formatType(type: string): string {
  if (allTypes.has(type)) {
    return type;
  }
  return NodeType.VIEW;
}

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
  // diff时复用节点
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
    this.type = formatType(type);
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
      console.log('this.children.get(child.key)', true);
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
        type: NodeUpdate.SPLICE,
        parentPath: this.path,
        parentNode: this,
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
    child.parent = null;
    this.children.delete(child.key);
    child.deleted = true;

    if (this.isMounted()) {
      this.requestUpdate({
        targetNode: null,
        children: this.orderedChildren,
        type: NodeUpdate.SPLICE,
        parentPath: this.path,
        parentNode: this,
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
    child.nextSiblingKey = nextSibling.key;
    nextSibling.prevSiblingKey = child.key;
    child.prevSiblingKey = nextSibling.prevSiblingKey;
    if (prevSibling) {
      // added as first child, prepended
      prevSibling.nextSiblingKey = child.key;
    } else {
      // added in between
      this.firstChildKey = child.key;
    }
    child.parent = this;
    child.deleted = false;
    if (this.isMounted()) {
      this.requestUpdate({
        targetNode: this.serialize(),
        type: NodeUpdate.SPLICE,
        parentPath: this.path,
        parentNode: this,
        key: child.key,
      });
    }
  }

  updateProps() {
    // 处理text
    //
    // this.requestUpdate({
    //   type: NodeUpdate.SPLICE,
    //   targetNode: this.serialize(),
    //   parentPath: this.path,
    //   parentNode: this,
    //   key: child.key,
    // });
  }

  serialize(): RenderNode {
    const children = [];
    const nodes: RenderNode['nodes'] = {};
    let currKey = this.firstChildKey;
    let currItem: ServerElement;

    // currKey 不为0
    while (currKey) {
      currItem = this.children.get(currKey)!;
      if (!currItem.deleted) {
        nodes[currKey] = currItem.serialize();
        children.push(currKey);
      }
      currKey = currItem.nextSiblingKey;
    }

    return {
      key: this.key,
      type: this.type,
      text: this.text!,
      props: processProps(this.props, this),
      children: children,
      [NODE_MAP_NAME]: nodes,
    };
  }

  get orderedChildren() {
    const children = [];
    let currKey = this.firstChildKey;
    let currItem: ServerElement;

    // currKey 不为0
    while (currKey) {
      currItem = this.children.get(currKey)!;
      if (!currItem.deleted) {
        children.push(currKey);
      }
      currKey = currItem.nextSiblingKey;
    }

    return children;
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
      const child = nodePath[i + 1] || this;
      res.push(NODE_MAP_NAME);
      res.push(child.key);
    }
    return res;
  }

  isMounted(): boolean {
    return this.parent ? this.parent.isMounted() : this.mounted;
  }
  // serialize2() {
  //   const childrenKeys = this.children ? Array.from(this.children.keys()) : [];
  //   const children = childrenKeys.map(key => this.children.get(key)?.serialize());

  //   const json: any = {
  //     key: this.key,
  //     type: this.type,
  //     text: this.text,
  //     props: processProps(this.props, this),
  //     children: children,
  //   };

  //   return json;
  // }
}
