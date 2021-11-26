import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface LabelProps extends BaseProps {
  for?: string;
}

export const Label: React.ComponentType<LabelProps> = createComponent<LabelProps>('label')

