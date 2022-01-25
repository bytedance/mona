import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { webShowModal, Modal } from '../../apis/components/Modal';
import mountTest from '../../../../../tests/shared/mountTest';

configure({ adapter: new Adapter() });

describe('web api component: Modal', () => {
  mountTest(Modal);

  it('should not render when title or content not define', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();
    webShowModal({
      fail,
      success,
      complete,
    });
    expect(document.querySelector('.mona-web-modal')).toBe(null);
    expect(fail.mock.calls.length).toBe(1);
    expect(success.mock.calls.length).toBe(0);
    expect(complete.mock.calls.length).toBe(1);
  });

  it('should success when modal ok click', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();

    const wrapper = mount(<Modal {...{ title: 'test', fail, success, complete }} />);
    wrapper.find('.mona-web-modal-button').last().simulate('click');
    expect(fail.mock.calls.length).toBe(0);
    expect(success.mock.calls.length).toBe(1);
    expect(complete.mock.calls.length).toBe(1);
  });
});
