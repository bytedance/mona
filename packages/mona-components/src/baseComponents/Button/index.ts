import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface ButtonProps extends BaseProps {
  size?: 'default' | 'mini';
  type?: 'primary' | 'default';
  disabled?: boolean;
  loading?: boolean;
  hoverClassName?: string;
  hoverStartTime?: number;
  hoverStayTime?: number;
  hoverStopPropagation?: boolean;
  formType?: 'submit' | 'reset';
  openType?: 'share' | 'getPhoneNumber';
  onClick?: (e: any) => void;
  onGetPhoneNumber?: (e: any) => void;
}

export const Button: React.ComponentType<ButtonProps> = createComponent<ButtonProps>('button')

Button.defaultProps = {
  size: 'default',
  type: 'default',
  disabled: false,
  loading: false,
  hoverClassName: 'button-hover',
  hoverStartTime: 20,
  hoverStayTime: 70,
  hoverStopPropagation: false
}

