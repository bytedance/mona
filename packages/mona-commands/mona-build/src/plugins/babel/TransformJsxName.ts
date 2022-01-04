import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ComponentType } from '@bytedance/mona-shared';
import { isReactCall, isStringLiteral } from '../../utils/babel';

// 1. 用于将开头小写的jsx，例如view、div等转换为ComponentType中的别名。两个作用①压缩jsx名称②转换jsx名称，例如div->view
// 2. 转换prop名称
export default function TransformJsxNamePlugin() {
  return {
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>) {
        const node = path.node;
        if (!isReactCall(node.callee)) return;

        const [reactNode, props] = node.arguments;

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

        if (t.isObjectExpression(props)) {
          for (const prop of props.properties) {
            //@ts-ignore
            if (t.isProperty(prop) || prop.type === 'Property') {
              if (t.isIdentifier(prop.key)) {
                const propKey = prop.key.name;
                if (webPropAlias[propKey]) {
                  prop.key.name = webPropAlias[propKey];
                }
              } else if (isStringLiteral(prop.key)) {
                const propKey = prop.key.value;
                if (webPropAlias[propKey]) {
                  prop.key.value = webPropAlias[propKey];
                }
              }
            }
          }
        }
      },
    },
  };
}

const webPropAlias: Record<string, string> = {
  onClick: 'onTap',
  class: 'className',
};
