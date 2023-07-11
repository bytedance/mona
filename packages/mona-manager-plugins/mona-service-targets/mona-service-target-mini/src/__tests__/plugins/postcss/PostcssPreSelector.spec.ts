const postcss = require('postcss');
const plugin = require('@bytedance/mona-manager-plugins-shared/dist/plugins/postcss/PostcssPreSelector');

function run(input: string) {
  return postcss([plugin({ selector: '#pre' })]).process(input, { from: '', to: '' }).then(result => {
    return result.css
  })
}

describe('postcss pre selector plugin', () => {
  it('should transform css correctly', () => {
    const input = '.hello { color: red }';
    const output = '#pre .hello { color: red }';
    return expect(run(input)).resolves.toEqual(output)
  })
  it('should work normal with body', () => {
    const input = 'body { color: red }';
    const output = '#pre body { color: red }#pre div[__marfishmockbody__] { color: red }';
    return expect(run(input)).resolves.toEqual(output)
  })
  it('should work normal with html', () => {
    const input = 'html { color: red }';
    const output = '#pre { color: red }';
    return expect(run(input)).resolves.toEqual(output)
  })
  it('should work normal with html,body', () => {
    const input = 'html,body { color: red }';
    const output = '#pre,#pre body { color: red }#pre,#pre div[__marfishmockbody__] { color: red }';
    return expect(run(input)).resolves.toEqual(output)
  })
})