import React from 'react';
import { mount } from 'enzyme';
import Radio from '../../components/Radio';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { RadioProps } from '@bytedance/mona';

describe('web component: Radio', () => {
  mountTest(Radio)
  handlerTest({ Component: Radio, firstTag: 'div', clickTag: 'input' });

  it('should render correctly', () => {
    expect(mount(<Radio />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: RadioProps = {
      value: '10',
      checked: false,
      disabled: false,
      color: 'red',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Radio {...props}>hello</Radio>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
