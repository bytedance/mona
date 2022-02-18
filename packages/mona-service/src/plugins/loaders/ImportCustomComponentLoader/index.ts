import { LoaderContext } from 'webpack';
import path from 'path';
import monaStore from '@/target/store';
import { genNativeComponentEntry, TtComponentEntry } from '@/target/entires/ttComponentEntry';
import { NODE_MODULES } from '@/target/constants';

// 强制要求自定义组件不得使用spread attribute  {...props}
// ① babel插件CollectImportComponent: 获取jsx对应import的包信息(path、name、jsxProps等)。为了缩小webpack查询范围。
// ② webpack的loader, loader根据path判断isNativeComponent，生成该组件的uid(用于生成模板), 用createMiniComponent包裹uid导出。
// ③ 在createTtml中生成自定义组件对应的模板, 插入到base.ttml中
export default async function ImportCustomerComponentLoader(this: LoaderContext<any>, source: string) {
  this.cacheable();
  const callback = this.async()!;
  const resourcePath = this.resourcePath;

  const entryPath = resourcePath.replace(/\.entry(?=\.(js|ts)$)/, '');

  let dirName = entryPath.replace(path.extname(entryPath), '');
  // 提取npm名称
  if (dirName.includes(NODE_MODULES)) {
    dirName = dirName.slice(dirName.indexOf(NODE_MODULES) + NODE_MODULES.length + 1);
  }

  const nativeEntry = monaStore.nativeEntryMap.get(dirName);

  const target = this.getOptions().target as string;
  let finalSource = source;

  if (nativeEntry) {
    // npm包名作为key => 绝对路径作为key
    if (resourcePath.includes(NODE_MODULES)) {
      nativeEntry.entry = entryPath.replace(path.extname(entryPath), '');
      genNativeComponentEntry(nativeEntry.configHelper, nativeEntry.entry, nativeEntry);
    }

    finalSource = nativeEntry.virtualSource;

    if (target === 'mini' && TtComponentEntry.isNative(entryPath)) {
      const dependencies = nativeEntry.readUsingComponents();
      dependencies.forEach(d => this.addDependency(d));
    }
  }

  callback(null, finalSource);
}
