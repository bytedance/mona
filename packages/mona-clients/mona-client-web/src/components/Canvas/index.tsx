import React from 'react';
import { CanvasProps } from '@bytedance/mona';
import styles from './index.module.less';

// TODO
const Canvas: React.FC<CanvasProps> = ({ canvasId }) => {
  return (
    <canvas data-canvas-id={canvasId} className={styles.canvas}></canvas>
  )
}

export default Canvas;
