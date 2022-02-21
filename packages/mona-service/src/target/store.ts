import type { TtComponentEntry } from './entires/ttComponentEntry';
import { genEjsParamsMap } from './mini/baseComponents';
// import { PageEntry } from './entires/pageEntry';


interface MonaPageEntry {
  usingComponents: Record<string, string>;
  type: 'mona';
}

// 模板生成信息
interface ITemplateRenderInfo {
  // 是否渲染所有props
  isRenderAllProps?: boolean;
  // 是否使用该组件
  isUse?: boolean;
  // jsx 使用的props
  renderProps: Record<string, any>;
}

const monaStore = {
  templateRenderMap: new Map<string, ITemplateRenderInfo>(),
  ejsParamsMap: genEjsParamsMap(),

  // TODO: pageEntires、nativeEntryMap合并成entry
  pageEntires: new Map<string, MonaPageEntry>(),
  nativeEntryMap: new Map<string, TtComponentEntry>(),
  // entryMap: new Map<string, PageEntry>(),
};

export default Object.freeze(monaStore);
