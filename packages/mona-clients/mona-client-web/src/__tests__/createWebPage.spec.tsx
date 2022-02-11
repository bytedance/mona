import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { usePageEvent, PageLifecycle } from '@bytedance/mona';
import { createPageLifecycle } from '../createWebPage';
// import createApp from '../createApp';
import { configure, mount } from 'enzyme';

import mountTest from '../../../../tests/shared/mountTest';

configure({ adapter: new Adapter() });

describe('createPageLifecycle', () => {
  let launchMock = jest.fn();
  beforeEach(() => {
    launchMock = jest.fn();
  });

  function Page({ name }) {
    usePageEvent(PageLifecycle.load, (...rest) => {
      launchMock(...rest, 'load');
    });
    usePageEvent(PageLifecycle.ready, (...rest) => {
      launchMock(...rest, 'ready');
    });
    usePageEvent(PageLifecycle.unload, (...rest) => {
      launchMock(...rest, 'unload');
    });
    return <>fc组件{name}</>;
  }
  class PageClass extends React.Component<{ name: string }> {
    onLoad(...rest) {
      launchMock(...rest, 'onLoad');
    }
    onReady(...rest) {
      launchMock(...rest, 'onReady');
    }
    onUnload(...rest) {
      launchMock(...rest, 'onUnload');
    }
    render() {
      return <>class组件{this.props.name}</>;
    }
  }
  mountTest(createPageLifecycle(Page));
  mountTest(createPageLifecycle(PageClass));

  it('createPageLifecycle FC lifeCycle', () => {
    const PageComponent = createPageLifecycle(Page);
    const PageIns = mount(<PageComponent name="mona" />);
    expect(PageIns.render()).toMatchSnapshot();

    // PageIns.props
    expect(PageIns.prop('name')).toBe('mona');

    expect(launchMock.mock.calls.length).toBe(2);
    PageIns.unmount();
    // console.log(launchMock.mock.calls);
    expect(launchMock.mock.calls.length).toBe(3);
  });
  it(`createPageLifecycle Class lifeCycle `, () => {
    const PageComponent = createPageLifecycle(PageClass);
    const PageIns = mount(<PageComponent name="mona" />);
    expect(PageIns.render()).toMatchSnapshot();

    // console.log(' PageIns.find("Component")', PageIns.find('Component'));
    expect(PageIns.prop('name')).toBe('mona');

    expect(launchMock.mock.calls.length).toBe(2);

    // expect(PageIns.)
    PageIns.unmount();
    // console.log(launchMock.mock.calls);
    expect(launchMock.mock.calls.length).toBe(3);
  });
});
