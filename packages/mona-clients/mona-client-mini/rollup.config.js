import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import replace from '@rollup/plugin-replace';
import { RENDER_NODE, ComponentType } from '@bytedance/mona-shared';
import json from '@rollup/plugin-json';

const pkg = require('./package.json');
export default [
  {
    input: 'src/index.ts',
    output: [
      {
        file: pkg.main,
        format: 'esm',
        name: 'mona',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true, preferBuiltins: true }),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: false }),
      postcss(),
      replace(
        Object.keys(RENDER_NODE).reduce(
          (pre, item) => {
            pre[`${item}_STR`] = JSON.stringify(RENDER_NODE[item]);
            return pre;
          },
          {
            ...RENDER_NODE,

            NAVIGATE_ALIAS: JSON.stringify(ComponentType.navigator),

            // 不加会导致treeshaking失效
            'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV),
          },
        ),
      ),
      json(),
    ],
  },
];
