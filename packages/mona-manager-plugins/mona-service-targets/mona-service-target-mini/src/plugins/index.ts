import { DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';

import MiniEntryPlugin from './webpack/MiniEntryPlugin';
import MiniAssetsPlugin from './webpack/MiniAssetsPlugin';
import OptimizeEntriesPlugin from './webpack/ChunksEntriesPlugin';
import { CopyPublicPlugin } from '@bytedance/mona-manager-plugins-shared';

import collectNativeComponent from './babel/CollectImportComponent';
import TransformJsxNamePlugin from './babel/TransformJsxName';
import perfTemplateRender from './babel/PerfTemplateRender';

export const MonaPlugins = {
  DefinePlugin,
  MiniCssExtractPlugin,
  CssMinimizerPlugin,
  TerserWebpackPlugin,
  MiniEntryPlugin,
  MiniAssetsPlugin,
  OptimizeEntriesPlugin,
  CopyPublicPlugin,
  babel: {
    perfTemplateRender,
    TransformJsxNamePlugin,
    collectNativeComponent,
  },
};
