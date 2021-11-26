import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface TextareaProps extends BaseProps {
  value?: string;
  placeholder?: string;
  placeholderStyle?: string;
  disabled?: boolean;
  maxLength?: number;
  focus?: boolean;
  autoHeight?: boolean;
  fixed?: boolean;
  cursorSpacing?: number;
  selectionStart?: number;
  selectionEnd?: number;
  disableDefaultPadding?: boolean;
  onInput?: EventHandler;
  onFocus?: EventHandler;
  onBlur?: EventHandler;
  onConfirm?: EventHandler;
}

export const Textarea: React.ComponentType<TextareaProps> = createComponent<TextareaProps>('textarea')

