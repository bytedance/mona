import TaskController from '../../reconciler/TaskController';
import ServerElement, { generateId } from '../../reconciler/ServerElement';

// jest.mock('../utils');
// jest.mock('./TaskController');
// jest.mock('@bytedance/mona-shared/dist/constants');

describe('ServerElement', () => {
  let instance: ServerElement;
  let taskController: TaskController = new TaskController({ setData: () => {} });
  beforeEach(() => {
    instance = new ServerElement('view', taskController);
  });

  it('instance should be an instanceof ServerElement', () => {
    expect(instance instanceof ServerElement).toBeTruthy();
  });

  it('appendChild single', () => {
    const child = new ServerElement('view', taskController);
    instance.appendChild(child);
    expect(Array.from(instance.children.keys()).length).toBe(1);
    expect(instance.children.get(child.key)).toBeTruthy();
    expect(instance.firstChildKey === child.key).toBeTruthy();
    expect(instance.lastChildKey === child.key).toBeTruthy();
    expect(child.parent === instance).toBeTruthy();
  });

  it('removeChild single', () => {
    const child = new ServerElement('view', taskController);
    instance.appendChild(child);
    expect(Array.from(instance.children.keys()).length).toBe(1);
    instance.removeChild(child);
    expect(instance.children.get(child.key)).toBeFalsy();
    expect(Array.from(instance.children.keys()).length).toBe(0);
    expect(instance.firstChildKey).toBeNull();
    expect(instance.lastChildKey).toBeNull();
    expect(child.parent === instance).toBeFalsy();
  });
  it('removeChild single', () => {
    const child1 = new ServerElement('view', taskController);
    const child2 = new ServerElement('view', taskController);
    const child3 = new ServerElement('view', taskController);

    instance.appendChild(child1);
    instance.appendChild(child2);
    instance.appendChild(child3);
    expect(Array.from(instance.children.keys()).length).toBe(3);
    expect(child2.prevSiblingKey === child1.key).toBeTruthy();
    expect(child2.nextSiblingKey === child3.key).toBeTruthy();

    instance.removeChild(child1);
    expect(instance.children.get(child1.key)).toBeFalsy();
    expect(Array.from(instance.children.keys()).length).toBe(2);

    expect(instance.firstChildKey === child2.key).toBeTruthy();
    expect(instance.lastChildKey === child3.key).toBeTruthy();

    expect(child2.prevSiblingKey).toBeNull();
    expect(child2.nextSiblingKey === child3.key).toBeTruthy();

    instance.removeChild(child3);
    expect(child2.nextSiblingKey).toBeNull();
    expect(instance.firstChildKey === child2.key).toBeTruthy();
    expect(instance.lastChildKey === child2.key).toBeTruthy();

    instance.removeChild(child2);
    expect(instance.firstChildKey).toBeNull();
    expect(instance.lastChildKey).toBeNull();

    expect(child1.parent === instance).toBeFalsy();
    expect(child2.parent === instance).toBeFalsy();
    expect(child3.parent === instance).toBeFalsy();
  });

  it('should have a method insertBefore()', () => {
    const child1 = new ServerElement('view', taskController);
    const child2 = new ServerElement('view', taskController);
    const child3 = new ServerElement('view', taskController);
    const child4 = new ServerElement('view', taskController);

    instance.appendChild(child1);

    instance.insertBefore(child2, child1);

    expect(instance.children.get(child2.key)).toBeTruthy();
    expect(instance.firstChildKey === child2.key).toBeTruthy();
    expect(instance.lastChildKey === child1.key).toBeTruthy();
    expect(child1.prevSiblingKey === child2.key).toBeTruthy();
    expect(child2.prevSiblingKey).toBeNull();
    expect(child2.nextSiblingKey === child1.key).toBeTruthy();

    instance.insertBefore(child3, child1);
    expect(instance.firstChildKey === child2.key).toBeTruthy();
    expect(instance.lastChildKey === child1.key).toBeTruthy();

    expect(child1.prevSiblingKey === child3.key).toBeTruthy();
    expect(child2.prevSiblingKey).toBeNull();
    expect(child2.nextSiblingKey === child3.key).toBeTruthy();

    instance.insertBefore(child4, child2);
    expect(instance.firstChildKey === child4.key).toBeTruthy();
    expect(instance.lastChildKey === child1.key).toBeTruthy();

    expect(child4.prevSiblingKey).toBeNull();
    expect(child2.prevSiblingKey === child4.key).toBeTruthy();
    expect(child4.nextSiblingKey === child2.key).toBeTruthy();
  });

  it('should have a method update()', () => {
    // instance.update(propPath,updatePropsMap);
    instance = new ServerElement('view', taskController, { a: 1, b: 2 });
    instance = new ServerElement('text', taskController, { a: 1, b: 2 });

    instance.update('props', { a: 1 });

    instance.update('', { text: 1 });
  });

  it('should have a method serialize()', () => {
    instance.serialize();
  });

  it('should have a method reset()', () => {
    // instance.reset();
  });

  it('should have a method isMounted()', () => {
    instance.isMounted();
    expect(instance.isMounted()).toBeFalsy();
    taskController.appendChild(instance);
    expect(instance.isMounted()).toBeTruthy();
  });

  it('should have a method isDeleted()', () => {
    instance.isDeleted();
    expect(instance.isDeleted()).toBeFalsy();
    taskController.appendChild(instance);
    taskController.removeChild(instance);
    expect(instance.isDeleted()).toBeTruthy();
  });

  it('clean events', () => {
    const child1 = new ServerElement('view', taskController);
    const child3 = new ServerElement('view', taskController);
    const child4 = new ServerElement('view', taskController);

    instance.addCallback('1', () => {});
    child1.addCallback('2', () => {});
    child3.addCallback('3', () => {});
    child4.addCallback('4', () => {});
    child4.addCallback('5', () => {});
    child4.addCallback('6', () => {});

    instance.appendChild(child1);
    child1.appendChild(child3);
    child1.appendChild(child4);
    instance.clearEvents();
    const context = ['1', '2', '3', '4', '5', '6'].map(v => instance.taskController.context[v]).filter(Boolean);
    expect(context).toEqual([]);
  });
});

describe('generateId', () => {
  it('generateId', () => {
    expect(generateId).not.toThrow();
  });
});

// describe('NodeType', () => {});
