import React from 'react';
import { BaseProps } from '../base';
export interface TextProps extends BaseProps {
    selectable?: boolean;
    space?: 'ensp' | 'emsp' | 'nbsp';
    decode?: boolean;
}
export declare const Text: React.ComponentType<TextProps>;
