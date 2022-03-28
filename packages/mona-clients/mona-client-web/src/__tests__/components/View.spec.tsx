import React from 'react';
import { mount } from 'enzyme';
import View from '../../components/View';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { ViewProps } from '@bytedance/mona';


describe('web component: View', () => {
  mountTest(View)
  handlerTest({ Component: View, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<View />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: ViewProps = {
     className: 'class-name',
     id: 'hello'
    }
    const wrapper = mount(<View {...props}>hello</View>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
