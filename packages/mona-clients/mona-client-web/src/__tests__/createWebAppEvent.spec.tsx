import React from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { useAppEvent, AppLifecycle } from '@bytedance/mona';
import { createAppLifeCycle } from '../createWebAppEvent';
import { configure, mount } from 'enzyme';

configure({ adapter: new Adapter() });

describe('createPageLifecycle', () => {
  let launchMock = jest.fn();
  beforeEach(() => {
    launchMock = jest.fn();
  });

  function App({ name }) {
    useAppEvent(AppLifecycle.launch, (...rest) => {
      launchMock(...rest, 'load');
    });

    return <>fc组件{name}</>;
  }
  class AppClass extends React.Component<{ name: string }> {
    onLaunch(...rest) {
      launchMock(...rest, 'onLoad');
    }
    render() {
      return <>class组件{this.props.name}</>;
    }
  }

  it('createPageLifecycle FC lifeCycle', () => {
    const PageComponent = createAppLifeCycle(App);
    const AppIns = mount(<PageComponent name="mona" />);
    expect(AppIns.render()).toMatchSnapshot();

    // AppIns.props
    expect(AppIns.prop('name')).toBe('mona');

    expect(launchMock.mock.calls.length).toBe(1);
    AppIns.unmount();
  });
  it(`createPageLifecycle Class lifeCycle `, () => {
    const PageComponent = createAppLifeCycle(AppClass);
    const AppIns = mount(<PageComponent name="mona" />);
    expect(AppIns.render()).toMatchSnapshot();

    expect(AppIns.prop('name')).toBe('mona');

    expect(launchMock.mock.calls.length).toBe(1);

    AppIns.unmount();
  });
});
