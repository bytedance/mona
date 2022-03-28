import React from 'react';
import { mount } from 'enzyme';
import Button from '../../components/Button';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { ButtonProps } from '@bytedance/mona';

describe('web component: Button', () => {
  mountTest(Button)
  handlerTest({ Component: Button, hasHover: true, firstTag: 'button' });

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
