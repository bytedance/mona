import ServerElement, { RenderNode, NodeType } from '../../reconciler/ServerElement';
import TaskController from '../../reconciler/TaskController';

describe('TaskController', () => {
  let instance: TaskController;
  let context = {
    setData: jest.fn(),
  };
  let mockFn;
  let parent: ServerElement, child: ServerElement;
  beforeEach(() => {
    instance = new TaskController(context);
    parent = new ServerElement('view', instance, {});
    child = new ServerElement('view', instance, {});
    context.setData = jest.fn();
    mockFn = jest.fn();
  });

  it('instance should be an instanceof TaskController', () => {
    expect(instance instanceof TaskController).toBeTruthy();
  });

  it('appendChild, removeChild,insertBefore', () => {
    // 属于ServeElement的范畴
    instance.appendChild(parent);
    instance.insertBefore(child, parent);

    instance.removeChild(parent);
    instance.removeChild(child);
  });

  it('requestUpdate()', () => {
    instance.requestUpdate = mockFn;
    parent.appendChild(child);
    expect(mockFn.mock.calls.length).toBe(0);
    instance.appendChild(parent);
    expect(mockFn.mock.calls.length).toBe(1);
    instance.removeChild(parent);
    expect(mockFn.mock.calls.length).toBe(2);
    parent.removeChild(child);
    expect(mockFn.mock.calls.length).toBe(2);
  });

  it('applyUpdate()', () => {
    // instance.applyUpdate();
    instance.applyUpdate();
    expect(context.setData.mock.calls.length).toBe(0);
    parent.appendChild(child);
    instance.appendChild(parent);
    instance.applyUpdate();
    expect(context.setData.mock.calls.length).toBe(1);
  });

  it('genUpdatePath()', () => {
    expect(instance.genUpdatePath(['a', 'b', 'c'])).toBe(`${instance.rootKey}.a.b.c`);
  });

  it('stopUpdate()', () => {
    instance.stopUpdate();
    instance.appendChild(parent);
    instance.applyUpdate();
    expect(context.setData.mock.calls.length).toBe(0);
  });

  it('addCallback()', () => {
    // instance.addCallback(cbKey,cb);
    instance.addCallback('tt', () => {});
    expect(instance.context['tt']).toBeTruthy();
  });

  it('removeCallback()', () => {
    instance.addCallback('tt', () => {});
    instance.removeCallback('tt');
    expect(instance.context['tt']).toBeFalsy();
  });
});
