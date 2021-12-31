import { diffProperties, processProps } from '../../reconciler/processProps';

describe('props', () => {
  test('common prop diffProperties', () => {
    expect(diffProperties({ a: 1 }, { b: 2 })).toEqual({ b: 2, a: undefined });
    expect(diffProperties({ a: 1 }, { a: 2 })).toEqual({ a: 2 });

    expect(diffProperties({ a: 1 }, { a: 1, b: 2 })).toEqual({ b: 2 });
    expect(diffProperties({ a: 1 }, { a: 2, b: 2 })).toEqual({ a: 2, b: 2 });
    expect(diffProperties({ a: 1, b: 1 }, { a: 2 })).toEqual({ b: undefined, a: 2 });
    expect(diffProperties({ a: 1, b: 1 }, { a: 1 })).toEqual({ b: undefined });
    expect(diffProperties({ a: 1, b: 1 }, {})).toEqual({ b: undefined, a: undefined });
    expect(diffProperties({ a: 1, b: 2 }, { c: 3, d: 4 })).toEqual({ c: 3, d: 4, a: undefined, b: undefined });
  });
  test('style diffProperties', () => {
    expect(diffProperties({ style: { color: 'white' } }, { style: { color: 'white' } })).toEqual({});
    expect(diffProperties({ style: { color: 'white' } }, { style: { color: 'red' } })).toEqual({
      style: { color: 'red' },
    });

    expect(diffProperties({ style: { color: 'white' } }, { style: { color: 'red', background: 'blue' } })).toEqual({
      style: { color: 'red', background: 'blue' },
    });
    expect(
      diffProperties(
        { style: { color: 'red', background: 'blue', padding: 0, margin: 0 } },
        { style: { color: 'red', background: 'blue', padding: 0, margin: 0 } },
      ),
    ).toEqual({});
  });

  test('processProps', () => {
    
  });
});
