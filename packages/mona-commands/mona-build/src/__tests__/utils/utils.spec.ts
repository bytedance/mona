import { slash, isReactCreateElement } from '../../utils/utils';

describe('slash', () => {
  expect(slash('a/b')).toBe('a/b');
  expect(slash('a\\/b')).toBe('a//b');
  expect(slash('a\\\\b')).toBe('a//b');
  expect(slash('a')).toBe('a');
});
test('isReactCreateElement', () => {
  // const retValue = isReactCreateElement(name);
  expect(isReactCreateElement('createElement')).toBeTruthy();
  expect(isReactCreateElement('cloneElement')).toBeTruthy();
  expect(isReactCreateElement('ccloneElement')).toBeFalsy();
  expect(isReactCreateElement('ccreateElement')).toBeFalsy();
});
