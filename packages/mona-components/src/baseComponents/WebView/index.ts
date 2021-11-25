import React from 'react';
import createComponent from '../../createComponent';
import { BaseProps, EventHandler } from '../base';

export interface WebviewProps extends BaseProps {
  src: string;
  progressBarColor?: string;
  onMessage?: EventHandler;
  onLoad?: EventHandler;
  onError?: EventHandler;
}

export const Webview: React.ComponentType<WebviewProps> = createComponent<WebviewProps>('Webview')

