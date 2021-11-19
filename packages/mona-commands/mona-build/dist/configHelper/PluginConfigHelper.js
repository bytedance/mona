"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const BaseConfigHelper_1 = __importDefault(require("./BaseConfigHelper"));
const path_1 = __importDefault(require("path"));
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const css_minimizer_webpack_plugin_1 = __importDefault(require("css-minimizer-webpack-plugin"));
const terser_webpack_plugin_1 = __importDefault(require("terser-webpack-plugin"));
const loader_utils_1 = __importDefault(require("loader-utils"));
const md5_1 = require("../utils/md5");
const ConfigHMRPlugin_1 = __importDefault(require("../plugins/ConfigHMRPlugin"));
const constants_1 = require("../constants");
function createUniqueId() {
    const random = () => Number(Math.random().toString().substr(2)).toString(36);
    const arr = [String(Date.now())];
    function createId() {
        var num = random();
        arr.push(num);
    }
    var i = 0;
    while (i < 4) {
        createId();
        i++;
    }
    return (0, md5_1.hexMD5)(arr.join(','));
}
class PluginConfigHelper extends BaseConfigHelper_1.default {
    constructor(options) {
        super(options);
        this.buildId = `_${createUniqueId()}`;
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
    _createEntry() {
        return path_1.default.join(this.entryPath, '..', 'app.entry.js');
    }
    _createMode() {
        return this.options.dev ? 'development' : 'production';
    }
    _createOutput() {
        return {
            path: path_1.default.join(this.cwd, this.projectConfig.output),
            filename: '[name].[contenthash:7].js',
            publicPath: '/',
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
        const styleLoader = [
            {
                loader: require.resolve('css-loader'),
                options: {
                    modules: {
                        auto: (filename) => /\.module\.\w+$/i.test(filename),
                        localIdentName: '[local]___[hash:base64:5]',
                        getLocalIdent: (loaderContext, localIdentName, localName, options) => {
                            // 配合PostcssPreSelector插件
                            if (localName === this.buildId) {
                                return localName;
                            }
                            if (!options.context) {
                                options.context = loaderContext.rootContext;
                            }
                            const request = path_1.default
                                .relative(options.context, loaderContext.resourcePath)
                                .replace(/\\/g, '/');
                            options.content = `${options.hashPrefix + request}+${localName}`;
                            localIdentName = localIdentName.replace(/\[local\]/gi, localName);
                            const hash = loader_utils_1.default.interpolateName(loaderContext, localIdentName, options);
                            return hash;
                        }
                    },
                },
            },
            {
                loader: require.resolve('postcss-loader'),
                options: {
                    postcssOptions: {
                        plugins: [
                            require.resolve('postcss-import'),
                            [path_1.default.join(__dirname, '..', './plugins/PostcssPreSelector.js'), { selector: `#${this.buildId}` }]
                        ]
                    }
                }
            },
            require.resolve('less-loader'),
        ];
        if (!this.options.dev) {
            styleLoader.unshift(mini_css_extract_plugin_1.default.loader);
        }
        else {
            styleLoader.unshift(require.resolve('style-loader'));
        }
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
            use: [
                { loader: require.resolve('@svgr/webpack') },
            ]
        });
        rules.push({
            test: /\.(ttf|eot|woff|woff2)$/i,
            type: 'asset/resource',
        });
        return rules;
    }
    _createPlugins() {
        let plugins = [
            new ConfigHMRPlugin_1.default(this),
            new html_webpack_plugin_1.default({
                templateContent: `
          <!-- ${constants_1.HTML_HANDLE_TAG} -->
          <!DOCTYPE html>
          <html id="${this.buildId}">
            <head>
              <meta charset="utf-8">
              <title>Mona Plugin</title>
              <meta name="viewport" content="width=device-width, initial-scale=1"></head>
            <body>
              <div id="root"></div>
            </body>
          </html>
        `,
                minify: {
                    collapseWhitespace: true,
                    keepClosingSlash: true,
                    removeComments: false,
                    removeRedundantAttributes: true,
                    removeScriptTypeAttributes: true,
                    removeStyleLinkTypeAttributes: true,
                    useShortDoctype: true
                }
            }),
        ];
        if (this.options.dev) {
            plugins = [
                new react_refresh_webpack_plugin_1.default(),
                ...plugins
            ];
        }
        else {
            plugins = [
                new mini_css_extract_plugin_1.default({
                    filename: '[name].[contenthash:7].css'
                }),
                ...plugins
            ];
        }
        return plugins;
    }
}
exports.default = PluginConfigHelper;
//# sourceMappingURL=PluginConfigHelper.js.map