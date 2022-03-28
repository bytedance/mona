import React from 'react';
import { mount } from 'enzyme';
import Picker from '../../components/Picker';
import mountTest from '../../../../../tests/shared/mountTest';
// import handlerTest from '../../../../../tests/shared/handlerTest';
import { PickerProps } from '@bytedance/mona';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('web component: Picker', () => {
  mountTest(Picker)
  // handlerTest({ Component: Picker, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<Picker mode="region" />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: PickerProps = {
      mode: 'region',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Picker {...props}>hello</Picker>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
