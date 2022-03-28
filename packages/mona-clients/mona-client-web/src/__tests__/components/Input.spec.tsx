import React from 'react';
import { mount } from 'enzyme';
import Input from '../../components/Input';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { InputProps } from '@bytedance/mona';

describe('web component: Input', () => {
  mountTest(Input)
  handlerTest({ Component: Input, firstTag: 'input' });

  it('should render correctly', () => {
    expect(mount(<Input />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: InputProps = {
      value: 'hello',
      type: 'number',
      password: true,
      placeholder: 'hello',
      placeholderStyle: { color: 'red' },
      disabled: true,
      maxLength: 100,
      focus: false,
      cursor: -1,
      selectionStart: -1,
      selectionEnd: -1,
      onInput: () => {},
      onFocus: () => {},
      onBlur: () => {},
      onConfirm: () => {},
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Input {...props}>hello</Input>);
    expect(wrapper.render()).toMatchSnapshot();
  })

  
})
