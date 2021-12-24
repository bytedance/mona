import React from 'react';
import { mount } from 'enzyme';
import CheckboxGroup from '../../components/CheckboxGroup';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { CheckboxGroupProps } from '@bytedance/mona';
import Checkbox from '../../components/Checkbox';

describe('web component: CheckboxGroup', () => {
  mountTest(CheckboxGroup)
  handlerTest({ Component: CheckboxGroup });

  it('should render correctly', () => {
    expect(mount((
      <CheckboxGroup>
        <Checkbox value="apple">apple</Checkbox>
        <Checkbox value="banana">banana</Checkbox>
        <Checkbox value="orange">orange</Checkbox>
      </CheckboxGroup>
    )).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: CheckboxGroupProps = {
      className: 'class-name',
      name: 'group',
      style: { color: 'red' },
      onChange: () => {}
    }
    const wrapper = mount(<Checkbox {...props}>hello</Checkbox>);
    expect(wrapper.render()).toMatchSnapshot();
  })

  it('should trigger onChange when tap any option', () => {
    const onChange = jest.fn();
    const wrapper = mount(
      <CheckboxGroup onChange={onChange}>
        <Checkbox value="apple">apple</Checkbox>
        <Checkbox value="banana">banana</Checkbox>
        <Checkbox value="orange">orange</Checkbox>
      </CheckboxGroup>
    )

    wrapper.find('input[value="banana"]').first().simulate('click');
    expect(onChange.mock.calls[0][0].detail.value).toEqual(['banana']);
    wrapper.find('input[value="apple"]').first().simulate('click');
    expect(onChange.mock.calls[1][0].detail.value).toEqual(['apple', 'banana']);
    wrapper.find('input[value="apple"]').first().simulate('click');
    expect(onChange.mock.calls[2][0].detail.value).toEqual(['banana']);
  }) 
})
