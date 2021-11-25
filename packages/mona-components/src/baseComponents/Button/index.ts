import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, HoverProps } from '../base';

export interface ButtonProps extends BaseProps, HoverProps {
  size?: 'default' | 'mini';
  type?: 'primary' | 'default';
  disabled?: boolean;
  loading?: boolean;
  formType?: 'submit' | 'reset';
  openType?: 'share' | 'getPhoneNumber';
  onClick?: (e: any) => void;
  onGetPhoneNumber?: (e: any) => void;
}

export const Button: React.ComponentType<ButtonProps> = createComponent<ButtonProps>('button')

