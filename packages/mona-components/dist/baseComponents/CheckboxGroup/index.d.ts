import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface CheckboxGroupProps extends BaseProps {
    onChange?: EventHandler;
    name?: string;
}
export declare const CheckboxGroup: React.ComponentType<CheckboxGroupProps>;
