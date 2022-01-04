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
          if (miniBanLabel[reactNode.name]) {
            console.warn(`${reactNode.name} 标签在小程序端不支持，请修改`);
          }
          const alias = ComponentType[reactNode.name as keyof typeof ComponentType];
          if (alias) {
            reactNode.name = alias;
          }
        } else if (isStringLiteral(reactNode)) {
          if (miniBanLabel[reactNode.value]) {
            console.warn(`${reactNode.value} 标签在小程序端不支持，请修改`);
          }
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

const miniBanLabel: Record<string, true> = {
  p: true,
  hr: true,
  blockquote: true,
  ol: true,
  li: true,
  ul: true,
  dl: true,
  dt: true,
  dd: true,
  figure: true,
  figcaption: true,
  em: true,
  strong: true,
  small: true,
  s: true,
  a: true,
  cite: true,
  q: true,
  dfn: true,
  abbr: true,
  time: true,
  code: true,
  var: true,
  samp: true,
  br: true,
  wbr: true,
  audio: true,
  area: true,
  svg: true,
  math: true,
  source: true,
  track: true,
  table: true,
  caption: true,
  colgroup: true,
  col: true,
  tbody: true,
  thead: true,
  tfoot: true,
  tr: true,
  td: true,
  th: true,
  meter: true,
  output: true,
  keygen: true,
  option: true,
  optgroup: true,
  datalist: true,
  select: true,
  legend: true,
  fieldset: true,
};
