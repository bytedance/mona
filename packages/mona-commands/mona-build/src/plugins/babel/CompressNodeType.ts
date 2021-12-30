import * as t from '@babel/types';
import { ComponentType } from '@bytedance/mona-shared';

import { isReactCreateElement } from '../webpack/PerfTemplateRenderPlugin';

import { NodePath } from '@babel/traverse';
export default function compressNodeTypePlugin() {
  return {
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>) {
        const node = path.node;
        const memberExpression = node.callee;
        //  TODO: https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
        // const isNotImportReact = t.isIdentifier(memberExpression) && jsxAlias.has(memberExpression?.name);

        const isReactCall =
          t.isMemberExpression(memberExpression) &&
          t.isIdentifier(memberExpression.property) &&
          isReactCreateElement(memberExpression.property.name);
        if (!isReactCall) return;

        const [reactNode] = node.arguments;

        if (t.isIdentifier(reactNode)) {
          //@ts-ignore
          const alias = ComponentType[reactNode.name];
          if (alias) {
            reactNode.name = alias;
          }
          //@ts-ignore
        } else if (t.isStringLiteral(reactNode) || reactNode.type === 'Literal') {
          //@ts-ignore
          const alias = ComponentType[reactNode.value];
          if (alias) {
            reactNode.value = alias;
          }
        }
      },
    },
  };
}
