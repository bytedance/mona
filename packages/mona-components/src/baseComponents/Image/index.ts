import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

type ImageMode = 'scaleToFill' | 'aspectFit' | 'aspectFill' | 'widthFix' | 'heightFix' | 'top' | 'bottom' | 'left' | 'right' | 'top left' | 'top right' | 'bottom left' | 'bottom right'

export interface ImageProps extends BaseProps {
  src?: string;
  mode?: ImageMode;
  lazyLoad?: boolean;
  onError?: EventHandler;
  onLoad?: EventHandler;
}

export const Image: React.ComponentType<ImageProps> = createComponent<ImageProps>('image')

