import { diffProperties, processProps, genCbName } from '../../reconciler/processProps';
import ServerElement from '../../reconciler/ServerElement';
import TaskController from '../../reconciler/TaskController';

describe('props', () => {
  test('common prop diffProperties', () => {
    expect(diffProperties({ a: 1 }, { b: 2 })).toEqual({ b: 2, a: undefined });
    expect(diffProperties({ a: 1 }, { a: 2 })).toEqual({ a: 2 });

    expect(diffProperties({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
    expect(diffProperties({ a: 1 }, { a: 2, b: 2 })).toEqual({ a: 2, b: 2 });
    expect(diffProperties({ a: 1, b: 1 }, { a: 2 })).toEqual({ b: undefined, a: 2 });
    expect(diffProperties({ a: 1, b: 1 }, { a: 1 })).toEqual({ b: undefined });
    expect(diffProperties({ a: 1, b: 1 }, {})).toEqual({ b: undefined, a: undefined });
    expect(diffProperties({ a: 1, b: 2 }, { c: 3, d: 4 })).toEqual({ c: 3, d: 4, a: undefined, b: undefined });
  });
  test('style diffProperties', () => {
    expect(diffProperties({ style: { color: 'white' } }, { style: { color: 'white' } })).toEqual({});
    expect(diffProperties({ style: { color: 'white' } }, { style: { color: 'red' } })).toEqual({
      style: { color: 'red' },
    });

    expect(diffProperties({ style: { color: 'white' } }, { style: { color: 'red', background: 'blue' } })).toEqual({
      style: { color: 'red', background: 'blue' },
    });
    expect(
      diffProperties(
        { style: { color: 'red', background: 'blue', padding: 0, margin: 0 } },
        { style: { color: 'red', background: 'blue', padding: 0, margin: 0 } },
      ),
    ).toEqual({});
  });

  test('processProps', () => {
    const taskController = new TaskController({ setData: () => {} });
    const instance = new ServerElement('view', taskController, {});
    const updateObj = {
      a: 1,
      b: true,
      c: '123123',

      onTap: e => {
        return '测试';
      },
      onTouchCancel: '啦啦啦啦onTouchCancel',
      style: {
        color: 'red',
        fontSize: '16px',
      },
      maskStyle: '这是一个名称',
      children: [],
      key: instance.key,
    };
    const newProp = processProps(updateObj, instance);
    expect(newProp.a).toBe(updateObj.a);
    expect(newProp.b).toBe(updateObj.b);
    expect(newProp.c).toBe(updateObj.c);
    expect(newProp.onTouchCancel).toBe(updateObj.onTouchCancel);
    expect(newProp.maskStyle).toBe(updateObj.maskStyle);
    expect(newProp.key).toBeUndefined();
    expect(newProp.children).toBeUndefined();
    const cbKey = genCbName('onTap', instance);
    expect(newProp.onTap).toBe(cbKey);
    expect(taskController.context[cbKey]({})).toBe(updateObj.onTap({}));
  });
});
