import { genEjsParamsMap } from './alias';

interface ComponentImportInfo {
  // 组件目录绝对路径
  path: string;

  // 包名称，例如: @bytedance/mona-runtime
  pkgName: string;

  // jsx中使用的prop, 自定义组件的jsx上不能 写spread attribute {...props} 的形式
  props: Set<string>;
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
  componentImportMap: new Map<string, ComponentImportInfo>(),
  templateRenderMap: new Map<string, ITemplateRenderInfo>(),
  ejsParamsMap: genEjsParamsMap(),
};

export default Object.freeze(monaStore);
