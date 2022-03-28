import React from 'react';
import { mount } from 'enzyme';
import Swiper from '../../components/Swiper';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { SwiperProps } from '@bytedance/mona';

describe('web component: Swiper', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  })
  afterEach(() => {
    jest.useRealTimers();
  })
  mountTest(Swiper)
  handlerTest({ Component: Swiper, firstTag: 'div', props: { children: [<div key="1"></div>] } });

  it('should render correctly', () => {
    expect(mount(<Swiper />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: SwiperProps = {
      indicatorDots: false,
      indicatorColor: 'red',
      indicatorActiveColor: 'blue',
      autoplay: true,
      current: 10,
      currentItemId: 'hello',
      interval: 10,
      previousMargin: '10px',
      nextMargin: '10px',
      displayMultipleItems: 2,
      duration: 10,
      circular: true,
      vertical: true,
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Swiper {...props}>hello</Swiper>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
