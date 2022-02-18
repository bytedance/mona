import ConfigHelper from '@/ConfigHelper';
import { Compiler, EntryPlugin, optimize, web, Compilation, sources } from 'webpack';
import createJson, { addUsingComponents } from './createJson';
import path from 'path';
import createTtml from './createTtml';
import OptimizeEntriesPlugin from '../ChunksEntriesPlugin';

// import { cloneDeep } from 'lodash';
import monaStore from '@/target/store';
import type { TtComponentEntry } from '@/target/entires/ttComponentEntry';
//@ts-ignore
const { SplitChunksPlugin, RuntimeChunkPlugin } = optimize;

class NativeAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'NativeAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    compiler.hooks.afterCompile.tapAsync(this.pluginName, (compilation, afterCb) => {
      if (compilation.compiler.isChild()) {
        afterCb();
        return;
      }
      const childCompiler = compilation.createChildCompiler('miniRequire', compiler.options.output);

      this.initConfig(compiler, childCompiler);
      this.bindPlugin(childCompiler);
      new Set(Array.from(monaStore.nativeEntryMap.values())).forEach(entry => {
        this.compileMainEntry(childCompiler, entry);
        this.compileTemplate(childCompiler, entry);
      });
      this.processOutput(childCompiler);

      childCompiler.runAsChild((_, _entries, _compilation) => {
        afterCb();
      });
    });

    // 计算&输出x.json配置文件
    compiler.hooks.emit.tapPromise(this.pluginName, async compilation => {
      this.compileConfig(compilation);
    });
  }

  initConfig(compiler: Compiler, childCompiler: Compiler) {
    childCompiler.options = { ...childCompiler.options };
    childCompiler.options.plugins = [];
    // 处理loader 问题，清空loader。
    childCompiler.options.module = {
      ...childCompiler.options.module,
      //@ts-ignore
      rules: childCompiler.options.module.rules.filter(item => !item.test.test('x.js')),
    };
    childCompiler.options.optimization = {
      ...childCompiler.options.optimization,
      usedExports: false,
    };

    childCompiler.options.output = {
      ...childCompiler.options.output,
      chunkLoadingGlobal: 'webpackJsonMiniJs',
      iife: false,
    };

    childCompiler.outputFileSystem = compiler.outputFileSystem;
  }

  bindPlugin(childCompiler: Compiler) {
    const plugins = [
      new RuntimeChunkPlugin({ name: 'miniRun' }),
      new SplitChunksPlugin({
        minSize: 0,
        chunks: 'all',
        maxInitialRequests: Infinity,
        cacheGroups: {
          miniVendors: {
            name: 'miniVendors',
            // test: new RegExp(`(${extensions.filter(e => e !== '.json').join('|')})$`),
            minChunks: 2,
            minSize: 0,
            priority: 10,
          },
        },
      }),
      new web.JsonpTemplatePlugin(),
      new OptimizeEntriesPlugin(),
    ];

    plugins.forEach(p => p.apply(childCompiler));
  }

  compileMainEntry(childCompiler: Compiler, entry: TtComponentEntry) {
    if (path.isAbsolute(entry.context)) {
      new EntryPlugin(entry.context, entry.path.main, path.join(entry.outputDir, entry.basename)).apply(childCompiler);
    }
  }
  compileTemplate(childCompiler: Compiler, entry: TtComponentEntry) {
    if (path.isAbsolute(entry.context)) {
      new EntryPlugin(entry.context, entry.path.templatePath, entry.outputDir + '/asset/a.ttml').apply(childCompiler);
    }
  }
  compileConfig(compilation: Compilation) {
    // console.log('xmonaStore.nativeEntryMap', monaStore.nativeEntryMap);
    monaStore.nativeEntryMap.forEach(entry => {
      if (!path.isAbsolute(entry.context)) {
        return;
      }
      const currentSource = new sources.RawSource(JSON.stringify(entry.genOutputConfig(), null, 2));
      const outputPath = entry.outputPath.configPath;
      if (compilation.getAsset(outputPath)) {
        compilation.updateAsset(outputPath, currentSource);
      } else {
        compilation.emitAsset(outputPath, currentSource);
      }
    });
  }
  processOutput(childCompiler: Compiler) {
    childCompiler.hooks.compilation.tap(this.pluginName, compilation => {
      /**
       * 与原生小程序混写时解析模板与样式, ttml作为入口时会输出js文件，阻断js文件生成
       */
      compilation.hooks.afterOptimizeAssets.tap(this.pluginName, assets => {
        Object.keys(assets).forEach(assetPath => {
          const styleExt = '.ttss';
          const templExt = '.ttml';
          if (new RegExp(`(\\${styleExt}|\\${templExt})\\.js(\\.map){0,1}$`).test(assetPath)) {
            compilation.deleteAsset(assetPath);
          } else if (new RegExp(`${styleExt}${styleExt}$`).test(assetPath)) {
            const assetObj = compilation.getAsset(assetPath);
            compilation.emitAsset(assetPath.replace(styleExt, ''), assetObj?.source!);
            compilation.deleteAsset(assetPath);
          }
        });
      });
    });
  }
}

class MiniAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'MiniAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    compiler.hooks.beforeCompile.tap(this.pluginName, params => {
      this.configHelper.readAllConfig();
      return params;
    });

    compiler.hooks.emit.tap(this.pluginName, async compilation => {
      addUsingComponents(compilation, this.configHelper);
    });

    compiler.hooks.emit.tapPromise(this.pluginName, async compilation => {
      // json
      await createJson(compilation, this.configHelper);

      // ttml
      await createTtml(compilation, this.configHelper);
    });
    new NativeAssetsPlugin(this.configHelper).apply(compiler);
    // const p = '/Users/bytedance/Desktop/mona2/mona/packages/local-test-fb';

    // monaStore.nativeEntryMap.forEach(entry => {
    //   if (entry instanceof TtPageEntry) {
    //     new EntryPlugin(path.dirname(entry.entry), `${entry.entry}.js`).apply(compiler);
    //   }
    // });
    // add new depenpencies
    compiler.hooks.afterCompile.tap(this.pluginName, compilation => {
      const { cwd, appConfig } = this.configHelper;
      const deps = ['app.config.ts', 'app.config.js'];
      // loader里
      appConfig.pages.forEach(page => {
        deps.push(path.join(`./src/${page}`, '..', 'page.config.js'));
        deps.push(path.join(`./src/${page}`, '..', 'page.config.ts'));
      });

      deps.forEach(name => {
        compilation.fileDependencies.add(path.join(cwd, name));
      });
    });
  }
}

export default MiniAssetsPlugin;
