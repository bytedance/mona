// import { Compiler, Compilation } from 'webpack';
// import path from 'path';
// import fse from 'fs-extra';
// const PLUGIN_NAME = 'OptimizeEntriesPlugin';

// // 编译获取 自定义组件 的属性、名称等
// // 强制要求自定义组件不得使用spread attribute  {...props}

// // ①  babel插件，从page中找出import的 component
// // webpack loader遍历，寻找所有小程序的自定义组件
// // 从usingComponents 中读取引用的自定义组件

// // 对.js 路径生成virtualModule

// // babel插件: 获取所有 jsx对应import 的包，以及path。babel中获取jsx 以及 path，为了缩小webpack查询范围。
// // webpack loader: loader根据path判断isNativeComponent，同时生成virtualPath
// function isNativeComponent(jsPath: string) {
//   if (!jsPath || path.extname(jsPath) !== '.js') return false;

//   const jsonPath = jsPath.replace(/\.js$/, '.json');
//   // const pageConfigPath = jsPath.replace(/index\.js$/, 'page.config');
//   // if (fse.existsSync(`${pageConfigPath}.js`) || fse.existsSync(`${pageConfigPath}.ts`)) {
//   //   console.warn('mona warn: page.config file');
//   //   return false;
//   // }
//   return fse.existsSync(jsonPath) ? Boolean(require('jsonPath')?.component) : false;
// }

// // .js 文件; .json文件 & json中component为true; 无page.config.ts文件, .
// export default class OptimizeEntriesPlugin {
//   constructor() {}

//   apply(compiler: Compiler) {
//     compiler.hooks.thisCompilation.tap(PLUGIN_NAME, (compilation: Compilation) => {
//       compilation.hooks.processAssets.tapAsync(PLUGIN_NAME, (_chunks, cb) => {});
//     });
//   }

//   importChunks(compilation: Compilation) {
//     compilation.chunkGroups.forEach(group => {});
//   }
// }
