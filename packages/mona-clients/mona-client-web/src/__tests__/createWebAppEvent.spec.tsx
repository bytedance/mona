import React, { useEffect } from 'react';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { useAppEvent, AppLifecycle } from '@bytedance/mona';
import { createAppLifeCycle } from '../createWebAppEvent';
import enzyme, { configure, mount } from 'enzyme';
import mountTest from '../../../../tests/shared/mountTest';
import { NoMatch } from '../createWebApp';

configure({ adapter: new Adapter() });

describe('createAppLifecycle', () => {
  let launchMock = jest.fn();
  let PageNotFoundMock = jest.fn();
  let VisibleMock = jest.fn();
  let ErrorMock = jest.fn();

  beforeEach(() => {
    launchMock = jest.fn();
    PageNotFoundMock = jest.fn();
    VisibleMock = jest.fn();
    ErrorMock = jest.fn();
  });

  function App({ name }) {
    useAppEvent(AppLifecycle.launch, (...rest) => {
      launchMock(...rest, 'launch');
    });
    useAppEvent(AppLifecycle.pageNotFound, (...rest) => {
      PageNotFoundMock(...rest, 'pageNotFound');
    });
    useAppEvent(AppLifecycle.show, (...rest) => {
      VisibleMock(...rest, 'show');
    });
    useAppEvent(AppLifecycle.hide, (...rest) => {
      VisibleMock(...rest, 'hide');
    });
    // useAppEvent(AppLifecycle.error, (...rest) => {
    //   console.log('error出发了');
    // });
    return <>fc组件{name}</>;
  }
  class AppClass extends React.Component<{ name: string }> {
    onLaunch(...rest) {
      launchMock(...rest, 'onLoad');
    }
    onPageNotFound(...rest) {
      PageNotFoundMock(...rest, 'class', 'pageNotFound');
    }
    onShow(...rest) {
      VisibleMock(...rest, 'show');
    }
    onHide(...rest) {
      VisibleMock(...rest, 'hide');
    }
    render() {
      return <>class组件{this.props.name}</>;
    }
  }

  mountTest(createAppLifeCycle(App));
  mountTest(createAppLifeCycle(AppClass));

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
    // console.log("windowxxxx",window)
    // AppIns.instance.
    expect(AppIns.render()).toMatchSnapshot();

    expect(AppIns.prop('name')).toBe('mona');

    expect(launchMock.mock.calls.length).toBe(1);

    AppIns.unmount();
  });

  it('func pageNotFound', () => {
    const PageClassComponent = createAppLifeCycle(AppClass);
    mount(<PageClassComponent name="mona" />);
    mount(<NoMatch defaultPath="/path/a/b" />);
    // console.log(PageNotFoundMock.mock.calls);

    expect(PageNotFoundMock.mock.calls.length).toBe(1);
    expect(PageNotFoundMock.mock.calls).toMatchSnapshot();
    // PageNotFoundMock
  });
  it('class pageNotFound', () => {
    const PageComponent = createAppLifeCycle(App);
    mount(<PageComponent name="mona" />);
    mount(<NoMatch defaultPath="/path/a/b" />);
    // console.log(PageNotFoundMock.mock.calls);

    expect(PageNotFoundMock.mock.calls.length).toBe(1);
    expect(PageNotFoundMock.mock.calls).toMatchSnapshot();
    // PageNotFoundMock
  });

  it('func show & hide', () => {
    const PageComponent = createAppLifeCycle(App);

    mount(<PageComponent name="mona" />);
    expect(VisibleMock.mock.calls.length).toBe(1);
    expect(VisibleMock.mock.calls).toMatchSnapshot();
  });
  it('class show & hide', () => {
    const PageClassComponent = createAppLifeCycle(AppClass);

    mount(<PageClassComponent name="mona" />);
    expect(VisibleMock.mock.calls.length).toBe(1);
    expect(VisibleMock.mock.calls).toMatchSnapshot();
  });

  function AppError({ name }) {
    useAppEvent(AppLifecycle.error, (...rest) => {
      ErrorMock(...rest, 'error');
    });
    useEffect(() => {
      throw new Error('触发一个错误');
    }, []);
    return <>fc组件{name}</>;
  }
  class AppErrorClass extends React.Component<{ name: string; onClick: any }> {
    onError(...rest) {
      ErrorMock(...rest, 'error');
    }

    render() {
      return (
        <>
          class组件{this.props.name}
          <div className="error" onClick={this.props.onClick}></div>
        </>
      );
    }
  }

  it('func error', () => {
    const AppComponent = createAppLifeCycle(AppError);
    try {
      mount(<AppComponent name="mona" />);
    } catch {}
    expect(ErrorMock.mock.calls.length).toBe(1);
    expect(ErrorMock.mock.calls).toMatchSnapshot();
  });

  it('class error', () => {
    const AppComponent = createAppLifeCycle(AppErrorClass);
    try {
      const ins = mount(
        <AppComponent
          name="mona"
          onClick={() => {
            throw new Error('触发一个错误');
          }}
        />,
      );
      ins.find('.error').simulate('click', {});
    } catch {}
    expect(ErrorMock.mock.calls.length).toBe(1);
    expect(ErrorMock.mock.calls).toMatchSnapshot();
  });
});
