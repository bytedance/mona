import React from 'react';
import TestRenderer from 'react-test-renderer';

import {createMiniComponent} from '../createMiniComponent';

test('createMiniComponent', () => {
  const Test = createMiniComponent('test-test');
  const testIns = TestRenderer.create(<Test />);
  expect(testIns.toJSON()).toMatchSnapshot();
});
