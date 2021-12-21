// import { declare } from '@babel/helper-plugin-utils';
import { NodePath } from '@babel/traverse';
// import { ConfigAPI } from '@babel/core';
import * as t from '@babel/types';

export default function collectNativeComponent() {
  return {
    visitor: {
      JSXElement(path: NodePath<t.JSXElement>, state: any) {
        const node = path.node;
        const openingElement = node.openingElement;
        console.log('state.file.opts.filename', state.file.opts.filename);

        if (!t.isJSXIdentifier(openingElement.name)) {
          return false;
        }

        // Badge
        const name = openingElement.name.name;
        const binding = path.scope.getBinding(name);
        // console.log('path.scope', path.scope);
        if (!binding) {
          return false;
        }

        const bindingPath = binding.path;

        // binding
        if (!bindingPath) {
          return false;
        }

        const importPath = bindingPath.parentPath;
        // console.log('importPath', importPath);

        if (t.isImportDeclaration(importPath)) {
          const importNode = importPath.node as t.ImportDeclaration;
          const source = importNode.source.value;
          console.log('source', source);
          console.log('importNode', importNode);

          // const props = getProps('', node, true) || [];

          // const modules = Store.compositionComponents.get(importer) || new Map();
          // const component: { import: string; props: Set<string> } = modules.get(source) || {
          //   import: source,
          //   props: new Set(props),
          // };
          // modules.set(source, {
          //   import: source,
          //   props: new Set([...component.props, ...props]),
          // });
          // Store.compositionComponents.set(importer, modules);
        }
        return;
      },
    },
  };
}

// function collectPropsName() {}

// // 还是要搞一个map。对于bindtap、这种无法处理
// // 转为驼峰
// function transformProps(allPropsMap: any, key: string) {
//   // return key.replace(/-[a-z]/g, function (x) {
//   //   return x.replace(/^-/, '').toUpperCase();
//   // });

//   return genAliasMap(allPropsMap)[key];
// }
// function slash(path: string) {
//   if (!path) {
//     return path;
//   }
//   return /^\\\\\?\\/.test(path) ? path : path.replace(/\\/g, `/`);
// }
