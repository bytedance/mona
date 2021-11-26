import React from 'react';
import { BaseProps, EventHandler } from '../base';
export interface SliderProps extends BaseProps {
    min?: number;
    max?: number;
    step?: number;
    disabled?: boolean;
    value?: number;
    color?: string;
    selectedColor?: string;
    activeColor?: string;
    backgroundColor?: string;
    blockSize?: number;
    blockColor?: string;
    showValue?: boolean;
    onChange?: EventHandler;
    onChanging?: EventHandler;
}
export declare const Slider: React.ComponentType<SliderProps>;
