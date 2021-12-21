import React, { useState } from 'react';
import { shallow, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Button from '../../components/Button';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { ButtonProps } from '@bytedance/mona';

// configure({ adapter: new Adapter() });

describe('web component: Button', () => {
  mountTest(Button)
  handlerTest(Button, true);

  it('should render correctly', () => {
    expect(mount(<Button>Hello world</Button>).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: ButtonProps = {
      formType: 'submit',
      disabled: true,
      type: 'primary',
      loading: true,
      size: 'mini',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<Button {...props}>hello</Button>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
