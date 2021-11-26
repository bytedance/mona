import React from 'react';
import { BaseProps } from '../base';
export interface ProgressProps extends BaseProps {
    percent?: number;
    strokeWidth?: number;
    color?: string;
    activeColor?: string;
    backgroundColor?: string;
    active?: boolean;
    activeMode?: string;
}
export declare const Progress: React.ComponentType<ProgressProps>;
