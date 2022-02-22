import * as babelParser from '@babel/parser';
import traverse, { NodePath } from '@babel/traverse';
import generate from '@babel/generator';
import * as t from '@babel/types';

export default function getMiniComponentDefaultValue(content: string) {
  const ast = babelParser.parse(content, { sourceType: 'module' });
  const defaultProps = {};
  traverse(ast, {
    CallExpression: (babelPath: NodePath<t.CallExpression>) => {
      const callee = babelPath.get('callee');
      callee.isIdentifier({ name: 'Component' });

      const callArgument = (babelPath.get('arguments') || [])[0];
      if (callArgument?.isObjectExpression()) {
        const { value: propPath } = objectExpressionFindKey(callArgument, 'properties');

        if (propPath?.isObjectProperty()) {
          const valuePath = propPath?.get('value');
          if (valuePath?.isObjectExpression()) {
            objectExpressionForEach(valuePath, (value, key) => {
              const propKey = key.node.name;
              if (value.isObjectExpression()) {
                const { index: propValueIdx } = objectExpressionFindKey(value, 'value');
                objectExpressionForEach(value, (_, __, prop, idx) => {
                  if (idx !== +propValueIdx) {
                    prop.remove();
                  }
                });
                
                const code = JSON.parse(JSON.stringify(generate(value.node).code));
                try {
                  eval('global.miniComponentPropValue = ' + code);
                } catch (error) {
                  console.error(error);
                }
                //@ts-ignore
                defaultProps[propKey] = global['miniComponentPropValue']?.value;
                if (global.hasOwnProperty('miniComponentPropValue')) {
                  //@ts-ignore
                  delete global['miniComponentPropValue'];
                }
              }
            });
          }
        }
      }
    },
  });

  return defaultProps;
}

function objectExpressionFindKey(params: NodePath<t.ObjectExpression>, name: string) {
  const props = params.get('properties');
  const idx = props.findIndex((prop: typeof props[0]) => {
    return prop.isObjectProperty() && prop.get('key').isIdentifier({ name });
  });
  return { index: idx, value: idx !== -1 ? (props[idx] as NodePath<t.ObjectProperty>) : undefined };
}

function objectExpressionForEach(
  params: NodePath<t.ObjectExpression>,
  cb: (
    value: NodePath<t.ObjectProperty['value']>,
    key: NodePath<t.Identifier>,
    prop: NodePath<t.ObjectProperty>,
    index: number,
  ) => void,
) {
  const props = params.get('properties');
  props.forEach((prop: typeof props[0], index) => {
    if (prop.isObjectProperty()) {
      const key = prop.get('key') as NodePath<t.Identifier>;
      const value = prop.get('value');
      cb(value, key, prop, +index);
    }
  });
}
