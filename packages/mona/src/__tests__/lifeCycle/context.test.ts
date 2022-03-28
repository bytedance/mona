import { LifecycleContext, PageLifecycle, AppLifecycle, ComponentLifecycle } from '../../lifecycle/context';

describe('lifeCycleName', () => {
  it('AppLifecycle SnapShot', () => {
    expect(AppLifecycle).toMatchSnapshot();
  });

  it('PageLifecycle SnapShot', () => {
    expect(PageLifecycle).toMatchSnapshot();
  });

  it('ComponentLifecycle SnapShot', () => {
    expect(ComponentLifecycle).toMatchSnapshot();
  });
});

describe('LifecycleContext', () => {
  let ctx: LifecycleContext;
  const testCb1 = () => {};
  const testCb2 = () => {};

  beforeEach(() => {
    ctx = new LifecycleContext();
  });
  it('don’t  pass same cb', () => {
    // repeat
    ctx.registerLifecycle('load', () => {});
    ctx.registerLifecycle('onLoad', () => {});
    ctx.registerLifecycle('OnLoad', () => {});
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(3);
  });
  it('pass same cb', () => {
    // repeat
    ctx.registerLifecycle('load', testCb1);
    ctx.registerLifecycle('onLoad', testCb1);
    ctx.registerLifecycle('OnLoad', testCb1);
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(1);
  });
  it('clear', () => {
    // repeat
    const clear1 = ctx.registerLifecycle(PageLifecycle.load, testCb1);
    ctx.registerLifecycle(PageLifecycle.load, testCb1);
    const clear2 = ctx.registerLifecycle(PageLifecycle.load, testCb2);
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(2);
    expect(ctx.lifecycle[PageLifecycle.load].has(testCb2)).toBeTruthy();
    expect(ctx.lifecycle[PageLifecycle.load].has(testCb1)).toBeTruthy();

    // clear()
    clear1();
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(1);
    expect(ctx.lifecycle[PageLifecycle.load].has(testCb1)).toBeFalsy();
    expect(ctx.lifecycle[PageLifecycle.load].has(testCb2)).toBeTruthy();

    // clear2()
    clear2();
    expect(Array.from(ctx.lifecycle[PageLifecycle.load].values()).length).toBe(0);
  });
});
