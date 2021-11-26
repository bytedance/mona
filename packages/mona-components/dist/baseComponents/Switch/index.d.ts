import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface SwitchProps extends BaseProps {
    checked?: boolean;
    disabled?: boolean;
    type?: 'switch' | 'checkbox';
    color?: string;
    onChange?: EventHandler;
}
export declare const Switch: React.ComponentType<SwitchProps>;
