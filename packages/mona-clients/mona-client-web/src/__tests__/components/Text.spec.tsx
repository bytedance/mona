import React from 'react';
import { mount } from 'enzyme';
import Text from '../../components/Text';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { TextProps } from '@bytedance/mona';


describe('web component: Text', () => {
  mountTest(Text)
  handlerTest({ Component: Text, firstTag: 'span' });

  it('should render correctly', () => {
    expect(mount(<Text />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: TextProps = {
      selectable: false,
      space: 'emsp',
      decode: true,
    }
    const wrapper = mount(<Text {...props}>hello</Text>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
