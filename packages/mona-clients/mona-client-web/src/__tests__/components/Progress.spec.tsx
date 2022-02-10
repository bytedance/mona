import React from 'react';
import { mount } from 'enzyme';
import Progress from '../../components/Progress';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { ProgressProps } from '@bytedance/mona';

describe('web component: Progress', () => {
  mountTest(Progress)
  handlerTest({ Component: Progress, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<Progress />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: ProgressProps = {
      percent: 50,
      strokeWidth: 10,
      color: 'red',
      activeColor: 'blue',
      backgroundColor: 'yellow',
      active: true,
      activeMode: 'forwards',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Progress {...props}>hello</Progress>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
