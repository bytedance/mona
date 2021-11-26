import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface RadioGroupProps extends BaseProps {
    onChange?: EventHandler;
    name?: string;
}
export declare const RadioGroup: React.ComponentType<RadioGroupProps>;
