import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { mount, configure } from 'enzyme';
import Link from '../../components/Link';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { LinkProps } from '@bytedance/mona';
configure({ adapter: new Adapter() });


describe('web component: Link', () => {
  // mountTest(Link)
  // handlerTest({ Component: Link, firstTag: 'a' });

  it('should render correctly', () => {
    expect(mount(<BrowserRouter><Link to="/" /></BrowserRouter>).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: LinkProps = {
      to: '/',
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<BrowserRouter><Link {...props}>link</Link></BrowserRouter>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
