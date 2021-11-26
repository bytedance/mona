import React from 'react';
import { BaseProps } from '../base';
interface RichTextNodeTypeNode {
    name: string;
    type?: string;
    attrs?: Record<string, any>;
    children?: Array<RichTextNode>;
}
interface RichTextNodeTypeText {
    text: string;
    type: string;
}
declare type RichTextNode = RichTextNodeTypeNode | RichTextNodeTypeText;
export interface RichTextProps extends BaseProps {
    nodes: RichTextNode[] | string;
}
export declare const RichText: React.ComponentType<RichTextProps>;
export {};
