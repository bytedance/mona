"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const mona_shared_1 = require("@bytedance/mona-shared");
const mini_css_extract_plugin_1 = __importDefault(require("mini-css-extract-plugin"));
const react_refresh_webpack_plugin_1 = __importDefault(require("@pmmmwh/react-refresh-webpack-plugin"));
const html_webpack_plugin_1 = __importDefault(require("html-webpack-plugin"));
const EntryModule_1 = __importDefault(require("./EntryModule"));
class ConfigHelper {
    constructor(options) {
        this.options = options;
        this.cwd = process.cwd();
        this.projectConfig = this._readConfig('mona.config');
        this.appConfig = this._readConfig('app.config');
        this.entryPath = (0, mona_shared_1.searchScriptFile)(path_1.default.resolve(this.cwd, this.projectConfig.input));
        this.entryModule = new EntryModule_1.default(this);
    }
    generate() {
        const config = {
            mode: this._createMode(),
            devtool: 'cheap-source-map',
            entry: this._createEntry(),
            output: this._createOutput(),
            resolve: this._createResolve(),
            module: this._createModule(),
            plugins: this._createPlugins(),
        };
        return config;
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
        const projectConfig = (0, mona_shared_1.readConfig)(fullConfigPath);
        return projectConfig;
    }
    _createEntry() {
        return this.entryModule.name;
    }
    _createMode() {
        return process.env.NODE_ENV !== 'production' ? 'development' : 'production';
    }
    _createOutput() {
        return {
            path: path_1.default.join(this.cwd, this.projectConfig.output),
            publicPath: `http://127.0.0.1:${this.options.port}/`,
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
            new mini_css_extract_plugin_1.default(),
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