import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { PreviewImage } from '../../apis/components/PreviewImage';
import mountTest from '../../../../../tests/shared/mountTest';

configure({ adapter: new Adapter() });

describe('web api component: PreviewImage', () => {
  mountTest(PreviewImage);

  it('should execute when preview next image handle trigger', () => {
    const fail = jest.fn();
    const success = jest.fn();
    const complete = jest.fn();

    const wrapper = mount(<PreviewImage {...{ urls: ['a.png', 'b.png'], fail, success, complete }} />);
    wrapper.find('.mona-web-preview-image-arrow-right').first().simulate('click');
    expect(fail.mock.calls.length).toBe(0);
    expect(success.mock.calls.length).toBe(1);
    expect(complete.mock.calls.length).toBe(1);
  });
});
