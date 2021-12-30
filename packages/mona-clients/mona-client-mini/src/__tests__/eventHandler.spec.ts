import ServerElement from '../reconciler/ServerElement';
import { isPropagationStop, eventReactAliasMap, bubbleEventMap, MonaEvent } from '../eventHandler/constants';
import createEventHandler  from '../eventHandler/index';

// jest.mock('../reconciler/ServerElement');
// jest.mock('./constants');
// new ServerElement({type})
describe('createEventHandler', () => {
  it('should expose a function', () => {
    // const retValue = createEventHandler(node,eventName,cb);
    expect(false).toBeTruthy();
  });
});