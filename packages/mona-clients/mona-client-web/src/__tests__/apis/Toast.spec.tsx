import React from 'react';
import { ShowToastOptions } from '@bytedance/mona';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { webShowToast, Toast, Toastconfirm } from '../../apis/components/Toast';

configure({ adapter: new Adapter() });

describe('web api component: Toast', () => {
  function open(args?: Partial<ShowToastOptions>) {
    jest.useFakeTimers();
    Toastconfirm({ title: 'test', ...args });
    jest.runAllTimers();
    jest.useFakeTimers();
  }

  it('should not render when title not define', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();
    // @ts-ignore ignore
    webShowToast({
      fail,
      success,
      complete,
    });
    expect(document.querySelector('.mona-web-toast')).toBe(null);
    expect(fail.mock.calls.length).toBe(1);
    expect(success.mock.calls.length).toBe(0);
    expect(complete.mock.calls.length).toBe(1);
  });

  it('should render success icon when only title', () => {
    open();
    expect(document.querySelector('.mona-web-toast-body')).toBeTruthy();
    expect(document.querySelector('.mona-web-toast-success-img')).toBeTruthy();
    expect(document.querySelector('.mona-web-toast-body').children.length).toBe(2);
  });

  it('should not has icon when icon is none', () => {
    open({ icon: 'none' });
    expect(document.querySelector('.mona-web-toast-body')).toBeTruthy();
    expect(document.querySelector('.mona-web-toast-body').children.length).toBe(1);
  });

  it('should render fail icon when icon is fail', () => {
    open({ icon: 'fail' });
    expect(document.querySelector('.mona-web-toast-body')).toBeTruthy();
    expect(document.querySelector('.mona-web-toast-none-img')).toBeTruthy();
    expect(document.querySelector('.mona-web-toast-body').children.length).toBe(2);
  });
});
