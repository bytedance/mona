import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface CanvasProps extends BaseProps {
  canvasId: string;
  type: '2d' | 'webgl';
  onTouchStart?: EventHandler
  onTouchMove?: EventHandler
  onTouchEnd?: EventHandler
  onTouchCancel?: EventHandler
}

export const Canvas: React.ComponentType<CanvasProps> = createComponent<CanvasProps>('Canvas')

