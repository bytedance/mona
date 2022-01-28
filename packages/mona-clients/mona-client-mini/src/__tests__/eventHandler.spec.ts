import ServerElement from '../reconciler/ServerElement';
import { isPropagationStop, eventReactAliasMap } from '../eventHandler/constants';
import createEventHandler from '../eventHandler/index';
import TaskController from '../reconciler/TaskController';

// jest.mock('../reconciler/ServerElement');
// jest.mock('./constants');
// new ServerElement({type})
describe('createEventHandler', () => {
  const context = new TaskController({});
  const node = new ServerElement('view', context, {});
  const child = new ServerElement('view', context, {});
  const parent = new ServerElement('view', context, {});
  node.appendChild(child);
  parent.appendChild(node);

  it('stopPropagation', () => {
    const myMock = jest.fn();

    node.props.onTap = e => {
      myMock('node');
    };
    child.props.onTap = e => {
      e.stopPropagation();
      myMock('child');
    };
    parent.props.onTap = undefined;

    const handler = createEventHandler(child, eventReactAliasMap.tap, child.props.onTap);

    handler({ type: 'tap' });

    expect(isPropagationStop['tap']).toBeTruthy();

    const nodeHandler = createEventHandler(node, eventReactAliasMap.tap, node.props.onTap);
    nodeHandler({ type: 'tap' });

    expect(myMock.mock.calls.length).toBe(1);

    expect(isPropagationStop['tap']).toBeFalsy();
  });

  it('Propagation', () => {
    const myMock = jest.fn();
    node.props.onTap = e => {
      myMock('node');
    };
    child.props.onTap = e => {
      myMock('child');
    };
    parent.props.onTap = e => {
      myMock('parent');
    };

    const handler = createEventHandler(child, eventReactAliasMap.tap, child.props.onTap);
    const nodeHandler = createEventHandler(node, eventReactAliasMap.tap, node.props.onTap);
    const parentHandler = createEventHandler(parent, eventReactAliasMap.tap, parent.props.onTap);

    handler({ type: 'tap' });
    nodeHandler({ type: 'tap' });
    expect(isPropagationStop['tap']).toBeFalsy();
    parentHandler({ type: 'tap' });
    expect(isPropagationStop['tap']).toBeFalsy();
    expect(myMock.mock.calls.length).toBe(3);
  });
});
