import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { Masking } from '../../apis/components/Masking';
import mountTest from '../../../../../tests/shared/mountTest';

configure({ adapter: new Adapter() });

describe('web api component: Masking', () => {
  mountTest(Masking);
  it('should execute when maskging handle trigger', () => {
    const handle = jest.fn();

    const wrapper = mount(<Masking onHandle={handle} />);
    wrapper.find('.mona-web-masking').first().simulate('click');
    expect(handle.mock.calls.length).toBe(1);
  });
});
