import React from 'react';
import { mount } from 'enzyme';
import Slider from '../../components/Slider';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { SliderProps } from '@bytedance/mona';

describe('web component: Slider', () => {
  mountTest(Slider)
  handlerTest({ Component: Slider, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<Slider />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: SliderProps = {
      name: 'a',
      min: 10,
      max: 100,
      step: 10,
      disabled: false,
      value: 20,
      color: 'red',
      selectedColor: 'blue',
      activeColor: 'yellow',
      backgroundColor: 'grey',
      blockSize: 10,
      blockColor: 'skublue',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Slider {...props}>hello</Slider>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
