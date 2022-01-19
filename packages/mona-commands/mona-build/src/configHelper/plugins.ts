import { DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';


import MiniEntryPlugin from '@/plugins/webpack/MiniEntryPlugin';
import MiniAssetsPlugin from '@/plugins/webpack/MiniAssetsPlugin';
import OptimizeEntriesPlugin from '@/plugins/webpack/ChunksEntriesPlugin';
import CopyPublicPlugin from '@/plugins/webpack/CopyPublicPlugin';

import ConfigHMRPlugin from '../plugins/webpack/ConfigHMRPlugin';


import collectNativeComponent from '@/plugins/babel/CollectImportComponent';
import TransformJsxNamePlugin from '@/plugins/babel/TransformJsxName';
import perfTemplateRender from '@/plugins/babel/PerfTemplateRender';

export const MonaPlugins = {
  DefinePlugin,
  MiniCssExtractPlugin,
  CssMinimizerPlugin,
  TerserWebpackPlugin,
  HtmlWebpackPlugin,
  ReactRefreshWebpackPlugin,
  
  MiniEntryPlugin,
  MiniAssetsPlugin,
  OptimizeEntriesPlugin,
  CopyPublicPlugin,
  ConfigHMRPlugin,
  babel: {
    perfTemplateRender,
    TransformJsxNamePlugin,
    collectNativeComponent,
  },
};
