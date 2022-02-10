import React from 'react';
import { mount } from 'enzyme';
import RichText from '../../components/RichText';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { RichTextProps } from '@bytedance/mona';

describe('web component: RichText', () => {
  mountTest(RichText)
  handlerTest({ Component: RichText, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<RichText />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: RichTextProps = {
      nodes: '<view>hello</view>',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<RichText {...props}>hello</RichText>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
