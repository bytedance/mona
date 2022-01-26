import ConfigHelper from '@/ConfigHelper';
import path from 'path';
import Config from 'webpack-chain';
const extensions = ['.js', '.mjs', '.jsx', '.ts', '.tsx', '.json'];

export function chainResolve(webpackConfig: Config, configHelper: ConfigHelper) {
  const resolve = webpackConfig.resolve;
  resolve.extensions.merge(extensions);
  resolve.alias.merge(genAlias(configHelper.cwd));
}

export function genAlias(cwd: string) {
  return {
    '@': path.resolve(cwd, './src'),
    '@bytedance/mona-runtime': path.resolve(cwd, 'node_modules/@bytedance/mona-runtime/dist/index.plugin.js'),
  };
}
