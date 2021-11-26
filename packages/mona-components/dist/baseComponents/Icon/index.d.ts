import React from 'react';
import { BaseProps } from '../base';
export interface IconProps extends BaseProps {
    type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'warning' | 'clear' | 'cancel' | 'download' | 'search';
    size?: number;
    color?: string;
}
export declare const Icon: React.ComponentType<IconProps>;
