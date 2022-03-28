import React from 'react';
import { WebviewProps } from '@bytedance/mona';
import styles from './index.module.less';

const Webview: React.FC<WebviewProps> = ({ src }) => {
  return (
    <div className={styles.container}>
      <iframe className={styles.iframe} src={src}></iframe>
    </div>
  )
}

export default Webview;
