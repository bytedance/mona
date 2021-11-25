import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface RadioProps extends BaseProps {
  value?: string;
  checked?: boolean;
  disabled?: boolean;
  color?: string;
}

export const Radio: React.ComponentType<RadioProps> = createComponent<RadioProps>('radio')

