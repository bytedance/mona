import React from 'react';
import { mount } from 'enzyme';
import MovableArea from '../../components/MovableArea';
import mountTest from '../../../../../tests/shared/mountTest';
// import handlerTest from '../../../../../tests/shared/handlerTest';
import { MovableAreaProps } from '@bytedance/mona';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

describe('web component: MovableArea', () => {
  mountTest(MovableArea)
  // handlerTest({ Component: MovableArea, firstTag: 'div' });

  it('should render correctly', () => {
    expect(mount(<MovableArea />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: MovableAreaProps = {
      scaleArea: true,
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<MovableArea {...props}>hello</MovableArea>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
