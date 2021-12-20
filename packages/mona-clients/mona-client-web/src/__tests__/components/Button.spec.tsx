import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import Button from '../../components/Button';
import { ButtonProps } from '@bytedance/mona';

configure({ adapter: new Adapter() });

describe('web component: Button', () => {
  it('Button should render correctly', () => {
    const wrapper = shallow(<Button />);
    expect(wrapper.find('button')).toHaveLength(1);
  })
  it('Button should have right properties', () => {
    const props: ButtonProps = {
      formType: 'submit',
      disabled: true,
      type: 'primary',
      loading: true,
      size: 'mini',
      className: 'class-name',
      style: { color: 'red' },
    }
    const children = 'hello';
    const wrapper = shallow(<Button {...props}>{children}</Button>);
    const $button = wrapper.find('button');

    expect($button.text()).toEqual(children);
    expect($button.props()['type']).toEqual(props.formType);
    expect($button.props()['data-mona-type']).toEqual(props.type);
    expect($button.props()['data-mona-loading']).toEqual(props.loading);
    expect($button.props()['data-mona-size']).toEqual(props.size);
    expect($button.props()['className']?.indexOf(props['className'])).not.toEqual(-1);
    expect($button.props()['style']['color']).toEqual('red');
  })
})
