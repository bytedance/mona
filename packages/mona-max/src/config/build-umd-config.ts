import fs from 'fs';
import path from 'path';

const { name = '@shop-isv/isv-com' } = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), './package.json'), 'utf-8'),
);

export default {
  output: {
    filename: '[name].umd.js',
    library: {
      name: [name, '[name]'],
      type: 'umd',
      export: 'default',
    },
  },
  externals: {
    react: 'React',
    'react-dom': 'ReactDOM',
  },
};
