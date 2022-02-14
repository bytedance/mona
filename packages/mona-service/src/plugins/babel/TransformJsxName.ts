import { NodePath } from '@babel/traverse';
import * as t from '@babel/types';
import { ComponentType, MiniComponentAliasMap } from '@bytedance/mona-shared';
import { isReactCall, isStringLiteral } from '@/target/utils/babel';

// const specialLabel = new Set(['script', 'react']);
// 1. 用于将开头小写的jsx，例如view、div等转换为ComponentType中的别名。两个作用①压缩jsx名称②转换jsx名称，例如div->view
// 2. 转换prop名称
export default function TransformJsxNamePlugin() {
  return {
    visitor: {
      CallExpression(path: NodePath<t.CallExpression>) {
        const node = path.node;
        // path.scope.getBinding
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
          } else {
            if (!MiniComponentAliasMap[reactNode.value]) {
              console.warn(`${reactNode.value} 标签在小程序端不支持，将会转为view`);
              reactNode.value = ComponentType.view;
            }
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
                } else if (miniBanProp[propKey]) {
                  console.warn(`${propKey} 属性暂不支持，请使用React的方式书写`);
                }
              } else if (isStringLiteral(prop.key)) {
                const propKey = prop.key.value;
                if (webPropAlias[propKey]) {
                  prop.key.value = webPropAlias[propKey];
                } else if (miniBanProp[propKey]) {
                  console.warn(`${propKey} 属性暂不支持，请使用React的方式书写`);
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
  'tt:if': 'hidden',
};

// jsx 写tt: 的形式会直接报错
// 这里针对的是React.createElement
const miniBanProp: Record<string, true> = {
  'tt:elif': true,
  'tt:else': true,
  'tt:for': true,
  'tt:for-index': true,
  'tt:for-item': true,
  'tt:key': true,
};

// const miniBanLabel = new Set([
//   'a',
//   'h1',
//   'h2',
//   'h3',
//   'h4',
//   'h5',
//   'h6',
//   'p',
//   'hr',
//   'blockquote',
//   'ol',
//   'li',
//   'ul',
//   'dl',
//   'dt',
//   'dd',
//   'figure',
//   'figcaption',
//   'em',
//   'strong',
//   'small',
//   's',
//   'cite',
//   'q',
//   'dfn',
//   'abbr',
//   'time',
//   'code',
//   'var',
//   'samp',
//   'br',
//   'wbr',
//   'audio',
//   'area',
//   'svg',
//   'math',
//   'source',
//   'track',
//   'table',
//   'caption',
//   'colgroup',
//   'col',
//   'tbody',
//   'thead',
//   'tfoot',
//   'tr',
//   'td',
//   'th',
//   'tt',
//   'meter',
//   'output',
//   'keygen',
//   'option',
//   'optgroup',
//   'datalist',
//   'select',
//   'legend',
//   'fieldset',
//   'u',
//   'title',
//   'time',
//   // 规定在文本中的何处适合添加换行符。
//   'wbr',
// ]);
