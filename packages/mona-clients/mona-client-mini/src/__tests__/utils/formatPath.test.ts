import formatPath  from '../../utils/formatPath';

describe('formatPath', () => {
  it('should expose a function', () => {
    // const retValue = formatPath(url);
    expect(formatPath('/a/B')).toBe('/a/b');
    expect(formatPath('a/B')).toBe('/a/b');

  });
});