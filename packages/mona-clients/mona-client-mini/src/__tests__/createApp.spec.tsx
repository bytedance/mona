import React from 'react';
import createApp from '../createApp';
import { useAppEvent } from '@bytedance/mona';
describe('createApp', () => {
  let launchMock = jest.fn();
  beforeEach(() => {
    launchMock = jest.fn();
  });
  function App({ children }) {
    useAppEvent('onLaunch', (...rest) => {
      launchMock(...rest);
    });
    useAppEvent('onShow', (...rest) => {
      launchMock(...rest);
    });
    useAppEvent('onError', (...rest) => {
      launchMock(...rest);
    });
    useAppEvent('onHide', (...rest) => {
      launchMock(...rest);
    });
    useAppEvent('onPageNotFound', (...rest) => {
      launchMock(...rest);
    });
    return <>{children}</>;
  }
  class AppClass extends React.Component {
    onLaunch(...rest) {
      launchMock(...rest);
    }
    onShow(...rest) {
      launchMock(...rest);
    }
    onError(...rest) {
      launchMock(...rest);
    }
    onHide(...rest) {
      launchMock(...rest);
    }
    onPageNotFound(...rest) {
      launchMock(...rest);
    }
    render() {
      return <>{this.props.children}</>;
    }
  }

  ['onLaunch', 'onShow', 'onError', 'onHide', 'onPageNotFound'].forEach(name => {
    it('createApp FC lifeCycle ${name}', () => {
      const appConfig = createApp(App);
      appConfig.onLaunch({ name });
      expect(launchMock.mock.calls.length).toBe(1);
      expect(launchMock.mock.calls[0]).toEqual([{ name }]);
    });
    it(`createApp Class lifeCycle ${name}`, () => {
      const appConfig = createApp(AppClass);
      appConfig.onLaunch({ name });
      expect(launchMock.mock.calls.length).toBe(1);
      expect(launchMock.mock.calls[0]).toEqual([{ name }]);
    });
  });

  it('get App ref FC', () => {
    const refIns = jest.fn();

    const hoc = (App: React.ComponentType<any>) => {
      return React.forwardRef<any>((_, ref) => {
        refIns(ref);
        return <App ref={ref} />;
      });
    };
    const appConfig = createApp(hoc(App));
    appConfig.onLaunch({});
    expect(refIns.mock.calls[0]).toEqual([null]);
  });
});
