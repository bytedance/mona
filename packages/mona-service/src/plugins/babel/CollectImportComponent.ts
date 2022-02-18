import { NodePath } from '@babel/traverse';
import nodePath from 'path';
import * as t from '@babel/types';
import { formatReactNodeName } from '@/target/utils/reactNode';
import ConfigHelper from '@/ConfigHelper';
import { TtComponentEntry, genNativeComponentEntry } from '@/target/entires/ttComponentEntry';
import { CUSTOM_COMPONENT_PROTOCOL } from '@bytedance/mona-shared';
// 收集从pages中引入的native Component, 以及props，
export default function collectNativeComponent(configHelper: ConfigHelper) {
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

        const importPath = bindingPath.parentPath;
        const from = _state.file.opts.filename;
        if (t.isImportDeclaration(importPath)) {
          const importNode = importPath.node as t.ImportDeclaration;
          const source = importNode.source.value;

          if (source.startsWith(CUSTOM_COMPONENT_PROTOCOL)) {
            importNode.source.value = processNativePath(
              importNode.source.value,
              nodePath.dirname(from),
              _state.file.opts.cwd,
            );
            const entry = genNativeComponentEntry(configHelper, importNode.source.value);
            entry && getJsxProps(entry, componentName, node);
          }
        }
        return;
      },
    },
  };
}

export function processNativePath(req: string, from: string, _cwd: string) {
  const sourcePath = req.replace(CUSTOM_COMPONENT_PROTOCOL, '');
  if (sourcePath.startsWith('../') || sourcePath.startsWith('./')) {
    return nodePath.join(from, sourcePath);
  } else if (nodePath.isAbsolute(sourcePath)) {
    return sourcePath;
  } else {
    return sourcePath;
  }
}

export function getJsxProps(entry: TtComponentEntry, componentName: string, node: t.JSXElement) {
  const component = entry.templateInfo || {
    componentName: formatReactNodeName(componentName),
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

  entry.templateInfo = component;
  return props;
}
