import formatPath from '../formatPath';

describe('mona-shared formatPath', () => {
  it('should format absolute path correctly', () => {
    expect(formatPath('/pages/list/index', '/pages/home/index')).toBe('/pages/list/index')
    expect(formatPath('pages/list/index', '/pages/home/index')).toBe('/pages/list/index')
  })
  it('should format relative path correctly', () => {
    expect(formatPath('../list/index', '/pages/home/index')).toBe('/pages/list/index')
    expect(formatPath('../list/index')).toBe('/pages/list/index')
    expect(formatPath('./pages/list/index')).toBe('/pages/list/index')
  })
  it('should reserve query correctly', () => {
    expect(formatPath('pages/list/index?name=1', '/pages/home/index')).toBe('/pages/list/index?name=1')
    expect(formatPath('../List/index?name=1&age=2', '/pages/home/index')).toBe('/pages/list/index?name=1&age=2')
    expect(formatPath('../List/index?personName=1&age=2', '/pages/home/index')).toBe('/pages/list/index?personName=1&age=2')
  })
})