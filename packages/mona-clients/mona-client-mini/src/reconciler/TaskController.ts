import { FiberRoot } from 'react-reconciler';
import ServerElement, { RenderNode, NodeType } from './ServerElement';
// import createEventHandler from '../eventHandler';
import { NodeTask } from '@/utils';
import { batchedUpdates } from '.';
import { miniEffect } from '../miniEffect';

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

// template render will get ROOT_KEY prop from page to template render.
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
    this._root = new ServerElement(NodeType.ROOT, this);
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
      // When requestUpdate is called, applyUpdate will not be called immediately, and the node may be deleted during delayed execution
      // isDeleted === true，It means that the taskNode has been added to the deletion queue, but the current task is to delete the children of the taskNode
      if (task.taskNode.isDeleted()) {
        return;
      }
      if (task.type === NodeTask.SPLICE) {
        res[this.genUpdatePath([...task.parentPath, COMPLIER_NODES_STR, task.key])] = task.targetNode;
        if (task.children) {
          res[this.genUpdatePath([...task.parentPath, COMPLIER_CHILDREN_STR])] = task.children;
        }
        if (task.taskNode.type === NodeType.ROOT) {
          res[this.genUpdatePath([...task.parentPath, COMPLIER_TYPE_STR])] = task.taskNode.type;
          res[this.genUpdatePath([...task.parentPath, COMPLIER_KEY_STR])] = task.taskNode.key;
        }
      } else if (task.type === NodeTask.UPDATE) {
        res[this.genUpdatePath([...task.path, task.propName])] = task.propValue;
      }
    });
    this.context.setData(res, () => {
      miniEffect.run();
    });
    // monaPrint.debug('applyUpdate', {
    //   data: res,
    //   tasks: this.tasks,
    // });
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

  removeCallback(name: string | number) {
    this.context[name] = undefined;
    // delete this.context[name];
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
