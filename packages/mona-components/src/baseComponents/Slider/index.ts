import React from 'react';
import createComponent from '../../createComponent';
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

export const Slider: React.ComponentType<SliderProps> = createComponent<SliderProps>('slider')

