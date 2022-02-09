import * as t from '@babel/types';
import { isReactCall, isStringLiteral } from '../../target/utils/babel';
const acorn = require('acorn');

const acornWalk = require('acorn-walk');
const code = `

const props = {};

React.createElement('div', {
  ...props,
  key: 1,
});
React.cloneElement('div', {
  ...props,
  key: 1,
});
a.createElement2('div', {
  ...props,
  key: 1,
});
`;
const propCode = `

const props = {};
const theName = 'test';
React.createElement(theName, {});
React.createElement('div', {});
React.createElement(1, {});
React.createElement(false, {});
`;

test('isReactCall', () => {
  const res = [];
  acornWalk.simple(acorn.parse(code, {ecmaVersion: 2020}), {
    CallExpression(node: t.CallExpression) {
      res.push(isReactCall(node.callee));
    },
  });
  expect(res).toEqual([true, true, false]);
});

test('isStringLiteral', () => {
  const res = [];
  acornWalk.simple(acorn.parse(propCode, {ecmaVersion: 2020}), {
    CallExpression(node: t.CallExpression) {
      const [reactNode] = node.arguments;
      res.push(isStringLiteral(reactNode));
    },
  });

  expect(res).toEqual([false, true, false, false]);
});
