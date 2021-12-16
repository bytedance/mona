import { ejsParamsMap } from '@/alias';
// import { miniProp2rcPropMap } from '@/alias/prop';
interface IRenderInfo {
  isRenderAllProps?: boolean;
  isUse?: boolean;
  renderProps: Record<string, any>;
}
export const renderPropsMap = new Map<string, IRenderInfo>();
const genAliasMap = (allPropsMap: any) => {
  if (!allPropsMap) {
    return {};
  }
  const miniProp2rcPropMap = Object.keys(allPropsMap).reduce<Record<string, string>>((obj, prop: string) => {
    obj[allPropsMap[prop]] = prop;
    return obj;
  }, {});

  return miniProp2rcPropMap;
};

// xx-xx形式 -> 驼峰。 bindtap-> onTap
export const miniPro2rcPropMap = new Map();
Array.from(ejsParamsMap.keys()).forEach((nodeType: string) => {
  miniPro2rcPropMap.set(nodeType, genAliasMap(ejsParamsMap.get(nodeType).alias));
});

const getRenderInit = (
  renderProps: Record<string, true> = {},
  isRenderAllProps: boolean = false,
  isUse: boolean = false,
): IRenderInfo => ({
  renderProps: renderProps || {},
  isRenderAllProps,
  isUse,
});

const addProp = (nodeType: string, prop: string) => {
  const renderInfo = renderPropsMap.get(nodeType);
  if (renderInfo) {
    renderInfo.renderProps[prop] = true;
  } else {
    renderPropsMap.set(nodeType, getRenderInit({ [prop]: true }));
  }
};

const renderAll = (nodeType: string) => {
  const renderInfo = renderPropsMap.get(nodeType);
  if (renderInfo) {
    return Boolean(renderInfo.isRenderAllProps);
  } else {
    return false;
  }
};
const setComponentUse = (nodeType: string) => {
  const renderInfo = renderPropsMap.get(nodeType);
  if (renderInfo) {
    renderInfo.isUse = true;
  } else {
    renderPropsMap.set(nodeType, getRenderInit({}, false, true));
  }
};
const setAll = (nodeType: string) => {
  const renderInfo = renderPropsMap.get(nodeType);
  if (renderInfo) {
    renderInfo.isRenderAllProps = true;
  } else {
    renderPropsMap.set(nodeType, getRenderInit({}, true));
  }
};
export const renderMapAction = {
  renderAll,
  addProp,
  setAll,
  setComponentUse,
};
