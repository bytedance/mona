import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface SwitchProps extends BaseProps {
  checked?: boolean;
  disabled?: boolean;
  type?: 'switch' | 'checkbox';
  color?: string;
  onChange?: EventHandler;
}

export const Switch: React.ComponentType<SwitchProps> = createComponent<SwitchProps>('switch')

