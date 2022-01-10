import { LoaderContext } from 'webpack';
// import { getOptions } from 'loader-utils';
import path from 'path';
import fse from 'fs-extra';
import monaStore from '../../store';

// import monaStore from '../store';

// 强制要求自定义组件不得使用spread attribute  {...props}
// ① babel插件: 获取page中所有 jsx对应import 的包，以及path,自定义组件 的属性、名称等。babel中获取jsx 以及 path，为了缩小webpack查询范围。
// ② webpack的loader, loader根据path判断isNativeComponent，包裹原生组件的wrapper
// 3️⃣ 生成自定义组件对应的模板, 插入到basettml中

function isNativeComponent(jsPath: string) {
  if (!jsPath || path.extname(jsPath) !== '.js') return false;

  const jsonPath = jsPath.replace(/\.js$/, '.json');

  return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
}

// function isMonaCustomComponent(jsPath: string) {
//   return false;
// }

// .js 文件; .json文件 & json中component为true; 无page.config.ts文件, .
export default async function ImportCustomerComponentLoader(this: LoaderContext<any>, source: string) {
  this.cacheable();
  const callback = this.async()!;
  const resourcePath = this.resourcePath;
  const entryPath = resourcePath.replace(/\.entry(?=\.(js|ts)$)/, '');

  if (isNativeComponent(entryPath)) {
    const dirName = entryPath.replace(path.extname(entryPath), '');

    const componentInfo = monaStore.importComponentMap.get(dirName);
    const nId = genNativeComponentId(dirName);

    if (!componentInfo) {
      monaStore.importComponentMap.set(dirName, {
        id: nId,
        componentName: '',
        props: new Set(),
        path: dirName,
        type: 'native',
      });
    }
    const virtualSource = `
      import { createNativeComponent } from '@bytedance/mona-runtime';
      export default createNativeComponent('${nId}')
    `;
    // TODO: 收集自定义组件的组件依赖，同时hmr监听该组件

    callback(null, virtualSource);
    return;
  }

  callback(null, source);
}

let id = 1;
// 将路径和jsx收集的prop一一对应
export const genNativeComponentId = (resourcePath: string) => {
  console.log(resourcePath);
  const componentInfo = monaStore.importComponentMap.get(resourcePath);
  if (componentInfo?.id) {
    return componentInfo?.id;
  }
  return `native${id++}`;
};
