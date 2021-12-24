import React from 'react';
import { formatTouchEvent } from '../utils';
import styles from './index.module.less';

const stopPropagation = (e: any) => {
  e.stopPropagation();
};
const maskStyle: React.CSSProperties = {
  bottom: 0,
  position: 'absolute',
  left: 0,
  right: 0,
  background: 'white',
};
//@ts-ignore
export default function PickerMask({ visible, children, onConfirm, onCancel }) {
  if (visible) {
    return (
      <div
        className={styles.monaPickerModal}
        onTouchStart={e => {
          stopPropagation(e);
          onCancel?.();
        }}
        onClick={stopPropagation}
        onMouseDown={stopPropagation}
      >
        <div style={maskStyle} onTouchStart={stopPropagation}>
          <div className={styles.pickerWrapper}>
            <div className={styles.pickerWrapperHeader}>
              <div
                className={styles.pickerWrapperHeaderCancel}
                onTouchStart={(e: React.TouchEvent) => {
                  onCancel?.(formatTouchEvent({ event: e, type: 'change' }));
                }}
              >
                取消
              </div>
              <div
                className={styles.pickerWrapperHeaderConfirm}
                onTouchStart={e => {
                  onConfirm?.(formatTouchEvent({ event: e, type: 'change' }));
                }}
              >
                确定
              </div>
            </div>
            {children}
          </div>
        </div>
      </div>
    );
  }

  return null;
}
