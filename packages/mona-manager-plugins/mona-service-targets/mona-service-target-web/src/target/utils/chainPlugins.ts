import path from 'path';
import Config from 'webpack-chain';
import { HtmlRspackPlugin, DefinePlugin, ProgressPlugin } from '@rspack/core'
import { ConfigHelper } from '@bytedance/mona-manager';
import { MonaPlugins } from '@/plugins';
import ReactRefreshPlugin from '@rspack/plugin-react-refresh';
import { Platform, getEnv } from '@bytedance/mona-manager-plugins-shared';
import { SAFE_SDK_SCRIPT } from '../utils/genHtml';

export function chainPlugins(
  webpackConfig: Config,
  configHelper: ConfigHelper,
  TARGET: Platform,
  templateContent: ((_buildId: string, injectScript?: string) => string) | string,
) {
  const { cwd, projectConfig } = configHelper;
  const {
    CopyPublicPlugin,
    ConfigHMRPlugin,
    ContextReplacementPlugin,
    LightApiPlugin,
    MobileAppJsonPlugin,
  } = MonaPlugins;

  webpackConfig.when(
    configHelper.isDev,
    w => w.plugin('ReactRefreshPlugin').use(ReactRefreshPlugin),
  );
  webpackConfig.plugin('ConfigHMRPlugin').use(ConfigHMRPlugin, [configHelper, TARGET]);

  // 如果是plugin，需要复制pigeon.json文件
  TARGET !== Platform.PLUGIN
    ? webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [configHelper])
    : webpackConfig.plugin('CopyPublicPlugin').use(CopyPublicPlugin, [
        configHelper,
        [
          {
            from: path.join(cwd, 'pigeon.json'),
            noErrorOnMissing: true,
          },
        ],
      ]);

  if (TARGET === Platform.MOBILE || TARGET === Platform.LIGHT) {
    // 如果是mobile，将app.config.ts/js 转成json复制到dist
    webpackConfig.plugin('MobileAppJsonPlugin').use(MobileAppJsonPlugin, [configHelper]);
  }
  const { runtime } = configHelper?.projectConfig;
  if (process.env.ENTRY_TYPE !== 'js') {
    webpackConfig.plugin('HtmlWebpackPlugin').use(
      new HtmlRspackPlugin({
        templateContent:
          typeof templateContent === 'function'
            ? templateContent(configHelper.buildId, runtime?.openSafeSdk ? SAFE_SDK_SCRIPT : '')
            : templateContent,
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

  // webpackConfig.plugin('ContextReplacementPlugin').use(ContextReplacementPlugin, [/moment[/\\]locale$/, /zh-ch/]);
  webpackConfig.plugin('ContextReplacementPlugin').use(new ContextReplacementPlugin(/moment[/\\]locale$/, /zh-cn/));
  if (TARGET === Platform.LIGHT) {
    webpackConfig.plugin('LightApiPlugin').use(LightApiPlugin, [projectConfig.appId as string]);
  }
}
