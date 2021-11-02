import webpack, { RuleSetRule, Configuration } from 'webpack';
import path from 'path';
import fs from 'fs';
import { readConfig, searchScriptFile } from '@bytedance/mona-shared';
import { ProjectConfig, AppConfig } from '@bytedance/mona'
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import EntryModule from './EntryModule';

export const DEFAULT_PORT = '9999';
export const DEAULT_HOST = 'localhost';
const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  projectName: 'mona-app',
  input: './src/app.tsx',
  output: 'dist',
  dev: {
    port: DEFAULT_PORT
  }
}

const DEFAULT_APP_CONFIG: AppConfig = {
  pages: []
}

interface ConfigHelperOptions {
  dev: boolean;
  port: string;
}
class ConfigHelper {
  cwd: string;
  projectConfig: ProjectConfig;
  appConfig: AppConfig;
  entryPath: string;
  entryModule: EntryModule;
  options: ConfigHelperOptions;

  constructor(options: ConfigHelperOptions) {
    this.options = options;
    this.cwd = process.cwd();
    this.projectConfig = { ...DEFAULT_PROJECT_CONFIG, ...this._readConfig<ProjectConfig>('mona.config') };
    this.appConfig = { ...DEFAULT_APP_CONFIG, ...this._readConfig<AppConfig>('app.config') };
    this.entryPath = searchScriptFile(path.resolve(this.cwd, this.projectConfig.input));
    this.entryModule = new EntryModule(this);
    if (options.port) {
      this.projectConfig.dev = { ...this.projectConfig.dev, port: options.port };
    }
  }

  generate() {
    const config: Configuration = {
      mode: this._createMode(),
      devtool: 'cheap-source-map',
      entry: this._createEntry(),
      output: this._createOutput(),
      resolve: this._createResolve(),
      module: this._createModule(),
      plugins: this._createPlugins(),
    };

    const raw = this.projectConfig.raw;
    return raw ? raw(config) : config;
  }

  private _createResolve() {
    return {
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
      alias: {
        '@': path.resolve(this.cwd, './src'),
      },
    };
  }

  private _readConfig<T>(configName: string): T {
    const projectConfigPath = path.join(this.cwd, configName);
    const fullConfigPath = searchScriptFile(projectConfigPath);
    if (fs.existsSync(fullConfigPath)) {
      const projectConfig = readConfig<T>(fullConfigPath);
      return projectConfig;
    } else {
      throw new Error('无效的项目目录，请在mona项目根目录执行命令')
    }
  }

  private _createEntry() {
    return this.entryModule.name;
  }

  private _createMode() {
    return process.env.NODE_ENV !== 'production' ? 'development' : 'production';
  }

  private _createOutput() {
    return {
      path: path.join(this.cwd, this.projectConfig.output),
      publicPath: `http://${DEAULT_HOST}:${this.projectConfig.dev?.port || DEFAULT_PORT}/`,
      libraryTarget: 'umd',
      globalObject: 'window',
      chunkLoadingGlobal: `webpackJsonp_${this.projectConfig.projectName}_${Date.now()}`,
    };
  }

  private _createModule() {
    const module: webpack.ModuleOptions = {
      rules: this._createModuleRules(),
    };

    return module;
  }

  private _createModuleRules() {
    const rules: RuleSetRule[] = [];

    // handle script
    rules.push({
      test: /\.((j|t)sx?)$/i,
      use: [
        {
          loader: require.resolve('babel-loader'),
          options: {
            babelrc: false,
            presets: [
              [require.resolve('@babel/preset-env')],
              [require.resolve('@babel/preset-typescript')],
              [require.resolve('@babel/preset-react')],
            ],
            plugins: [
              this.options.dev && require.resolve('react-refresh/babel')
            ].filter(Boolean)
          },
        },
      ],
    });

    // handle style
    rules.push({
      test: /\.(c|le)ss$/i,
      use: [
        MiniCssExtractPlugin.loader,
        {
          loader: require.resolve('css-loader'),
          options: {
            modules: { localIdentName: '[local]___[hash:base64:5]' },
          },
        },
        require.resolve('less-loader'),
      ],
    });

    // handle assets
    rules.push({
      test: /\.(png|jpe?g|gif|webp)$/i,
      type: 'asset/resource',
    });
    rules.push({
      test: /\.svg$/i,
      type: 'asset/inline',
    });
    rules.push({
      test: /\.(ttf|eot|woff|woff2)$/i,
      type: 'asset/resource',
    });

    return rules;
  }

  private _createPlugins() {
    const EntryMoudleInstance = this.entryModule.module;
    let plugins = [
      new MiniCssExtractPlugin(),
      EntryMoudleInstance,
      new HtmlWebpackPlugin({
        templateContent: `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
              <title>Mona Plugin</title>
              <meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `,
      }),
    ]

    if (this.options.dev) {
      plugins = [new ReactRefreshWebpackPlugin(), ...plugins]
    }
    return plugins;
  }
}

export default ConfigHelper;
