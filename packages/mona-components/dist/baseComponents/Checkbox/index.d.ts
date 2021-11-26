import React from 'react';
import { BaseProps } from '../base';
export interface CheckboxProps extends BaseProps {
    value?: string;
    disabled?: boolean;
    checked?: boolean;
    color?: string;
}
export declare const Checkbox: React.ComponentType<CheckboxProps>;
