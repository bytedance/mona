const fs = require('fs');
const path = require('path');

const { name = '@shop-isv/isv-com' } = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8'));

module.exports = {
  entry: {
    index: path.resolve(process.cwd(), './src/index.tsx')
  },
  output: {
    filename: '[name].umd.js',
    library: {
      name: [name, '[name]'],
      type: 'umd',
      export: 'default',
    },
  },
  externals: {
    "react": "React",
    "react-dom": "ReactDOM"
  }
};
