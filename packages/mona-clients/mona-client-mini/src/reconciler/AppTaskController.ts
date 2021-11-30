import ServerElement from './ServerElement';
import TaskController from './TaskController';
export interface Task {
  method: string;
  key?: number;
  text?: string;
  parentKey?: number;
  beforeKey?: number;
  childKey?: number;
  child?: ServerElement;
}

export default class AppTaskController extends TaskController {
  constructor(context: any) {
    super(context);
  }

  requestUpdate() {}

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
}
