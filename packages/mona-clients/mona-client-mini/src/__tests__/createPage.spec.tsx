import React from 'react';
import { usePageEvent } from '@bytedance/mona';
import createPage from '../createPage';
import createApp from '../createApp';

describe('createPage', () => {
  let app;
  beforeEach(() => {
    app = createApp(({ children }) => <>{children}</>);
    app.onLaunch({});

    globalThis.getApp = () => app;
    launchMock = jest.fn();
  });
  afterAll(() => {
    globalThis.getApp = undefined;
  });
  let launchMock = jest.fn();

  function Page({ children }) {
    usePageEvent('onLoad', (...rest) => {
      launchMock(...rest);
    });
    usePageEvent('onUnLoad', (...rest) => {
      launchMock(...rest);
    });
    return <>{children}</>;
  }
  class PageClass extends React.Component {
    onLoad(...rest) {
      launchMock(...rest);
    }
    onUnLoad(...rest) {
      launchMock(...rest);
    }
    render() {
      return <>{this.props.children}</>;
    }
  }

  ['onLoad', 'onUnLoad'].forEach(name => {
    it('createPage FC lifeCycle ${name}', () => {
      const pageConfig = createPage(Page);
      pageConfig.onLoad({ name });
      expect(launchMock.mock.calls.length).toBe(1);
      expect(launchMock.mock.calls[0]).toEqual([{ name }]);
    });
    it('createPage Class lifeCycle ${name}', () => {
      const pageConfig = createPage(PageClass);
      pageConfig.onLoad({ name });
      expect(launchMock.mock.calls.length).toBe(1);
      expect(launchMock.mock.calls[0]).toEqual([{ name }]);
    });
  });

  it('page Load', () => {
    const pageConfig = createPage(Page);
    pageConfig.onLoad({});
    expect(app._pages.length).toBe(1);
    pageConfig.onUnload();
    expect(app._pages.length).toBe(0);
  });
  it('createPage when app null', () => {
    globalThis.getApp = () => null;
    const pageConfig = createPage(Page);
    pageConfig.onLoad({});
    pageConfig.onUnload();
  });
});
