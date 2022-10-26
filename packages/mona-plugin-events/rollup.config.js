import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import postcss from 'rollup-plugin-postcss';
import { terser } from 'rollup-plugin-terser';
import { browser, main } from './package.json';

export default [
  {
    input: 'src/index.web.ts',
    output: [
      {
        file: browser,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: true, preferBuiltins: true }),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      postcss(),
      // terser(),
    ],
  },
  {
    input: 'src/index.ts',
    output: [
      {
        file: main,
        format: 'cjs',
        name: 'mona',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve({ browser: false, preferBuiltins: true }),
      commonjs(),
      typescript({ useTsconfigDeclarationDir: true }),
      postcss(),
      // terser(),
    ],
  },
];
