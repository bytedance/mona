import React from 'react';
import { ActionSheetProps } from '@bytedance/mona';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { webShowActionSheet, ActionSheet, MONA_WEB_ACTION_SHEET } from '../../apis/components/ActionSheet';
import mountTest from '../../../../../tests/shared/mountTest';

configure({ adapter: new Adapter() });

describe('web api component: ActionSheet', () => {
  mountTest(ActionSheet);

  function open(args?: ActionSheetProps) {
    jest.useFakeTimers();
    webShowActionSheet(args);
    jest.runAllTimers();
    jest.useRealTimers();
  }

  it('should not render ActionSheet when itemList not defined', () => {
    open();
    expect(document.querySelector(MONA_WEB_ACTION_SHEET)).toBe(null);
  });

  it('should not render when itemList not Array', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();
    open({
      // @ts-ignore ignore
      itemList: 'item1',
      fail,
      complete,
    });
    expect(document.querySelector(MONA_WEB_ACTION_SHEET)).toBe(null);
    expect(fail.mock.calls.length).toBe(1);
    expect(success.mock.calls.length).toBe(0);
    expect(complete.mock.calls.length).toBe(1);
  });

  it('should success when itemList click', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();
    const wrapper = mount(<ActionSheet {...{ itemList: ['item1', 'item2'], success, complete }} />);
    wrapper.find('.mona-web-action-sheet-item').first().simulate('click');
    expect(fail.mock.calls.length).toBe(0);
    expect(success.mock.calls.length).toBe(1);
    expect(complete.mock.calls.length).toBe(1);
  });
});
