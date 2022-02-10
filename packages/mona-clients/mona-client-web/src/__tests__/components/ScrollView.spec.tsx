import React from 'react';
import { mount } from 'enzyme';
import ScrollView from '../../components/ScrollView';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { ScrollViewProps } from '@bytedance/mona';

describe('web component: ScrollView', () => {
  mountTest(ScrollView)
  handlerTest({ Component: ScrollView, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<ScrollView />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: ScrollViewProps = {
      scrollX: true,
      scrollY: true,
      scrollWithAnimation: true,
      upperThreshold: 10,
      lowerThreshold: 10,
      scrollTop: 10,
      scrollLeft: 10,
      scrollIntoView: 'hello',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<ScrollView {...props}>hello</ScrollView>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
