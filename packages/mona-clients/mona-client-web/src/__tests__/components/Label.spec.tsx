import React from 'react';
import { mount } from 'enzyme';
import Label from '../../components/Label';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { LabelProps } from '@bytedance/mona';

describe('web component: Label', () => {
  mountTest(Label)
  handlerTest({ Component: Label, firstTag: 'label' });

  it('should render correctly', () => {
    expect(mount(<Label />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: LabelProps = {
      for: 'hello',
      id: 'hello',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Label {...props}>hello</Label>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
