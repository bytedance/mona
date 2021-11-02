"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEAULT_HOST = exports.DEFAULT_PORT = void 0;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const mona_shared_1 = require("@bytedance/mona-shared");
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const EntryModule_1 = __importDefault(require("./EntryModule"));
exports.DEFAULT_PORT = '9999';
exports.DEAULT_HOST = 'localhost';
const DEFAULT_PROJECT_CONFIG = {
    projectName: 'mona-app',
    input: './src/app.tsx',
    output: 'dist',
    dev: {
        port: exports.DEFAULT_PORT
    }
};
const DEFAULT_APP_CONFIG = {
    pages: []
};
class ConfigHelper {
    constructor(options) {
        this.options = options;
        this.cwd = process.cwd();
        this.projectConfig = Object.assign(Object.assign({}, DEFAULT_PROJECT_CONFIG), this._readConfig('mona.config'));
        this.appConfig = Object.assign(Object.assign({}, DEFAULT_APP_CONFIG), this._readConfig('app.config'));
        this.entryPath = (0, mona_shared_1.searchScriptFile)(path_1.default.resolve(this.cwd, this.projectConfig.input));
        this.entryModule = new EntryModule_1.default(this);
        if (options.port) {
            this.projectConfig.dev = Object.assign(Object.assign({}, this.projectConfig.dev), { port: options.port });
        }
    }
    generate() {
        const config = {
            mode: this._createMode(),
            devtool: this.options.dev ? 'cheap-source-map' : undefined,
            entry: this._createEntry(),
            output: this._createOutput(),
            resolve: this._createResolve(),
            module: this._createModule(),
            plugins: this._createPlugins(),
            optimization: this._createOptimization(),
        };
        const raw = this.projectConfig.raw;
        return raw ? raw(config) : config;
    }
    _createOptimization() {
        if (this.options.dev)
            return {};
        return {
            minimize: true,
            minimizer: [new terser_webpack_plugin_1.default({ parallel: true, extractComments: false }), new css_minimizer_webpack_plugin_1.default()],
            splitChunks: {
                chunks: 'async',
                minSize: 20000,
                minRemainingSize: 0,
                minChunks: 1,
                maxAsyncRequests: 30,
                maxInitialRequests: 30,
                enforceSizeThreshold: 50000,
                cacheGroups: {
                    reactBase: {
                        name: 'react-chunk',
                        test: /react/,
                        chunks: 'initial',
                        priority: 10,
                    },
                    common: {
                        name: 'common',
                        chunks: 'initial',
                        priority: 2,
                        minChunks: 2,
                    },
                    default: {
                        minChunks: 2,
                        priority: -20,
                        reuseExistingChunk: true
                    }
                }
            }
        };
    }
    _createResolve() {
        return {
            extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
            alias: {
                '@': path_1.default.resolve(this.cwd, './src'),
            },
        };
    }
    _readConfig(configName) {
        const projectConfigPath = path_1.default.join(this.cwd, configName);
        const fullConfigPath = (0, mona_shared_1.searchScriptFile)(projectConfigPath);
        if (fs_1.default.existsSync(fullConfigPath)) {
            const projectConfig = (0, mona_shared_1.readConfig)(fullConfigPath);
            return projectConfig;
        }
        else {
            throw new Error('无效的项目目录，请在mona项目根目录执行命令');
        }
    }
    _createEntry() {
        return this.entryModule.name;
    }
    _createMode() {
        return this.options.dev ? 'development' : 'production';
    }
    _createOutput() {
        var _a;
        return {
            path: path_1.default.join(this.cwd, this.projectConfig.output),
            filename: '[name].[contenthash:7].js',
            publicPath: this.options.dev ? `http://${exports.DEAULT_HOST}:${((_a = this.projectConfig.dev) === null || _a === void 0 ? void 0 : _a.port) || exports.DEFAULT_PORT}/` : '/',
            libraryTarget: 'umd',
            globalObject: 'window',
            chunkLoadingGlobal: `webpackJsonp_${this.projectConfig.projectName}_${Date.now()}`,
        };
    }
    _createModule() {
        const module = {
            rules: this._createModuleRules(),
        };
        return module;
    }
    _createModuleRules() {
        const rules = [];
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
                mini_css_extract_plugin_1.default.loader,
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
    _createPlugins() {
        const EntryMoudleInstance = this.entryModule.module;
        let plugins = [
            new mini_css_extract_plugin_1.default({
                filename: '[name].[contenthash:7].css'
            }),
            EntryMoudleInstance,
            new html_webpack_plugin_1.default({
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
        ];
        if (this.options.dev) {
            plugins = [new react_refresh_webpack_plugin_1.default(), ...plugins];
        }
        return plugins;
    }
}
exports.default = ConfigHelper;
//# sourceMappingURL=configHelper.js.map