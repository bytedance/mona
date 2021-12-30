import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import replace from '@rollup/plugin-replace';
import { RENDER_NODE } from '@bytedance/mona-shared/dist/constants';
import json from '@rollup/plugin-json';

const pkg = require('./package.json');

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
      typescript({ useTsconfigDeclarationDir: false }),
      postcss(),
      terser(),
      replace(RENDER_NODE),
      json(),
    ],
  },
];