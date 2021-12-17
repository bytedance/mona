import React from 'react';
import { CanvasProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Canvas: React.FC<CanvasProps> = (props) => {
  const {
    children,
    type = '2d',
    canvasId = '',
    onTouchStart,
    onTouchMove,
    onTouchEnd,
    onTouchCancel,
    ...restProps
  } = props;

  // TODO
  const { handleClassName, ...handlerProps } = useHandlers(restProps as any);

  return (
    <canvas data-canvas-id={canvasId} data-canvas-type={type} className={styles.canvas} {...handlerProps}></canvas>
  )
}

export default Canvas;
