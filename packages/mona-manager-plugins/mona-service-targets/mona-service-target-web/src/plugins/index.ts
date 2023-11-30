import { DefinePlugin, ContextReplacementPlugin } from 'webpack';
import { CopyPublicPlugin } from '@bytedance/mona-manager-plugins-shared';

import ConfigHMRPlugin from './webpack/ConfigHMRPlugin';
import LightApiPlugin from './webpack/LightApiPlugin';
import MobileAppJsonPlugin from './webpack/MobileAppJsonPlugin';
import MobileAutoTypePlugin from './webpack/MobileAutoTypePlugin';
export const MonaPlugins = {
  DefinePlugin,
  ContextReplacementPlugin,
  CopyPublicPlugin,
  ConfigHMRPlugin,
  LightApiPlugin,
  MobileAppJsonPlugin,
  MobileAutoTypePlugin,
};
