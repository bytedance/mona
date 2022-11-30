import React from 'react';
import { CanvasProps } from '@bytedance/mona';

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


  return (
    // @ts-ignore
    <canvas name="firstCanvas" {...restProps}></canvas>
  )
}

export default Canvas;
