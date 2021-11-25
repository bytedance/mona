import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface CheckboxGroupProps extends BaseProps {
  onChange?: EventHandler;
  name?: string;
}

export const CheckboxGroup: React.ComponentType<CheckboxGroupProps> = createComponent<CheckboxGroupProps>('checkbox-group')

