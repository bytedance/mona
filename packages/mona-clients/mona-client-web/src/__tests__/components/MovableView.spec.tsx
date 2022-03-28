import React from 'react';
import { mount } from 'enzyme';
import { configure } from 'enzyme';
import MovableView from '../../components/MovableView';
import mountTest from '../../../../../tests/shared/mountTest';
// import handlerTest from '../../../../../tests/shared/handlerTest';
import { MovableViewProps } from '@bytedance/mona';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

configure({ adapter: new Adapter() });


describe('web component: MovableView', () => {
  mountTest(MovableView)
  // handlerTest({ Component: MovableView, firstTag: 'span',  });

  it('should render correctly', () => {
    expect(mount(<MovableView />).render()).toMatchSnapshot();
  })
  
  it('should have right properties', () => {
    const props: MovableViewProps = {
      direction: 'all',
      inertia: true,
      outOfBounds: true,
      x: 10,
      y: 10,
      damping: 10,
      friction: 10,
      disabled: true,
      scale: true,
      scaleMin: 1,
      scaleMax: 2,
      scaleValue: 4,
      animation: true,
      className: 'class-name',
      style: { color: 'red' },
    }
    const wrapper = mount(<MovableView {...props}>hello</MovableView>);
    expect(wrapper.render()).toMatchSnapshot();
  })
})
