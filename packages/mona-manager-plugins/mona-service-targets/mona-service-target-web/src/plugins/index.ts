import { DefinePlugin, ContextReplacementPlugin } from 'webpack';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import TerserWebpackPlugin from 'terser-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';

import { CopyPublicPlugin } from '@bytedance/mona-manager-plugins-shared';

import ConfigHMRPlugin from './webpack/ConfigHMRPlugin';

export const MonaPlugins = {
  DefinePlugin,
  ContextReplacementPlugin,
  MiniCssExtractPlugin,
  CssMinimizerPlugin,
  TerserWebpackPlugin,
  HtmlWebpackPlugin,
  ReactRefreshWebpackPlugin,
  CopyPublicPlugin,
  ConfigHMRPlugin,
};
