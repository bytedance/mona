// import { miniProp2rcPropMap } from '@/alias/prop';
import monaStore from '../../store';

interface ITemplateRenderInfo {
  isRenderAllProps?: boolean;
  isUse?: boolean;
  renderProps: Record<string, any>;
}

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
Array.from(monaStore.ejsParamsMap.keys()).forEach((nodeType: string) => {
  miniPro2rcPropMap.set(nodeType, genAliasMap(monaStore.ejsParamsMap.get(nodeType).alias));
});

const getRenderInit = (
  renderProps: Record<string, true> = {},
  isRenderAllProps: boolean = false,
  isUse: boolean = false,
): ITemplateRenderInfo => ({
  renderProps: renderProps || {},
  isRenderAllProps,
  isUse,
});

const addProp = (nodeType: string, prop: string) => {
  const renderInfo = monaStore.templateRenderMap.get(nodeType);
  if (renderInfo) {
    renderInfo.renderProps[prop] = true;
  } else {
    monaStore.templateRenderMap.set(nodeType, getRenderInit({ [prop]: true }));
  }
};

const renderAll = (nodeType: string) => {
  const renderInfo = monaStore.templateRenderMap.get(nodeType);
  if (renderInfo) {
    return Boolean(renderInfo.isRenderAllProps);
  } else {
    return false;
  }
};
const setComponentUse = (nodeType: string) => {
  const renderInfo = monaStore.templateRenderMap.get(nodeType);
  if (renderInfo) {
    renderInfo.isUse = true;
  } else {
    monaStore.templateRenderMap.set(nodeType, getRenderInit({}, false, true));
  }
};
const setAll = (nodeType: string) => {
  const renderInfo = monaStore.templateRenderMap.get(nodeType);
  if (renderInfo) {
    renderInfo.isRenderAllProps = true;
  } else {
    monaStore.templateRenderMap.set(nodeType, getRenderInit({}, true));
  }
};
export const renderMapAction = {
  renderAll,
  addProp,
  setAll,
  setComponentUse,
};
