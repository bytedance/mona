import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';

const pkg = require('./package.json');

// 不要JSON.stringify
const RENDER_NODE = {
  COMPLIER_KEY: 'a',
  COMPLIER_TYPE: 'b',
  COMPLIER_NODES: 'c',
  COMPLIER_CHILDREN: 'd',
  COMPLIER_TEXT: 'e',
};

export default [
  // {
  //   input: 'src/index.ts',
  //   output: [
  //     {
  //       file: pkg.module,
  //       format: 'esm',
  //       sourcemap: true,
  //     },
  //   ],
  //   plugins: [
  //     peerDepsExternal(),
  //     resolve({ browser: true, preferBuiltins: true }),
  //     commonjs(),
  //     typescript({ useTsconfigDeclarationDir: true }),
  //     postcss(),
  //     terser(),
  //   ],
  // },
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
      typescript({ useTsconfigDeclarationDir: true }),
      postcss(),
      terser(),
      replace(
        Object.keys(RENDER_NODE).reduce((pre, item) => {
          pre[`RENDER_NODE.${item}`] = RENDER_NODE[item];
          return pre;
        }, {}),
      ),
    ],
  },
];
