import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

interface RichTextNodeTypeNode {
  name: string;
  type?: string;
  attrs?: Record<string, any>;
  children?: Array<RichTextNode>
}

interface RichTextNodeTypeText {
  text: string;
  type: string;
}

type RichTextNode = RichTextNodeTypeNode | RichTextNodeTypeText;

export interface RichTextProps extends BaseProps {
  nodes: RichTextNode[] | string
}

export const RichText: React.ComponentType<RichTextProps> = createComponent<RichTextProps>('rich-text')
