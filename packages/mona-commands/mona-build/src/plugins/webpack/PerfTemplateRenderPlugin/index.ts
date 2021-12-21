import { Compiler } from 'webpack';
// import { Call } from '@babel/traverse';
// import { ConfigAPI } from '@babel/core';
import * as t from '@babel/types';
import { transformNodeName } from '@/utils/reactNode';
import { miniPro2rcPropMap, renderMapAction } from './store';
import { ejsParamsMap } from '@/alias';
const PLUGIN_NAME = 'PerfTemplateRenderPlugin';
const walk = require('acorn-walk');

const CREATE_ELEMENT = 'createElement';
const ClONE_ELEMENT = 'cloneElement';
const ReactCallArr = [CREATE_ELEMENT, ClONE_ELEMENT];
const isReactCreateElement = (name: string) => ReactCallArr.includes(name);

// TODO:收集别名
// const jsxAlias = new Set(['jsx', '_jsx', 'jsxs', '_jsxs', 'jsxDEV']);

// 获取编译的module
export default class PerfTemplateRenderPlugin {
  constructor() {}

  apply(compiler: Compiler) {
    compiler.hooks.normalModuleFactory.tap(PLUGIN_NAME, factory => {
      factory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, parser => {
        parser.hooks.program.tap(PLUGIN_NAME, (ast: any) => {
          walk.simple(ast, {
            CallExpression(node: t.CallExpression) {
              const memberExpression = node.callee;
              //  TODO: https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
              // const isNotImportReact = t.isIdentifier(memberExpression) && jsxAlias.has(memberExpression?.name);

              const isReactCall =
                t.isMemberExpression(memberExpression) &&
                t.isIdentifier(memberExpression.property) &&
                isReactCreateElement(memberExpression.property.name);
              if (!isReactCall) return;

              const [reactNode, props] = node.arguments;
              let nodeType: string = '';

              if (t.isIdentifier(reactNode)) {
                nodeType = transformNodeName(reactNode.name);
                //@ts-ignore
              } else if (t.isStringLiteral(reactNode) || reactNode.type === 'Literal') {
                nodeType = transformNodeName(reactNode.value);
              }

              // 不属于原生组件则 || 渲染全部的props
              if (!miniPro2rcPropMap.has(nodeType) || renderMapAction.renderAll(nodeType)) {
                return;
              }
              renderMapAction.setComponentUse(nodeType);

              const miniPropMap = miniPro2rcPropMap.get(nodeType);
              const rcPropMap = ejsParamsMap.get(nodeType).alias;

              const attribute = [];

              if (t.isObjectExpression(props)) {
                for (const prop of props.properties) {
                  //@ts-ignore
                  if (t.isProperty(prop) || prop.type === 'Property') {
                    if (t.isIdentifier(prop.key)) {
                      attribute.push(prop.key.name);
                      //@ts-ignore
                    } else if (t.isStringLiteral(prop.key) || prop.key?.type === 'Literal') {
                      attribute.push(prop.key.value);
                    } else {
                      // console.log('*1  ', prop.key);
                      renderMapAction.setAll(nodeType);
                      return;
                    }
                  } else {
                    // console.log('*2  ', prop);

                    renderMapAction.setAll(nodeType);
                    return;
                  }
                }
              } else if (t.isIdentifier(props)) {
                // console.log('*3  ', props);

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
    // compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation: Compilation, { normalModuleFactory }) => {
    //   normalModuleFactory.hooks.parser.for('javascript/auto').tap(PLUGIN_NAME, parser => {});
    // });
  }
}
