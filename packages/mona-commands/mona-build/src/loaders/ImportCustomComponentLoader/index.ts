import { LoaderContext } from 'webpack';
// import { getOptions } from 'loader-utils';
import path from 'path';
import fse from 'fs-extra';
import monaStore from '../../store';
import { ConfigHelper } from '@/configHelper';

// import monaStore from '../store';

// .js 文件; .json文件 & json中component为true; 无page.config.ts文件, .

function isNativeComponent(jsPath: string) {
  if (!jsPath || path.extname(jsPath) !== '.js') return false;

  const jsonPath = jsPath.replace(/\.js$/, '.json');

  return fse.existsSync(jsonPath) ? Boolean(require(jsonPath)?.component) : false;
}

// 强制要求自定义组件不得使用spread attribute  {...props}
// ① babel插件CollectImportComponent: 获取jsx对应import的包信息(path、name、jsxProps等)。为了缩小webpack查询范围。
// ② webpack的loader, loader根据path判断isNativeComponent，生成该组件的uid(用于生成模板), 用createNativeComponent包裹uid导出。
// ③ 在createTtml中生成自定义组件对应的模板, 插入到base.ttml中
export default async function ImportCustomerComponentLoader(this: LoaderContext<any>, source: string) {
  this.cacheable();
  const callback = this.async()!;
  const resourcePath = this.resourcePath;
  const entryPath = resourcePath.replace(/\.entry(?=\.(js|ts)$)/, '');
  const dirName = entryPath.replace(path.extname(entryPath), '');

  const componentInfo = monaStore.importComponentMap.get(dirName);
  const configHelper = this.getOptions().configHelper as ConfigHelper;
  const { target } = configHelper.options;
  if (componentInfo?.type === 'native') {
    const { virtualSource } = componentInfo.entry;

    if (target === 'mini' && isNativeComponent(entryPath)) {
      const { dependencies: d } = componentInfo.entry;
      d.forEach(d => this.addDependency(d));

      // entry.virtualModule.apply(this._compiler!);
      // const { virtualModule, virtualPath } = entry;
      // virtualModule.writeModule(virtualPath, entry.outputSource());
      // // const dep = new SingleEntryDependency(this.virtualPath);
      // // dep.loc = { name: this.name };
      // console.log({
      //   resource: entry.outputSource(),
      //   virtualPath,
      // });
      // const dep = new dependencies.ModuleDependency(entry.outputSource());
      // //@ts-ignore
      // this._compilation?.addEntry(null, dep, virtualPath, () => {});
    }

    callback(null, virtualSource);
    return;
  }

  callback(null, source);
}
