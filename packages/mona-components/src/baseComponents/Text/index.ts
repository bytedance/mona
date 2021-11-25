import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface TextProps extends BaseProps {
  selectable?: boolean;
  space?: 'ensp' | 'emsp' | 'nbsp';
  decode?: boolean;
}

export const Text: React.ComponentType<TextProps> = createComponent<TextProps>('text')
