import React from 'react';
import TestRenderer from 'react-test-renderer';

import createMiniComponent from '../createMiniComponent';
import { CUSTOM_REF } from '@bytedance/mona-shared';

describe('createMiniComponent', () => {
  test('react ref', () => {
    const customRef = React.createRef();
    const Test = createMiniComponent('test-test');
    const testIns = TestRenderer.create(<Test ref={customRef} />);
    expect(testIns.toJSON()).toMatchSnapshot();
    const refCb = testIns.root.findByType('test-test' as any).props[CUSTOM_REF];
    expect(typeof refCb).toBe('function');
    refCb('c');
    expect(customRef.current).toBe('c');
  });

  test('func ref', () => {
    let current;
    const customRef = (e: any) => {
      current = e;
    };
    const Test = createMiniComponent('test-test');
    const testIns = TestRenderer.create(<Test ref={customRef} />);
    expect(testIns.toJSON()).toMatchSnapshot();

    const refCb = testIns.root.findByType('test-test' as any).props[CUSTOM_REF];
    expect(typeof refCb).toBe('function');
    refCb('c');
    expect(current).toBe('c');
  });
});
