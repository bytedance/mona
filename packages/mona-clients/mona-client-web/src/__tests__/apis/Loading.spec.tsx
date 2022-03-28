import { configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Toastconfirm, ToastType, Toast } from '../../apis/components/Toast';
import mountTest from '../../../../../tests/shared/mountTest';
configure({ adapter: new Adapter() });

describe('web api component: Loading', () => {
  mountTest(Toast);
  function open(args?: any) {
    jest.useFakeTimers();
    Toastconfirm(
      {
        title: 'test',
        ...args,
      },
      ToastType.loading,
    );
    jest.runAllTimers();
    jest.useRealTimers();
  }

  it('should not render toast when title not defined', () => {
    jest.useFakeTimers();
    // @ts-ignore ignore
    Toastconfirm();
    jest.runAllTimers();
    expect(document.querySelector('.mona-web-toast-body')).toBe(null);
    jest.useRealTimers();
  });

  it('success func execute when render', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();
    open({
      fail,
      success,
      complete,
    });
    expect(fail.mock.calls.length).toBe(0);
    expect(success.mock.calls.length).toBe(1);
    expect(complete.mock.calls.length).toBe(1);
  });

  it('classname is loading when render default ToastType', () => {
    open();

    expect(document.querySelector('.mona-web-toast-success-img')).toBe(null);
    expect(document.querySelector('.mona-web-toast-loading-img')).toBeTruthy();
  });
});
