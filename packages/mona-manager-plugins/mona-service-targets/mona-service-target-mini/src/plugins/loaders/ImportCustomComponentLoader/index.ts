import { LoaderContext } from 'webpack';
import path from 'path';
import monaStore from '@/target/store';
import { genMiniComponentEntry, MiniComponentEntry } from '@/target/entires/miniComponentEntry';
import { NODE_MODULES } from '@bytedance/mona-manager-plugins-shared';
import type { ConfigHelper } from '@bytedance/mona-manager';

const { nativeEntryMap } = monaStore;
// 强制要求自定义组件不得使用spread attribute  {...props}
// ① babel插件CollectImportComponent: 获取jsx对应import的包信息(path、name、jsxProps等)。为了缩小webpack查询范围。
// ② webpack的loader, loader根据path判断isMiniComponent，生成该组件的uid(用于生成模板), 用createMiniComponent包裹uid导出。
// ③ 在createTtml中生成自定义组件对应的模板, 插入到base.ttml中
export default async function ImportCustomerComponentLoader(this: LoaderContext<any>, source: string) {
  this.cacheable();
  const callback = this.async()!;
  const { target, configHelper } = this.getOptions() as { configHelper: ConfigHelper; target: string };
  const alias = configHelper.projectConfig.abilities?.alias;

  const resourcePath = this.resourcePath;

  let requestType: typeof NODE_MODULES | '' | 'alias' = '';

  const entryPath = resourcePath.replace(/\.entry(?=\.(js|ts)$)/, '');

  let dirName = entryPath.replace(path.extname(entryPath), '');
  // 提取npm名称
  if (dirName.includes(NODE_MODULES)) {
    dirName = dirName.slice(dirName.lastIndexOf(NODE_MODULES) + NODE_MODULES.length + 1);
    requestType = NODE_MODULES;
  } else if (alias) {
    for (const i in alias) {
      const realPath = alias[i].replace(/\/$/, '');
      if (!dirName.startsWith(realPath)) {
        continue;
      }
      const aliasName = dirName.replace(realPath, i);
      if (nativeEntryMap.has(aliasName)) {
        dirName = aliasName;
        requestType = 'alias';
        break;
      }
    }
  }
  const nativeEntry = nativeEntryMap.get(dirName);
  let finalSource = source;
  if (nativeEntry) {
    finalSource = nativeEntry.virtualSource;
    // npm包名作为key => 绝对路径作为key

    if (target === 'mini' && MiniComponentEntry.isMini(entryPath)) {
      if ([NODE_MODULES, 'alias'].includes(requestType)) {
        nativeEntry.entry = entryPath.replace(path.extname(entryPath), '');
        genMiniComponentEntry(nativeEntry.configHelper, nativeEntry.entry, nativeEntry);
      }
      nativeEntry.readDefaultProps(source);
      const dependencies = nativeEntry.readUsingComponents();
      dependencies.forEach(d => this.addDependency(d));
    }
  }

  callback(null, finalSource);
}
