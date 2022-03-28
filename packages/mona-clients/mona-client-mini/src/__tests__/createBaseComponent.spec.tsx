import React from 'react';
import TestRenderer from 'react-test-renderer';

import createBaseComponent from '../createBaseComponent';

test('createBaseComponent', () => {
  const Test = createBaseComponent('test-test');
  const testIns = TestRenderer.create(<Test />);
  expect(testIns.toJSON()).toMatchSnapshot();
});
