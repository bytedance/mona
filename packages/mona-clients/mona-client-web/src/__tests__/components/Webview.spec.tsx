import React from 'react';
import { mount } from 'enzyme';
import Webview from '../../components/Webview';
import mountTest from '../../../../../tests/shared/mountTest';
// import handlerTest from '../../../../../tests/shared/handlerTest';
import { WebviewProps } from '@bytedance/mona';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });


describe('web component: Webview', () => {
  mountTest(Webview)
  // handlerTest({ Component: Webview, firstTag: 'div', props: { src: 'https://baidu.com' } });

  it('should render correctly', () => {
    expect(mount(<Webview src="https://baidu.com" />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: WebviewProps = {
      src: 'https://baidu.com',
      className: 'class-name',
      id: 'hello'
    }
    const wrapper = mount(<Webview {...props}>hello</Webview>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
