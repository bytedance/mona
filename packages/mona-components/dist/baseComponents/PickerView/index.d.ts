import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface PickerViewProps extends BaseProps {
    value: number[];
    indicatorStyle?: string;
    maskStyle?: string;
    onChange?: EventHandler;
}
export declare const PickerView: React.ComponentType<PickerViewProps>;
