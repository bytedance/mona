import React from 'react';
import { BaseProps } from '../base';
export interface RadioProps extends BaseProps {
    value?: string;
    checked?: boolean;
    disabled?: boolean;
    color?: string;
}
export declare const Radio: React.ComponentType<RadioProps>;
