import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { transformNodeName } from '../../utils/reactNode';
import { miniPro2rcPropMap, renderMapAction } from './renderStore';
import monaStore from '../../store';
import { isReactCall, isStringLiteral } from '../../utils/babel';

export default function perfTemplateRender() {
  return {
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>) {
        const node = path.node;

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
    },
  };
}
