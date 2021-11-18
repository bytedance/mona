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
  _root: any;
  tasks: Task[];

  constructor(context: any) {
    this.context = context;
    this.tasks = [];
  }

  requestUpdate(task: Task) {
    this.tasks.push(task);
  }

  applyUpdate() {
    this.context.setData(this.tasks);
    this.tasks = [];
  }
}