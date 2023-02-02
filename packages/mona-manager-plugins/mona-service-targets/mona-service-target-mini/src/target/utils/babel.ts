import { NodePath } from '@babel/core';
import * as t from '@babel/types';
import { isReactCreateElement } from './utils';

// TODO:收集别名, 兼容react17不需要引入React即可直接书写jsx产生的问题
// const jsxAlias = new Set(['jsx', '_jsx', 'jsxs', '_jsxs', 'jsxDEV']);

export function getImportName(path: NodePath<t.CallExpression>, name: string) {
  // @ts-ignore
  return path.scope.getBinding(name)?.path?.parentPath?.node?.source?.value;
}

export const isReactCall = (path: NodePath<t.CallExpression>) => {
  //  TODO: https://zh-hans.reactjs.org/blog/2020/09/22/introducing-the-new-jsx-transform.html
  // const isNotImportReact = t.isIdentifier(memberExpression) && jsxAlias.has(memberExpression?.name);
  const memberExpression = path.node.callee;
  //@ts-ignore
  const callName = getImportName(path, path?.node?.callee?.object?.name || '');
  return (
    callName === 'react' &&
    t.isMemberExpression(memberExpression) &&
    t.isIdentifier(memberExpression.property) &&
    isReactCreateElement(memberExpression.property.name)
  );
};

export const isStringLiteral = (data: any): data is t.StringLiteral => {
  if (t.isStringLiteral(data)) {
    return true;
  }
  // babel的bug,  data.type值为Literal且isLiteral方法无效，也就是babel的ts类型与实际不匹配
  if (data?.type === 'Literal') {
    // return true;
    const isOtherLiteral =
      [
        t.isNumericLiteral,
        t.isNullLiteral,
        t.isBooleanLiteral,
        t.isRegExpLiteral,
        t.isTemplateLiteral,
        t.isBigIntLiteral,
        t.isDecimalLiteral,
      ].filter(is => is(data)).length !== 0;

    return !isOtherLiteral && typeof data?.value === 'string';
  }

  return false;
};
