import { parseSearch, stringifySearch } from '../search';

describe('shared search', () => {
  it('parseSearch should parse search string correctly', () => {
    expect(parseSearch('')).toEqual({})
    expect(parseSearch('?')).toEqual({})
    expect(parseSearch('?name')).toEqual({})
    expect(parseSearch('?name=')).toEqual({ name: '' })
    expect(parseSearch('?a&b')).toEqual({});
    expect(parseSearch('?name=xiaoming&age=15')).toEqual({ 'name': 'xiaoming', 'age': '15' });
  })

  it('stringifySearch should stringify search object correctly', () => {
    expect(stringifySearch({ name: 'xiaoming', age: 15 })).toEqual('?name=xiaoming&age=15')
    expect(stringifySearch({})).toEqual('?')
  })
})