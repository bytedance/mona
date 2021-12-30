import { Compiler } from 'webpack';
import * as t from '@babel/types';
import { transformNodeName } from '../../../utils/reactNode';
import { miniPro2rcPropMap, renderMapAction } from './store';
import monaStore from '../../../store';
const PLUGIN_NAME = 'PerfTemplateRenderPlugin';
const walk = require('acorn-walk');

const CREATE_ELEMENT = 'createElement';
const ClONE_ELEMENT = 'cloneElement';
const ReactCallArr = [CREATE_ELEMENT, ClONE_ELEMENT];
export const isReactCreateElement = (name: string) => ReactCallArr.includes(name);

// TODO:收集别名, 兼容react17不需要引入React即可直接书写jsx产生的问题
// const jsxAlias = new Set(['jsx', '_jsx', 'jsxs', '_jsxs', 'jsxDEV']);

export const isReactCall = (memberExpression: t.CallExpression['callee']) => {
  //  TODO: https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
  // const isNotImportReact = t.isIdentifier(memberExpression) && jsxAlias.has(memberExpression?.name);
  return (
    t.isMemberExpression(memberExpression) &&
    t.isIdentifier(memberExpression.property) &&
    isReactCreateElement(memberExpression.property.name)
  );
};
export const isStringLiteral = (data: any): data is t.StringLiteral => {
  if (t.isStringLiteral(data)) {
    return true;
  }
  // babel的bug,  data.type值为Literal且isLiteral方法无效，也就是babel的ts类型与实际不匹配
  if (data?.type === 'Literal') {
    // return true;
    const isOtherLiteral =
      [
        t.isNumericLiteral,
        t.isNullLiteral,
        t.isBooleanLiteral,
        t.isRegExpLiteral,
        t.isTemplateLiteral,
        t.isBigIntLiteral,
        t.isDecimalLiteral,
      ].filter(method => method(data)).length !== 0;

    return !isOtherLiteral;
  }

  return false;
};

// 获取编译的module
export default class PerfTemplateRenderPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, factory => {
      factory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, parser => {
        parser.hooks.program.tap(PLUGIN_NAME, (ast: any) => {
          walk.simple(ast, {
            CallExpression(node: t.CallExpression) {
              if (!isReactCall(node.callee)) return;

              const [reactNode, props] = node.arguments;
              let nodeType: string = '';

              if (t.isIdentifier(reactNode)) {
                nodeType = transformNodeName(reactNode.name);
              } else if (isStringLiteral(reactNode)) {
                nodeType = transformNodeName(reactNode.value);
              }

              // 不属于原生组件 || 渲染全部的props
              if (!miniPro2rcPropMap.has(nodeType) || renderMapAction.renderAll(nodeType)) {
                return;
              }
              renderMapAction.setComponentUse(nodeType);

              const miniPropMap = miniPro2rcPropMap.get(nodeType);
              const rcPropMap = monaStore.ejsParamsMap.get(nodeType)?.alias;

              const attribute = [];

              if (t.isObjectExpression(props)) {
                for (const prop of props.properties) {
                  //@ts-ignore
                  if (t.isProperty(prop) || prop.type === 'Property') {
                    if (t.isIdentifier(prop.key)) {
                      attribute.push(prop.key.name);
                    } else if (isStringLiteral(prop.key)) {
                      attribute.push(prop.key.value);
                    } else {
                      renderMapAction.setAll(nodeType);
                      return;
                    }
                  } else {
                    renderMapAction.setAll(nodeType);
                    return;
                  }
                }
              } else if (t.isIdentifier(props)) {
                renderMapAction.setAll(nodeType);
                return;
              }
              for (const propName of attribute) {
                let rcPropName = miniPropMap[propName];
                const miniPropName = rcPropMap[propName];

                rcPropName = rcPropName ? rcPropName : miniPropName ? propName : undefined;
                if (rcPropName) {
                  renderMapAction.addProp(nodeType, rcPropName);
                }
              }
            },
          });
        });
      });
    });
  }
}
