import ConfigHelper from '@/ConfigHelper';
import { Compiler, EntryPlugin, optimize, web, Compilation, sources } from 'webpack';
import createJson, { addUsingComponents } from './createJson';
import path from 'path';
import fse from 'fs-extra';
import createTtml from './createTtml';
import OptimizeEntriesPlugin from '../ChunksEntriesPlugin';
import { miniExt } from '@/target/mini/constants';

// import { cloneDeep } from 'lodash';
import monaStore from '@/target/store';
// import type { MiniComponentEntry } from '@/target/entires/miniComponentEntry';
import { MonaPlugins } from '@/plugins';
import { MiniEntry } from '@/target/entires/miniEntry';
// import { MiniPageEntry } from '@/target/entires/miniPageEntry';
// import { MiniAppEntry } from '@/target/entires/miniAppEntry';

//@ts-ignore
const { SplitChunksPlugin, RuntimeChunkPlugin } = optimize;

class NativeAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'NativeAssetsPlugin';

  constructor(configHelper: ConfigHelper) {
    this.configHelper = configHelper;
  }

  apply(compiler: Compiler) {
    new Set(Array.from(monaStore.nativeEntryMap.values())).forEach(entry => {
      this.compileMainEntry(compiler, entry);
      this.compileTemplate(compiler, entry);
      this.compileStyleFile(compiler, entry);
    });
    this.processOutput(compiler);

    const parent = compiler.isChild() ? compiler.parentCompilation?.compiler : compiler;

    // 计算&输出x.json配置文件
    parent?.hooks.emit.tapPromise(this.pluginName, async compilation => {
      this.compileConfig(compilation);
    });
  }

  compileMainEntry(childCompiler: Compiler, entry: MiniEntry) {
    if (!fse.existsSync(entry.path.main)) {
      return;
    }
    new EntryPlugin(entry.context, entry.path.main, path.join(entry.outputDir, entry.basename)).apply(childCompiler);
  }

  compileTemplate(childCompiler: Compiler, entry: MiniEntry) {
    if (!fse.existsSync(entry.path.templatePath)) {
      return;
    }
    new EntryPlugin(entry.context, entry.path.templatePath, entry.outputPath.templatePath).apply(childCompiler);
  }
  compileStyleFile(childCompiler: Compiler, entry: MiniEntry) {
    if (!fse.existsSync(entry.path.stylePath)) {
      return;
    }
    new MonaPlugins.MiniCssExtractPlugin({ filename: `[name]${miniExt.style}` }).apply(childCompiler);
    new EntryPlugin(entry.context, entry.path.stylePath, entry.outputPath.stylePath).apply(childCompiler);
  }
  compileConfig(compilation: Compilation) {
    new Set(Array.from(monaStore.nativeEntryMap.values())).forEach(entry => {
      const currentSource = new sources.RawSource(JSON.stringify(entry.genOutputConfig(), null, 2));
      const outputPath = entry.outputPath.configPath;
      console.log({ outputPath });
      if (compilation.getAsset(outputPath)) {
        compilation.updateAsset(outputPath, currentSource);
      } else {
        compilation.emitAsset(outputPath, currentSource);
      }
    });
  }
  processOutput(childCompiler: Compiler) {
    childCompiler.hooks.compilation.tap(this.pluginName, compilation => {
      // 原生小程序混写时, ttml作为入口时会输出js文件，这里阻断js文件生成
      compilation.hooks.afterOptimizeAssets.tap(this.pluginName, assets => {
        Object.keys(assets).forEach(assetPath => {
          const { style: styleExt, templ: templExt } = miniExt;
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

class HybridNativeAssetsPlugin {
  configHelper: ConfigHelper;
  pluginName = 'HybridNativeAssetsPlugin';

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
      new NativeAssetsPlugin(this.configHelper).apply(childCompiler);

      childCompiler.runAsChild((_, _entries, _compilation) => {
        afterCb();
      });
    });
  }

  initConfig(compiler: Compiler, childCompiler: Compiler) {
    childCompiler.options = { ...childCompiler.options };
    childCompiler.options.plugins = [];
    // 处理loader 问题，清空loader。
    childCompiler.options.module = {
      ...childCompiler.options.module,
      //@ts-ignore
      rules: childCompiler.options.module.rules.filter(item => !item.test.test('xxx.js')),
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
    childCompiler.inputFileSystem = compiler.inputFileSystem;
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
      if (monaStore.miniAppEntry) {
        return;
      }
      addUsingComponents(compilation, this.configHelper);
    });

    compiler.hooks.emit.tapPromise(this.pluginName, async compilation => {
      // json
      await createJson(compilation, this.configHelper);

      // ttml
      await createTtml(compilation, this.configHelper);
    });

    new HybridNativeAssetsPlugin(this.configHelper).apply(compiler);
    // if (monaStore.miniAppEntry) {
    //   new NativeAssetsPlugin(this.configHelper).apply(compiler);
    // } else {
    //   // 混用
    //   new HybridNativeAssetsPlugin(this.configHelper).apply(compiler);
    // }

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
