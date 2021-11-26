import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface CheckboxProps extends BaseProps {
  value?: string
  disabled?: boolean;
  checked?: boolean
  color?: string
}

export const Checkbox: React.ComponentType<CheckboxProps> = createComponent<CheckboxProps>('checkbox')

