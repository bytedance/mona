import React, { useState } from 'react';
import { mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { BaseProps, HoverProps } from '@bytedance/mona';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';

configure({ adapter: new Adapter() });

export default function handlerTest({
  Component,
  hasHover = false,
  firstTag = 'div',
  clickTag,
}: {
  Component: React.ComponentType<BaseProps & Partial<HoverProps> & any>;
  hasHover?: boolean;
  firstTag?: string;
  clickTag?: string;
}) {
  describe('common events handle', () => {
    it('should act normally when trigger tap event', () => {
      const props = {
         onTap: jest.fn(),
         onTouchStart: jest.fn()
      }

      const wrapper = mount(<Component {...props} />);
      wrapper.find(clickTag || firstTag).first().simulate('click');
      expect(props.onTap).toHaveBeenCalled();
    })

    it('should act normally when trigger longPress/longTap event', () => {
      jest.useFakeTimers();

      const props = {
        onTap: jest.fn(),
        onLongPress: jest.fn(),
        onLongTap: jest.fn()
      }

      const wrapper = mount(<Component {...props} />);
      wrapper.simulate('touchstart')
      act(() => {
        jest.advanceTimersByTime(350)
      })
      wrapper.simulate('touchend');
      expect(props.onLongPress).toHaveBeenCalled();
      expect(props.onLongTap).toHaveBeenCalled();
      expect(props.onTap).not.toHaveBeenCalled();

      jest.useRealTimers();
    })

    it('should trigger all events of animation/transition when the component has transition or animation', () => {
      const props = {
        onTransitionEnd: jest.fn(),
        onAnimationEnd: jest.fn(),
        onAnimationStart: jest.fn(),
        onAnimationIteration: jest.fn(),
      }

      const wrapper = mount(<Component {...props} />)
      wrapper.simulate('transitionend')
      expect(props.onTransitionEnd).toHaveBeenCalled();
      wrapper.simulate('animationstart')
      expect(props.onAnimationStart).toHaveBeenCalled();
      wrapper.simulate('animationiteration')
      expect(props.onAnimationIteration).toHaveBeenCalled();
      wrapper.simulate('animationend')
      expect(props.onAnimationEnd).toHaveBeenCalled();
    })

    // hasHover
    if (hasHover) {
      it('should act normally when hover the element', () => {
        jest.useFakeTimers();
        // hover
        const hoverProps = {
          hoverStartTime: 20,
          hoverStayTime: 70,
          hoverClassName: 'hover-class-name',
          onTouchStart: jest.fn(),
          onTouchMove: jest.fn(),
          onTouchEnd: jest.fn()
        }
        const wrapper = mount(<Component {...hoverProps} />);
        // touchstart
        wrapper.simulate('touchstart');
        expect(hoverProps.onTouchStart).toHaveBeenCalled();
        act(() => {
          jest.advanceTimersByTime(hoverProps.hoverStartTime)
        })
        wrapper.update()
        expect(wrapper.find(firstTag).first().prop('className').includes(hoverProps.hoverClassName)).toBeTruthy();

        wrapper.simulate('touchmove');
        expect(hoverProps.onTouchMove).toHaveBeenCalled();

        // touchend
        wrapper.simulate('touchend');
        expect(hoverProps.onTouchEnd).toHaveBeenCalled();
        act(() => {
          jest.advanceTimersByTime(hoverProps.hoverStayTime)
        })
        wrapper.update();
        expect(wrapper.find(firstTag).first().prop('className').includes(hoverProps.hoverClassName)).toBeFalsy();
        
        jest.useRealTimers();
      })
    }
  })
}