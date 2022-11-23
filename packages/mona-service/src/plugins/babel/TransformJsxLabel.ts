import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

const eventMap: { [key: string]: string } = {
  'tap': 'click'
}
const nodeMap: { [key: string ]: string } = {
  'text': 'span',
  'view': 'div'
}

function transformNodeName(name: string) {
  return nodeMap[name] || name;
}

function transformEventName(name: string) {
  const reg = /^bind/;
  if (!reg.test(name)) {
    return name;
  }

  const value = name.replace(reg, '');
  const newValue = eventMap[value] || value;
  return `on${newValue.replace(newValue[0], newValue[0].toUpperCase())}`;
}

export default function TransformJsxLabelPlugin() {
  return {
    visitor: {
      JSXElement(path: NodePath<t.JSXElement>) {
        const node = path.node;

        // 遍历过的不再遍历，加锁
        if ((node as any)._cooked) {
          return;
        }
        (node as any)._cooked = true;

        const openingNode = node.openingElement.name
        const closingNode = node.closingElement?.name

        // 处理标签
        if (t.isJSXIdentifier(openingNode)) {
          openingNode.name = transformNodeName(openingNode.name);
        }
        if (t.isJSXIdentifier(closingNode)) {
          closingNode.name = transformNodeName(closingNode.name);
        }

        // 处理attr
        const attrs = node.openingElement.attributes;
        for (let i = 0; i < attrs.length; i++) {
          const attr = attrs[i];
          if (t.isJSXAttribute(attr)) {
            if (t.isJSXIdentifier(attr.name)) {
              attr.name.name = transformEventName(attr.name.name)
            }
          }
        }
      },
    },
  };
}
