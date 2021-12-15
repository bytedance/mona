// import { declare } from '@babel/helper-plugin-utils';
import { NodePath } from '@babel/traverse';
// import { ConfigAPI } from '@babel/core';
import * as t from '@babel/types';
import { ejsParamsMap } from '@/alias';
// import { miniProp2rcPropMap } from '@/alias/prop';
interface IRenderInfo {
  isAll?: boolean;
  renderProps: Record<string, any>;
}
const renderPropsMap = new Map<string, IRenderInfo>();
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
const miniPro2rcPropMap = new Map();
Array.from(ejsParamsMap.keys()).forEach((nodeType: string) => {
  miniPro2rcPropMap.set(nodeType, genAliasMap(ejsParamsMap.get(nodeType).alias));
});

const getRenderInit = (renderProps: Record<string, true> = {}, isAll: boolean = false): IRenderInfo => ({
  renderProps: renderProps || {},
  isAll,
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
    return Boolean(renderInfo.isAll);
  } else {
    return false;
  }
};
const setAll = (nodeType: string) => {
  const renderInfo = renderPropsMap.get(nodeType);
  if (renderInfo) {
    renderInfo.isAll = true;
  } else {
    renderPropsMap.set(nodeType, getRenderInit({}, true));
  }
};
const renderMapAction = {
  renderAll,
  addProp,
  setAll,
};

export default function perfRuntimePlugin() {
  return {
    visitor: {
      JSXElement(path: NodePath<t.JSXElement>, _state: any) {
        const openingElement = path.node.openingElement;

        if (!t.isJSXIdentifier(openingElement.name)) {
          return;
        }

        const nodeType = transformNodeName(openingElement.name.name);
        if (!miniPro2rcPropMap.has(nodeType)) {
          return;
        }

        if (renderMapAction.renderAll(nodeType)) {
          return;
        }

        const miniPropMap = miniPro2rcPropMap.get(nodeType);
        const rcPropMap = ejsParamsMap.get(nodeType).alias;

        const attribute = openingElement.attributes;

        for (const item of attribute) {
          if (t.isJSXAttribute(item)) {
            let propName;
            if (t.isJSXIdentifier(item.name)) {
              propName = item.name.name;
            } else {
              propName = item.name.name.name;
            }

            let rcPropName = miniPropMap[propName];
            const miniPropName = rcPropMap[propName];

            rcPropName = rcPropName ? rcPropName : miniPropName ? propName : undefined;
            if (rcPropName) {
              renderMapAction.addProp(nodeType, rcPropName);
              // 标志渲染
            }
          } else if (t.isJSXSpreadAttribute(item)) {
            renderMapAction.setAll(nodeType);
            break;
          }
        }
        // console.log('renderPropsMap', renderPropsMap);
        // // 将name转为驼峰式
        // console.log('nodeName', {
        //   name: openingElement.name.name,
        // });
      },
      // JSXAttribute(path: NodePath<t.JSXAttribute>) {
      //   const propsName = path.node.name.name;

      //   // 将name转为驼峰式
      //   console.log('propsName ', propsName);
      // },
      // collectCustomComponent
      // collectUseProps
      // collectUseComponent
    },
  };
}

// function collectPropsName() {}

// 转为xx-xx的形式
const transformNodeName = (key: string) => {
  // webview 单独处理，或者写一个map
  if (key === 'Webview') {
    return 'web-view';
  }

  let styleValue = key.replace(/\.?([A-Z]+)/g, function (_x, y) {
    return '-' + y.toLowerCase();
  });

  if (styleValue.startsWith('-')) {
    styleValue = styleValue.replace(/^-/, '');
  }

  return styleValue;
};

// // 还是要搞一个map。对于bindtap、这种无法处理
// // 转为驼峰
// function transformProps(allPropsMap: any, key: string) {
//   // return key.replace(/-[a-z]/g, function (x) {
//   //   return x.replace(/^-/, '').toUpperCase();
//   // });

//   return genAliasMap(allPropsMap)[key];
// }
