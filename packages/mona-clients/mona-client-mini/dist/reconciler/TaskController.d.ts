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
    constructor(context: any);
    requestUpdate(task: Task): void;
    applyUpdate(): void;
}
