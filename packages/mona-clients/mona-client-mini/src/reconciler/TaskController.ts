import { FiberRoot } from 'react-reconciler';
import ServerElement, { RenderNode, NodeType } from './ServerElement';
import { NodeTask } from '../utils/constants';

interface SpliceTask {
  type: NodeTask.SPLICE;
  key?: number;
  children?: number[];
  // children?: ServerElement;
  targetNode: RenderNode | null;
  parentNode: ServerElement;
  parentPath: any[];
}
interface UpdateTask {
  type: NodeTask.UPDATE;
  key?: number;
  // children?: ServerElement;
  propName: string;
  propValue: any;
  path: any[];
  parentNode: ServerElement;
}
export type Task = SpliceTask | UpdateTask;

export const ROOT_KEY = 'mona';
export default class TaskController {
  context: any;
  _root: ServerElement;
  tasks: Task[];
  _stopUpdate: boolean;
  rootContainer?: FiberRoot;
  rootKey: string;

  constructor(context: any) {
    this.context = context;
    this.tasks = [];
    this._root = new ServerElement({ type: NodeType.ROOT, taskController: this });
    this._root.mounted = true;
    this._stopUpdate = false;
    this.rootKey = ROOT_KEY;
  }

  requestUpdate(task: Task) {
    this.tasks.push(task);
  }

  applyUpdate() {
    if (this._stopUpdate || this.tasks.length === 0) {
      return;
    }
    // const data = this.tasks.map(t => ({ ...t, children: t.children?.serialize() }));

    const res: Record<string, any> = {};
    this.tasks.forEach(task => {
      // requestUpdate时，不会立即执行applyUpdate，在这段延迟时间内，该节点可能被删除
      if (task.parentNode.isDeleted()) {
        return;
      }
      // 更新children
      if (task.type === NodeTask.SPLICE) {
        res[this.genUpdatePath([...task.parentPath, 'nodes', task.key])] = task.targetNode;
        if (task.children) {
          res[this.genUpdatePath([...task.parentPath, 'children'])] = task.children;
        }
        if (task.parentNode.type === NodeType.ROOT) {
          // res[this.genUpdatePath([...task.parentPath, 'nodes', task.key])] = task.targetNode;
          // res[this.genUpdatePath(['children'])] = [task.parentNode.key];
          res[this.genUpdatePath([...task.parentPath, 'type'])] = task.parentNode.type;
        }
      } else if (task.type === NodeTask.UPDATE) {
        res[this.genUpdatePath([...task.path, 'props', task.propName])] = task.propValue;
        // TODO: 更新属性
      }
    });
    console.log('applyUpdate', res);
    this.context.setData(res);
    this.tasks = [];
  }

  genUpdatePath(paths: string[]) {
    return [this.rootKey, ...paths].join('.');
  }
  stopUpdate() {
    this._stopUpdate = true;
  }

  addCallback(name: string, cb: (...args: any) => any) {
    this.context[name] = cb;
  }

  appendChild(child: ServerElement) {
    console.log('taskController appendCHild', child);
    this._root.appendChild(child);
  }

  removeChild(child: ServerElement) {
    this._root.removeChild(child);
  }

  insertBefore(child: ServerElement, beforeChild: ServerElement) {
    this._root.insertBefore(child, beforeChild);
  }
}
