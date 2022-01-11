import { genEjsParamsMap } from './alias';
import { NativeComponentEntry } from './entires/nativeComponentEntry';
// import { nanoid } from 'nanoid';
type Path = string;
interface ComponentImportInfo {
  // 包名称，例如: @bytedance/mona-runtime
  // 引入名称例如 import CustomComponent from 'xxx'。 在JSX中这样使用<CustomComponent /> ，则jsx中使用的名称 CustomComponent为componentName
  componentName: string;
  // jsx中使用的prop, native组件的jsx上不能 写spread attribute {...props} 的形式
  props: Set<string>;

  // native: 小程序原生自定义组件
  // normal: mona-runtime中引入得组件 | 小程序的原始组件view、video这种小写标签
  // plugin: mona的自定义组件，组件可以编译成web的react组件 、 小程序原生自定义组件
  type: 'native' | 'normal' | 'plugin';
  entry: NativeComponentEntry;
}

//@ts-ignore
interface NativeComponentInfo {
  type: 'native';
  id: string;
  pages: string[];
}

// interface EntryInfo {
//   path: string;
//   id: string;
//   type: 'native' | 'normal';
// }
interface MonaPageEntry {
  usingComponents: Record<string, string>;
  type: 'mona';
}
interface NativePageEntry {
  usingComponents: Record<string, string>;
  type: 'native';
}

type PageEntry = MonaPageEntry | NativePageEntry;

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
  importComponentMap: new Map<Path, ComponentImportInfo>(),
  templateRenderMap: new Map<string, ITemplateRenderInfo>(),
  ejsParamsMap: genEjsParamsMap(),
  nativeComponents: new Map<string, { id: string }>(),
  pageEntires: new Map<string, PageEntry>(),
  // registerNativeComponent(path: string) {},
};

export default Object.freeze(monaStore);
