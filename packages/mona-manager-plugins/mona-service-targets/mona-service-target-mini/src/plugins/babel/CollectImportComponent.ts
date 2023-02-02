import { NodePath } from '@babel/traverse';
import nodePath from 'path';
import * as t from '@babel/types';
import { formatReactNodeName } from '@/target/utils/reactNode';
import { ConfigHelper } from '@bytedance/mona-manager';
import { MiniComponentEntry, genMiniComponentEntry } from '@/target/entires/miniComponentEntry';
import { CUSTOM_COMPONENT_PROTOCOL } from '@bytedance/mona-shared';
import { processNativePath } from '@/target/utils/path';
import monaStore from '@/target/store';

// 收集从pages中引入的native Component, 以及props，
export default function collectNativeComponent(configHelper: ConfigHelper) {
  return {
    visitor: {
      JSXElement(path: NodePath<t.JSXElement>, state: any) {
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

        if (t.isImportDeclaration(importPath)) {
          const importNode = importPath.node as t.ImportDeclaration;
          const source = importNode.source.value;
          let componentEntry = monaStore.nativeEntryMap.get(source);
          // 多次引入存在bug
          if (source.startsWith(CUSTOM_COMPONENT_PROTOCOL) || componentEntry) {
            if (!componentEntry) {
              importNode.source.value = processNativePath(
                importNode.source.value,
                nodePath.dirname(state.file.opts.filename),
              );
              componentEntry = genMiniComponentEntry(configHelper, importNode.source.value);
            }

            componentEntry && getJsxProps(componentEntry, componentName, node);
          }
        }
        return;
      },
    },
  };
}

export function getJsxProps(entry: MiniComponentEntry, componentName: string, node: t.JSXElement) {
  entry.templateInfo = {
    ...entry.templateInfo,
    componentName: formatReactNodeName(componentName),
    isUse: true,
  };
  const props: string[] = [];
  node.openingElement.attributes.forEach(prop => {
    if (t.isJSXSpreadAttribute(prop)) {
      entry.templateInfo.isRenderAllProps = true;
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

    entry.templateInfo.props.add(propName);
    props.push(propName);
  });
  return props;
}
