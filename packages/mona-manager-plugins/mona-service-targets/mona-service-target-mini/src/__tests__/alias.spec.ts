import { genEjsParamsMap, ejsParamsObj } from '../target/mini/baseComponents';
import { ComponentType } from '@bytedance/mona-shared';

it('genEjsParamsMap', () => {
  expect(genEjsParamsMap).not.toThrow();
});

it('ejsParamsObj', () => {
  expect(Array.from(new Set(Object.keys(ejsParamsObj))).length).toBe(
    // map & camera
    Array.from(new Set(Object.values(ComponentType))).length - 1,
  );
});
