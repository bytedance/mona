import { DefinePlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';


import MiniEntryPlugin from './webpack/MiniEntryPlugin';
import MiniAssetsPlugin from './webpack/MiniAssetsPlugin';
import OptimizeEntriesPlugin from './webpack/ChunksEntriesPlugin';
import CopyPublicPlugin from './webpack/CopyPublicPlugin';

import ConfigHMRPlugin from './webpack/ConfigHMRPlugin';


import collectNativeComponent from './babel/CollectImportComponent';
import TransformJsxNamePlugin from './babel/TransformJsxName';
import perfTemplateRender from './babel/PerfTemplateRender';

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
