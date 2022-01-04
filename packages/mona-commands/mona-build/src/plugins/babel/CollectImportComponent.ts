import { NodePath } from '@babel/traverse';
import monaStore from '../../store';
import * as t from '@babel/types';

export default function collectNativeComponent() {
  return {
    visitor: {
      JSXElement(path: NodePath<t.JSXElement>, _state: any) {
        const node = path.node;
        const openingElement = node.openingElement;

        if (!t.isJSXIdentifier(openingElement.name)) {
          return false;
        }

        const name = openingElement.name.name;
        const binding = path.scope.getBinding(name);

        if (!binding) {
          return false;
        }

        const bindingPath = binding.path;

        if (!bindingPath) {
          return false;
        }

        const importPath = bindingPath.parentPath;

        if (t.isImportDeclaration(importPath)) {
          const importNode = importPath.node as t.ImportDeclaration;
          const source = importNode.source.value;
          getJsxProps(source, node);
        }
        return;
      },
    },
  };
}

function getJsxProps(name: string, node: t.JSXElement) {
  const component = monaStore.importComponentMap.get(name) || {
    path: name,
    props: new Set(),
  };
  const props: string[] = [];
  node.openingElement.attributes.forEach(prop => {
    if (t.isJSXSpreadAttribute(prop)) {
      return;
    }
    let propName: string;
    if (t.isJSXIdentifier(prop.name)) {
      propName = prop.name.name;
    } else if (t.isJSXNamespacedName(prop.name)) {
      propName = prop.name.namespace.name + ':' + prop.name.name.name;
    } else {
      return;
    }

    component.props.add(propName);
    props.push(propName);
  });
  monaStore.importComponentMap.set(name, component);
  return props;
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
