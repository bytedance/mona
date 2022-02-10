import React from 'react';
import { mount } from 'enzyme';
import PickerViewColumn from '../../components/PickerViewColumn';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { PickerViewColumnProps } from '@bytedance/mona';

describe('web component: PickerViewColumn', () => {
  mountTest(PickerViewColumn)
  handlerTest({ Component: PickerViewColumn, firstTag: 'div', props: { children: [<div key="1"></div>]} });

  it('should render correctly', () => {
    expect(mount(<PickerViewColumn />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: PickerViewColumnProps = {
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<PickerViewColumn {...props}>hello</PickerViewColumn>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
