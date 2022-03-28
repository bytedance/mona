import React from 'react';
import { mount } from 'enzyme';

export default function mountTest(Component: React.ComponentType<any>) {
  describe('mount and unmount', () => {
    it(`component could be updated and unmounted without errors`, () => {
      const wrapper = mount(<Component />)
      expect(() => {
        wrapper.setProps({});
        wrapper.unmount();
      }).not.toThrow();
    })
  })
}