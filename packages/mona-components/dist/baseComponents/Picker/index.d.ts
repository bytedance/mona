import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface PickerProps extends BaseProps {
    mode?: 'selector' | 'multiSelector' | 'time' | 'date' | 'region';
    range?: (string | Record<string, any>)[][];
    rangeKey?: string;
    value?: number[] | string[] | string;
    start?: string;
    end?: string;
    fields?: 'year' | 'month' | 'day';
    disabled?: boolean;
    customItem?: string;
    onCancel?: EventHandler;
    onChange?: EventHandler;
    onColumnChange?: EventHandler;
}
export declare const Picker: React.ComponentType<PickerProps>;
