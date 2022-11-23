import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

const eventMap: { [key: string]: string } = {
  'tap': 'click'
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
      JSXIdentifier(path: NodePath<t.JSXIdentifier>) {
        if (path.node.name === 'view') {
          path.node.name = 'div';
        } else if (path.node.name === 'text') {
          path.node.name = 'span';
        } else if (path.node.name.startsWith('bind')) {
          path.node.name = transformEventName(path.node.name)
        }
      },
    },
  };
}
