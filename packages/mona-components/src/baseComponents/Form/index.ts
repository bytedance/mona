import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface FormProps extends BaseProps {
  onSubmit?: EventHandler;
  onReset?: EventHandler;
}

export const Form: React.ComponentType<FormProps> = createComponent<FormProps>('form')

