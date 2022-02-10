import React from 'react';
import { mount } from 'enzyme';
import Textarea from '../../components/Textarea';
import mountTest from '../../../../../tests/shared/mountTest';
import handlerTest from '../../../../../tests/shared/handlerTest';
import { TextareaProps } from '@bytedance/mona';


describe('web component: Textarea', () => {
  mountTest(Textarea)
  handlerTest({ Component: Textarea, firstTag: 'textarea' });

  it('should render correctly', () => {
    expect(mount(<Textarea />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: TextareaProps = {
     name: 'hello',
     value: '1',
     placeholder: 'hhh',
     placeholderStyle: { color: 'red' },
     disabled: false,
     maxLength: 100,
     focus: false,
     autoHeight: true,
     fixed: false,
     cursor: 1,
     cursorSpacing: 1,
     selectionStart: 1,
     selectionEnd: 1,
     disableDefaultPadding: false,
     className: 'class-name',
     id: 'hello'
    }
    const wrapper = mount(<Textarea {...props}>hello</Textarea>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
