import React from 'react';
import { mount } from 'enzyme';
import RadioGroup from '../../components/RadioGroup';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { RadioGroupProps } from '@bytedance/mona';

describe('web component: RadioGroup', () => {
  mountTest(RadioGroup)
  handlerTest({ Component: RadioGroup, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<RadioGroup />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: RadioGroupProps = {
      name: 'hello',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<RadioGroup {...props}>hello</RadioGroup>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
