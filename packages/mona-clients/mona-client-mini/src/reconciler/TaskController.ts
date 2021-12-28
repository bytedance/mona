import { FiberRoot } from 'react-reconciler';
import ServerElement, { RenderNode, NodeType } from './ServerElement';
// import createEventHandler from '../eventHandler';
import { monaPrint, NodeTask } from '../utils';
import { batchedUpdates } from '.';

interface SpliceTask {
  type: NodeTask.SPLICE;
  key?: number;
  children?: number[];
  targetNode: RenderNode | null;
  taskNode: ServerElement;
  parentPath: any[];
}

interface UpdateTask {
  type: NodeTask.UPDATE;
  key?: number;
  propName: string;
  propValue: any;
  path: any[];
  taskNode: ServerElement;
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

    const res: Record<string, any> = {};
    this.tasks.forEach(task => {
      // requestUpdate时，不会立即执行applyUpdate，在这段延迟时间内，该节点可能被删除
      if (task.taskNode.isDeleted()) {
        return;
      }

      // 更新children
      if (task.type === NodeTask.SPLICE) {
        res[this.genUpdatePath([...task.parentPath, 'nodes', task.key])] = task.targetNode;
        if (task.children) {
          res[this.genUpdatePath([...task.parentPath, 'children'])] = task.children;
        }
        if (task.taskNode.type === NodeType.ROOT) {
          res[this.genUpdatePath([...task.parentPath, 'type'])] = task.taskNode.type;
          res[this.genUpdatePath([...task.parentPath, 'key'])] = task.taskNode.key;
        }
      } else if (task.type === NodeTask.UPDATE) {
        res[this.genUpdatePath([...task.path, task.propName])] = task.propValue;
      }
    });

    console.time('setData');
    this.context.setData(res, () => {
      console.timeEnd('setData');
    });
    monaPrint.debug('applyUpdate', {
      data: res,
      tasks: this.tasks,
    });
    this.tasks = [];
  }

  genUpdatePath(paths: string[]) {
    return [this.rootKey, ...paths].join('.');
  }

  stopUpdate() {
    this._stopUpdate = true;
  }

  addCallback(cbKey: string, cb: (...args: any) => any) {
    this.context[cbKey] = (...args: any[]) => batchedUpdates((args: any) => cb(...args), args);
  }

  // addCallback(nodeKey: string | number, eventName: string, cb: (...args: any) => any) {
  //   if (isObject(this.context[nodeKey])) {
  //     this.context[nodeKey][eventName] = cb;
  //   } else {
  //     this.context[nodeKey] = { [eventName]: cb };
  //   }
  // }

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
  // setListener(nodeKey: string, eventName: string, cb: (...args: any) => any) {
  //   const events = this.context.eventMap.get(nodeKey);
  //   if (events) {
  //     events[eventName] = cb;
  //   } else {
  //     this.context.eventMap.set(nodeKey, {
  //       [eventName]: cb,
  //     });
  //   }
  // }
  // removeListener(nodeKey: string) {
  //   this.context.eventMap.remove(nodeKey);
  // }
}
