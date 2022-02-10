import React from 'react';
import { mount } from 'enzyme';
import PickerView from '../../components/PickerView';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { PickerViewProps } from '@bytedance/mona';

describe('web component: PickerView', () => {
  mountTest(PickerView)
  handlerTest({ Component: PickerView, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<PickerView value={[]} />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: PickerViewProps = {
      value: [],
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<PickerView {...props}>hello</PickerView>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
