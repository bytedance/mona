import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface PickerViewColumnProps extends BaseProps {
  
}

export const PickerViewColumn: React.ComponentType<PickerViewColumnProps> = createComponent<PickerViewColumnProps>('picker-view-column')

