import React from 'react';
import { mount } from 'enzyme';
import Icon from '../../components/Icon';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { IconProps } from '@bytedance/mona';

describe('web component: Icon', () => {
  mountTest(Icon)
  handlerTest({ Component: Icon });

  it('should render correctly', () => {
    expect(mount(<Icon type="success" />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: IconProps = {
      type: 'success',
      size: 20,
      color: 'red',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Icon {...props} />);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
