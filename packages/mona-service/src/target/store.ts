import { genEjsParamsMap } from './mini/baseComponents';
import type { TtComponentEntry } from './entires/ttComponentEntry';
// import { PageEntry } from './entires/pageEntry';
export interface ComponentImportInfo {
  // 包名称，例如: @bytedance/mona-runtime
  // 引入名称例如 import CustomComponent from 'xxx'。 在JSX中这样使用<CustomComponent /> ，则jsx中使用的名称 CustomComponent为componentName
  componentName: string;

  // jsx中使用的prop, native组件的jsx上不能 写spread attribute {...props} 的形式
  props: Set<string>;

  // native: 小程序原生自定义组件
  type: 'native';
  entry: TtComponentEntry;
}

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
