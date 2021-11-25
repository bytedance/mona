import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface PickerViewProps extends BaseProps {
  value: number[];
  indicatorStyle?: string;
  maskStyle?: string;
  onChange?: EventHandler
}

export const PickerView: React.ComponentType<PickerViewProps> = createComponent<PickerViewProps>('picker-view')

