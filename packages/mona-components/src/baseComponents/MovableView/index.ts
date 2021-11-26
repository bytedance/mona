import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface MovableViewProps extends BaseProps {
  direction?: 'all' | 'vertical' | 'horizontal' | 'none';
  inertia?: boolean;
  outOfBounds?: boolean;
  x?: string | number;
  y?: string | number;
  damping?: number;
  friction?: number;
  disabled?: boolean;
  scale?: boolean;
  scaleMin?: number;
  scaleMax?: number;
  scaleValue?: number;
  animation?: boolean;
  onChange?: EventHandler;
  onScale?: EventHandler;
  onHtouchMove?: EventHandler;
  onVtouchMove?: EventHandler;
}

export const MovableView: React.ComponentType<MovableViewProps> = createComponent<MovableViewProps>('movable-view')
