import TaskController, { Task } from './TaskController';
export default class ServerElement {
    type: string;
    taskController: TaskController;
    props?: any;
    text?: string;
    key: number;
    children: Map<number, ServerElement>;
    firstChildKey: number | null;
    lastChildKey: number | null;
    prevSiblingKey: number | null;
    nextSiblingKey: number | null;
    constructor({ type, props, taskController }: {
        type: string;
        taskController: TaskController;
        props?: any;
    });
    requestUpdate(task: Task): void;
    appendChild(child: ServerElement): void;
    removeChild(child: ServerElement): void;
    insertBefore(child: ServerElement, nextSibling: ServerElement): void;
}
