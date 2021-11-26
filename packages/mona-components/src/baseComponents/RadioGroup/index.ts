import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface RadioGroupProps extends BaseProps {
  onChange?: EventHandler;
  name?: string;
}

export const RadioGroup: React.ComponentType<RadioGroupProps> = createComponent<RadioGroupProps>('radio-group')

