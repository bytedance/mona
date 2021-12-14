import React, { useEffect, useRef } from 'react';
import { RichTextNode, RichTextNodeTypeNode, RichTextNodeTypeText, RichTextProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';
import { nodeMap } from './node';

function isTypeNode(node: RichTextNode): node is RichTextNodeTypeNode {
  return node.type !== 'text';
}

function isTypeText(node: RichTextNode): node is RichTextNodeTypeText {
  return node.type === 'text';
}

function recursiveGenerateNode(cnode: ChildNode, nodes: RichTextNode[]) {
  const name = cnode.nodeName.toLowerCase();
  let type: 'text' | 'node' = 'node';
  if (name === '#text') {
    type = 'text';
  }
  const rawAttrs = type === 'node' ? (cnode as Element).attributes : [];
  const attrs: { [key: string]: string } = {};
  for (let i = 0; i < rawAttrs.length; i++) {
    attrs[rawAttrs[i].name] = rawAttrs[i].value;
  }
  const children: RichTextNode[] = [];
  if (cnode.childNodes.length > 0) {
    cnode.childNodes.forEach(c => recursiveGenerateNode(c, children));
  }
  const node: RichTextNode = type === 'text' ? { text: cnode.textContent as string, type } : { name, type, attrs, children }
  nodes.push(node);
}

function recursiveParseNode(node: RichTextNode, container: Element) {
  if (isTypeNode(node)) {
    const { name, attrs = {}, children } = node;
    const attrNames = nodeMap[name];
    if (attrNames) {
      const ele = document.createElement(name);
      Object.keys(attrs).forEach(key => {
        if ([...attrNames, 'class', 'style'].includes(key)) {
          ele.setAttribute(key, attrs[key]);
        }
      })
      // recursive process children
      if (children) {
        children.forEach(child => recursiveParseNode(child, ele));
      }
      container.appendChild(ele);
    }
  } else if (isTypeText(node)) {
    const { text } = node;
    const ele = document.createTextNode(text);
    container.appendChild(ele);
  }
  return container;
}

function renderAllNodes(container: HTMLDivElement, nodes?: string | RichTextNode[]) {
  let currentNodes = nodes;
  if (typeof nodes == 'string') {
    const temp = document.createElement('div');
    temp.innerHTML = nodes;
    const tempNodes: RichTextNode[] = []
    temp.childNodes.forEach(cnode => recursiveGenerateNode(cnode, tempNodes))
    currentNodes = tempNodes;
  }

  if (Array.isArray(currentNodes)) {
    currentNodes.forEach(node => recursiveParseNode(node, container))
  }
}

const RichText: React.FC<RichTextProps> = ({ nodes, children, ...restProps }) => {
  const { handleClassName, ...handlerProps} = useHandlers(restProps);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current) {
      // clear all nodes
      containerRef.current.innerHTML = '';
      renderAllNodes(containerRef.current, nodes);
    }
  }, [containerRef.current, nodes])

  return <div ref={containerRef} className={handleClassName()} {...handlerProps}>{children}</div>
}

export default RichText;
