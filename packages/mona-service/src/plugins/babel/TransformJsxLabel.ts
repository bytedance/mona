import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';

export default function TransformJsxLabelPlugin() {
  return {
    visitor: {
      JSXIdentifier(path: NodePath<t.JSXIdentifier>) {
        if (path.node.name === 'view') {
          path.node.name = 'div';
        } else if (path.node.name === 'text') {
          path.node.name = 'span';
        }
      },
    },
  };
}
