import React from 'react';
import { mount } from 'enzyme';
import Form from '../../components/Form';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { FormProps } from '@bytedance/mona';
import Checkbox from '../../components/Checkbox';
import Input from '../../components/Input';
import CheckboxGroup from '../../components/CheckboxGroup';
import RadioGroup from '../../components/RadioGroup';
import Radio from '../../components/Radio';

describe('web component: Form', () => {
  mountTest(Form)
  handlerTest({ Component: Form, firstTag: 'form' });

  it('should render correctly', () => {
    expect(mount(
      <Form>
        <Input />
        <Checkbox />
      </Form>
    ).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: FormProps = {
      onReset: () => {},
      onSubmit: () => {},
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Checkbox {...props}>hello</Checkbox>);
    expect(wrapper.render()).toMatchSnapshot();
  })

  it('should trigger onSubmit and onReset correctly', () => {
    const onSubmit = jest.fn();
    const onReset = jest.fn();
    const wrapper = mount(
      <Form onSubmit={onSubmit} onReset={onReset}>
        <Input name="input" value="helloworld"></Input>
        <CheckboxGroup name="checkbox">
          <Checkbox value="apple">apple</Checkbox>
          <Checkbox value="banana">banana</Checkbox>
        </CheckboxGroup>
        <RadioGroup name="radio">
          <Radio value="black">red</Radio>
          <Radio value="red">red</Radio>
        </RadioGroup>
      </Form>
    )

    wrapper.find('input[value="apple"]').first().simulate('click');
    wrapper.find('input[value="black"]').first().simulate('click');
    wrapper.find('form').simulate('submit');
    expect(onSubmit).toBeCalledTimes(1);
    expect(onSubmit.mock.calls[0][0].detail.value).toEqual({ input: 'helloworld', checkbox: ['apple'], radio: 'black' })
    wrapper.find('form').simulate('reset');
    expect(onReset).toBeCalledTimes(1);
    wrapper.find('form').simulate('submit');
    expect(onSubmit.mock.calls[1][0].detail.value).toEqual({ input: '', checkbox: [], radio: '' })
    // TODO: add more component
  })
})
