import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface IconProps extends BaseProps {
  type: 'success' | 'success_no_circle' | 'info' | 'warn' | 'warning' | 'clear' | 'cancel' | 'download' | 'search'
  size?: number;
  color?: string;
}

export const Icon: React.ComponentType<IconProps> = createComponent<IconProps>('icon')
