import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, HoverProps } from '../base';

export interface ViewProps extends BaseProps, HoverProps {
  
}

export const View: React.ComponentType<ViewProps> = createComponent<ViewProps>('view')
