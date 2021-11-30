import { FiberRoot } from 'react-reconciler';
import ServerElement from './ServerElement';
import { NodeUpdate } from '../utils/constants';
export interface Task {
  method: string;
  key?: number;
  text?: string;
  parentKey?: number;
  beforeKey?: number;
  childKey?: number;
  children?: ServerElement;

  
  node?: any;
  // @ts-ignore
  type?: NodeUpdate;
}

export default class TaskController {
  context: any;
  _root: ServerElement;
  tasks: Task[];
  _stopUpdate: boolean;
  rootContainer?: FiberRoot;

  constructor(context: any) {
    this.context = context;
    this.tasks = [];
    this._root = new ServerElement({ type: 'root', taskController: this });
    this._root.mounted = true;
    this._stopUpdate = false;
  }

  requestUpdate(task: Task) {
    this.tasks.push(task);
  }

  applyUpdate() {
    if (this._stopUpdate || this.tasks.length === 0) {
      return;
    }
    // const data = this.tasks.map(t => ({ ...t, children: t.children?.serialize() }));
    console.log('applyUpdate', this.tasks);
    this.context.setData({
      tasks: this.tasks,
    });
    this.tasks = [];
  }

  stopUpdate() {
    this._stopUpdate = true;
  }

  addCallback(name: string, cb: (...args: any) => any) {
    this.context[name] = cb;
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
