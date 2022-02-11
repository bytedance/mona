import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from '@wojtekmaj/enzyme-adapter-react-17';

import { createMiniComponent } from '../createMiniComponent';
import mountTest from '../../../../tests/shared/mountTest';
configure({ adapter: new Adapter() });

mountTest(createMiniComponent('test-test'));

test('createMiniComponent', () => {
  const Test = createMiniComponent('test-test');
  const testIns = mount(<Test />);
  expect(testIns.render()).toMatchSnapshot();
});
