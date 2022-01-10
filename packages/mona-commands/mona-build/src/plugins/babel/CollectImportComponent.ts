import { NodePath } from '@babel/traverse';
import monaStore from '../../store';
import nodePath from 'path';
import * as t from '@babel/types';
import { genNativeComponentId } from '@/loaders/ImportCustomComponentLoader';

// 收集从pages 文件夹下引入的Component, 以及props，缩小判断nativeComponent的范围
export default function collectNativeComponent() {
  return {
    visitor: {
      JSXElement(path: NodePath<t.JSXElement>, _state: any) {
        const node = path.node;
        const openingElement = node.openingElement;

        if (!t.isJSXIdentifier(openingElement.name)) {
          return false;
        }

        const componentName = openingElement.name.name;
        const binding = path.scope.getBinding(componentName);

        if (!binding) {
          return false;
        }

        const bindingPath = binding.path;

        if (!bindingPath) {
          return false;
        }

        // console.log(_state.file.opts.filename);
        const importPath = bindingPath.parentPath;
        const from = _state.file.opts.filename;
        if (t.isImportDeclaration(importPath)) {
          const importNode = importPath.node as t.ImportDeclaration;
          const source = importNode.source.value;
          if (source.startsWith('native://')) {
            importNode.source.value = processNativePath(
              importNode.source.value,
              nodePath.dirname(from),
              _state.file.opts.cwd,
            );
            getJsxProps(importNode.source.value, componentName, node);
          }
        }
        return;
      },
    },
  };
}

export function processNativePath(req: string, from: string, cwd: string) {
  const sourcePath = req.replace('native://', '');
  if (sourcePath.startsWith('../') || sourcePath.startsWith('./')) {
    return nodePath.join(from, sourcePath);
  } else if (nodePath.isAbsolute(sourcePath)) {
    return sourcePath;
  } else {
    return nodePath.join(cwd, '/src', sourcePath);
  }
}

function getJsxProps(importPath: string, componentName: string, node: t.JSXElement) {
  const component = monaStore.importComponentMap.get(importPath) || {
    path: importPath,
    id: genNativeComponentId(importPath),
    componentName: componentName,
    props: new Set(),
    type: 'native',
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
  monaStore.importComponentMap.set(importPath, component);
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
