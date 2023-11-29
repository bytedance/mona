import Config from 'webpack-chain';
import { HtmlRspackPlugin, DefinePlugin, ProgressPlugin } from '@rspack/core'
import { ConfigHelper } from '@bytedance/mona-manager';
import { MonaPlugins } from '@/plugins';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { Platform, getEnv } from '@bytedance/mona-manager-plugins-shared';
import { SAFE_SDK_SCRIPT, genHtmlCreator } from '../utils/genHtml';

export function chainPlugins(
  webpackConfig: Config,
  configHelper: ConfigHelper,
  TARGET: Platform,
) {
  const { cwd, projectConfig } = configHelper;
  const {
    CopyPublicPlugin,
    ConfigHMRPlugin,
    ContextReplacementPlugin,
  } = MonaPlugins;

  webpackConfig.when(
    configHelper.isDev,
    w => w.plugin('ReactRefreshPlugin').use(ReactRefreshPlugin),
  );
  webpackConfig.plugin('ConfigHMRPlugin').use(ConfigHMRPlugin, [configHelper, TARGET]);

  webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [configHelper])

  const { runtime } = configHelper?.projectConfig;
  if (process.env.ENTRY_TYPE !== 'js') {
    const genHtml = genHtmlCreator(TARGET);
    const templateContent = genHtml(configHelper.buildId, runtime?.openSafeSdk ? SAFE_SDK_SCRIPT : '');

    webpackConfig.plugin('HtmlWebpackPlugin').use(
      new HtmlRspackPlugin({
        templateContent,
        minify: true,
      }),
    );
  }

  webpackConfig.plugin('DefinePlugin').use(DefinePlugin, [
    {
      ...getEnv(TARGET, cwd),
      ...(projectConfig?.abilities?.define || {}),
    },
  ]);

  webpackConfig.plugin('ProgressPlugin').use(ProgressPlugin, [{ prefix: 'Client' }])

  webpackConfig.plugin('ContextReplacementPlugin').use(new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/));
}
