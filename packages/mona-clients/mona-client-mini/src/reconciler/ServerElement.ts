import { processProps } from './processProps';
import TaskController, { Task } from './TaskController';

let id = 1;
const generateId = () => id++;

const allTypes = new Set(['view', 'button', 'text', 'ptext']);
function formatType(type: string): string {
  if (allTypes.has(type)) {
    return type;
  }
  return 'view';
}

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
  }

  requestUpdate(task: Task) {
    this.taskController.requestUpdate(task);
  }

  appendChild(child: ServerElement) {
    console.log('node.appendChild', child);
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
    // this.requestUpdate({
    //   method: 'splice',
    //   // children,
    //   items: [child.serialize()],
    //   key: child.key,
    // });
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
  }

  serialize() {
    const childrenKeys = this.children ? Array.from(this.children.keys()) : [];
    const children = childrenKeys.map(key => this.children.get(key)?.serialize());

    const json: any = {
      key: this.key,
      type: this.type,
      text: this.text,
      props: processProps(this.props, this),
      children: children,
    };

    return json;
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
