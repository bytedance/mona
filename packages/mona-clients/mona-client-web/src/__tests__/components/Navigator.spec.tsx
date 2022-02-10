import React from 'react';
import { mount } from 'enzyme';
import Navigator from '../../components/Navigator';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { NavigatorProps } from '@bytedance/mona';

describe('web component: Navigator', () => {
  mountTest(Navigator)
  handlerTest({ Component: Navigator, firstTag: 'a' });

  it('should render correctly', () => {
    expect(mount(<Navigator url="/" />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: NavigatorProps = {
      url: '/',
      delta: 0,
      openType: 'navigate',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Navigator {...props}>hello</Navigator>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
