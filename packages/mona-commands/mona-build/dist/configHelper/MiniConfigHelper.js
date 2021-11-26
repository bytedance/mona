"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const webpack_1 = require("webpack");
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const BaseConfigHelper_1 = __importDefault(require("./BaseConfigHelper"));
const MiniEntryPlugin_1 = __importDefault(require("../plugins/MiniEntryPlugin"));
const MiniAssetsPlugin_1 = __importDefault(require("../plugins/MiniAssetsPlugin"));
class MiniConfigHelper extends BaseConfigHelper_1.default {
    generate() {
        const miniEntryPlugin = new MiniEntryPlugin_1.default(this);
        const config = {
            mode: this._createMode(),
            devtool: false,
            output: this._createOutput(),
            entry: miniEntryPlugin.entryModule.entries,
            resolve: this._createResolve(),
            module: this._createModule(),
            plugins: this._createPlugins(miniEntryPlugin),
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
    _createMode() {
        return this.options.dev ? 'development' : 'production';
    }
    _createOutput() {
        return {
            path: path_1.default.join(this.cwd, this.projectConfig.output),
            publicPath: '/',
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
                    },
                },
            ],
        });
        const styleLoader = [
            mini_css_extract_plugin_1.default.loader,
            {
                loader: require.resolve('css-loader'),
                options: {
                    modules: {
                        auto: (filename) => /\.module\.\w+$/i.test(filename),
                        localIdentName: '[local]___[hash:base64:5]',
                    },
                },
            },
            require.resolve('less-loader'),
        ];
        // handle style
        rules.push({
            test: /\.(c|le)ss$/i,
            use: styleLoader,
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
    // TODO: fix compressing css bug, when the extension is 'ttss'
    _createPlugins(...extraPlugin) {
        return [
            ...extraPlugin,
            new MiniAssetsPlugin_1.default(this),
            new mini_css_extract_plugin_1.default({
                filename: '[name].ttss'
            }),
            new webpack_1.DefinePlugin({
                BUILD_TARGET: JSON.stringify('mini')
            })
        ];
    }
}
exports.default = MiniConfigHelper;
//# sourceMappingURL=MiniConfigHelper.js.map