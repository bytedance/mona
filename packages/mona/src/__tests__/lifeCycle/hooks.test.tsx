import React from 'react';
import { LifecycleContext, PageLifecycle, AppLifecycle, ComponentLifecycle } from '../../lifecycle/context';
import { useAppEvent, usePageEvent } from '../../lifecycle/hooks';
import { configure, shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });

let ctx: LifecycleContext = new LifecycleContext();

jest.mock('react', () => {
  const originalModule = jest.requireActual('react');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    default: originalModule,
    useContext: () => {
      return ctx;
    },
  };
});

describe('lifeCycle hooks', () => {
  const cb = () => {};
  const Test = () => {
    useAppEvent(AppLifecycle.launch, cb);

    return <>123,321</>;
  };
  const Test2 = () => {
    useAppEvent(AppLifecycle.launch, () => {});

    return <>123,321</>;
  };
  const Test5 = () => {
    useAppEvent(AppLifecycle.launch, () => {});
    useAppEvent(AppLifecycle.launch, () => {});
    useAppEvent(AppLifecycle.launch, () => {});

    useAppEvent(AppLifecycle.hide, () => {});
    useAppEvent(AppLifecycle.error,cb);
    useAppEvent(AppLifecycle.error,cb);
    useAppEvent(AppLifecycle.error,cb);

    return <>123,321</>;
  };
  const Test3 = () => {
    usePageEvent(PageLifecycle.load, cb);

    return <>123,321</>;
  };
  const Test4 = () => {
    usePageEvent(PageLifecycle.load, () => {});

    return <>123,321</>;
  };
  beforeEach(() => {
    ctx = new LifecycleContext();
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('useAppEvent', () => {
    let app = mount(<Test />);
    // app.unmount()

    expect(ctx.lifecycle[AppLifecycle.launch].has(cb)).toBeTruthy();
    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(1);
    app.unmount();
    expect(ctx.lifecycle[AppLifecycle.launch].has(cb)).toBeFalsy();
    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(0);
  });

  it('useAppEvent any times', () => {
    let app = mount(<Test5 />);
    // app.unmount()
    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(3);
    // app.unmount();
    expect(Array.from(ctx.lifecycle[AppLifecycle.error].values()).length).toBe(1);
    expect(Array.from(ctx.lifecycle[AppLifecycle.hide].values()).length).toBe(1);

    app.unmount();
    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(0);
    // app.unmount();
    expect(Array.from(ctx.lifecycle[AppLifecycle.error].values()).length).toBe(0);
    expect(Array.from(ctx.lifecycle[AppLifecycle.hide].values()).length).toBe(0);
  });

  it('useAppEvent rerender', () => {
    let app = mount(<Test2 />);
    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(1);

    // forceRender
    app.setProps({});
    app.setProps({});

    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(1);

    app.unmount();
    expect(Array.from(ctx.lifecycle[AppLifecycle.launch].values()).length).toBe(0);
  });

  it('usePageEvent', () => {
    let page = mount(<Test3 />);
    // app.unmount()

    expect(ctx.lifecycle[PageLifecycle.load].has(cb)).toBeTruthy();
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(1);
    page.unmount();
    expect(ctx.lifecycle[PageLifecycle.load].has(cb)).toBeFalsy();
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(0);
  });

  it('usePageEvent rerender', () => {
    let page = mount(<Test4 />);
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(1);

    // forceRender
    page.setProps({});
    page.setProps({});

    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(1);

    page.unmount();
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(0);
  });
});
