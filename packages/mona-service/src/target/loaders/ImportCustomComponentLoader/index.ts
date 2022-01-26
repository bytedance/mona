import { LoaderContext } from 'webpack';
import path from 'path';
import monaStore from '../../store';
import { TtComponentEntry } from '../../entires/ttComponentEntry';
import { TtPageEntry } from '../../entires/ttPageEntry';

// import monaStore from '../store';

// 强制要求自定义组件不得使用spread attribute  {...props}
// ① babel插件CollectImportComponent: 获取jsx对应import的包信息(path、name、jsxProps等)。为了缩小webpack查询范围。
// ② webpack的loader, loader根据path判断isNativeComponent，生成该组件的uid(用于生成模板), 用createMiniComponent包裹uid导出。
// ③ 在createTtml中生成自定义组件对应的模板, 插入到base.ttml中
export default async function ImportCustomerComponentLoader(this: LoaderContext<any>, source: string) {
  this.cacheable();
  const callback = this.async()!;
  const resourcePath = this.resourcePath;
  const entryPath = resourcePath.replace(/\.entry(?=\.(js|ts)$)/, '');
  const dirName = entryPath.replace(path.extname(entryPath), '');
  const nativeEntry = monaStore.nativeEntryMap.get(dirName);
  const target = this.getOptions().target as string;
  let finalSource = source;
  if (nativeEntry) {
    const { virtualSource } = nativeEntry;
    finalSource = virtualSource;
    //TtPageEntry 已经提前判断过
    if (target === 'mini' && (TtComponentEntry.isNative(entryPath) || nativeEntry instanceof TtPageEntry)) {
      const dependencies = nativeEntry.readDependencies();
      dependencies.forEach(d => this.addDependency(d));
    }
  }

  callback(null, finalSource);
}
