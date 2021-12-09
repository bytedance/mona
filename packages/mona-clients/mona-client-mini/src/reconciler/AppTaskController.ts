import { FiberRoot } from 'react-reconciler';
import ServerElement, { NodeType } from './ServerElement';
import { ROOT_KEY } from './TaskController';
export interface Task {
  method: string;
  key?: number;
  text?: string;
  parentKey?: number;
  beforeKey?: number;
  childKey?: number;
  children?: ServerElement;
}

export default class AppTaskController {
  context: any;
  _root: ServerElement;
  tasks: Task[];
  rootContainer?: FiberRoot;
  rootKey: string;

  constructor(context: any) {
    this.context = context;
    this.tasks = [];
    this._root = new ServerElement({ type: NodeType.ROOT, taskController: this as any });
    this._root.mounted = true;
    this.rootKey = ROOT_KEY;
  }

  requestUpdate() {}

  applyUpdate() {
    this.context._pages.forEach((page: any) => {
      page._controller.applyUpdate();
    });
  }

  addCallback(name: string, cb: (...args: any) => any) {
    this.context[name] = cb;
  }

  removeCallback(name: string | number) {
    this.context[name] = undefined;
  }

  appendChild(child: ServerElement) {
    this._root.appendChild(child);
  }

  removeChild(child: ServerElement) {
    this._root.removeChild(child);
  }

  insertBefore(child: ServerElement, beforeChild: ServerElement) {
    this._root.insertBefore(child, beforeChild);
  }
}
