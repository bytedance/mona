import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ComponentType } from '@bytedance/mona-shared';
import { isReactCall, isStringLiteral } from '../../utils/babel';

export default function compressNodeTypePlugin() {
  return {
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>) {
        const node = path.node;
        if (!isReactCall(node.callee)) return;

        const [reactNode] = node.arguments;

        if (t.isIdentifier(reactNode)) {
          const alias = ComponentType[reactNode.name as keyof typeof ComponentType];
          if (alias) {
            reactNode.name = alias;
          }
        } else if (isStringLiteral(reactNode)) {
          const alias = ComponentType[reactNode.value as keyof typeof ComponentType];
          if (alias) {
            reactNode.value = alias;
          }
        }
      },
    },
  };
}
