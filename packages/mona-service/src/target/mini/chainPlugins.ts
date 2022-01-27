import Config from 'webpack-chain';
import ConfigHelper from '@/ConfigHelper';
import { TARGET } from './constants';
import { MonaPlugins } from '@/plugins';

import getEnv from '../utils/getEnv';

export function chainPlugins(webpackConfig: Config, configHelper: ConfigHelper, miniEntryPlugin: any) {
  const { cwd, projectConfig } = configHelper;
  webpackConfig.plugin('miniEntryPlugin').use(miniEntryPlugin);
  webpackConfig.plugin('CopyPublicPlugin').use(MonaPlugins.CopyPublicPlugin, [configHelper]);
  webpackConfig.plugin('MiniAssetsPlugin').use(MonaPlugins.MiniAssetsPlugin, [configHelper]);
  webpackConfig.plugin('MiniCssExtractPlugin').use(MonaPlugins.MiniCssExtractPlugin, [{ filename: '[name].ttss' }]);
  webpackConfig.plugin('DefinePlugin').use(MonaPlugins.DefinePlugin, [
    {
      ...getEnv(TARGET, cwd),
      ...(projectConfig?.abilities?.define || {}),
    },
  ]);
  webpackConfig.plugin('OptimizeEntriesPlugin').use(MonaPlugins.OptimizeEntriesPlugin);
}
