import ServerElement from './ServerElement';
export interface Task {
  method: string;
  key?: number;
  text?: string;
  parentKey?: number;
  beforeKey?: number;
  childKey?: number;
  child?: ServerElement;
}

export default class TaskController {
  context: any;
  _root?: ServerElement;
  tasks: Task[];
  _stopUpdate?: boolean;

  constructor(context: any) {
    this.context = context;
    this.tasks = [];
    // this._root = new ServerElement({ type: 'root', taskController: this });
  }

  requestUpdate(task: Task) {
    this.tasks.push(task);
  }

  applyUpdate() {
    if (this._stopUpdate || this.tasks.length === 0) {
      return;
    }
    const data = this.tasks.map(t => ({ ...t, child: t.child?.serialize() }));
    console.log('applyUpdate', data);
    this.context.setData({
      tasks: data,
    });
    this.tasks = [];
  }

  stopUpdate() {
    this._stopUpdate = true;
  }

  addCallback(name: string, cb: (...args: any) => any) {
    this.context[name] = cb;
  }

  // appendChild(child: ServerElement) {
  //   this._root.appendChild(child);
  // }

  // removeChild(child: ServerElement) {
  //   this._root.removeChild(child);
  // }

  // insertBefore(child: ServerElement, beforeChild: ServerElement) {
  //   this._root.insertBefore(child, beforeChild);
  // }
}
