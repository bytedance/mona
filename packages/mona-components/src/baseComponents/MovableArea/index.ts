import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps } from '../base';

export interface MovableAreaProps extends BaseProps {
  scaleArea?: boolean;
}

export const MovableArea: React.ComponentType<MovableAreaProps> = createComponent<MovableAreaProps>('movable-area')
