import React from 'react';
import { mount } from 'enzyme';
import Checkbox from '../../components/Checkbox';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { CheckboxProps } from '@bytedance/mona';

describe('web component: Checkbox', () => {
  mountTest(Checkbox)
  handlerTest({ Component: Checkbox, clickTag: 'input' });

  it('should render correctly', () => {
    expect(mount(<Checkbox>Hello world</Checkbox>).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: CheckboxProps = {
      value: 'apple',
      checked: true,
      disabled: true,
      color: 'red',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Checkbox {...props}>hello</Checkbox>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
