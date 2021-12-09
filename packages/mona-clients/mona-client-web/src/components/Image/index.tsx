import React, { useState } from 'react';
import { ImageProps } from '@bytedance/mona';
import cs from 'classnames';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { formatSyntheticEvent } from '../utils';

const ImageComponent: React.FC<ImageProps> = ({ children, src, mode = 'scaleToFill', lazyLoad, onError, onLoad, ...restProps }) => {
  const { handleClassName, ...handlerProps} = useHandlers(restProps)
  const [url, setUrl] = useState('');

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setUrl(url);
    if (typeof onLoad === 'function') {
      onLoad(formatSyntheticEvent({ event: e }));
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (typeof onError === 'function') {
      onError(formatSyntheticEvent({ event: e }));
    }
  }
  
  return (
    <div {...handlerProps} className={handleClassName(styles.wrapper)}>
      <img className={styles.hidden} src={src} onLoad={handleLoad} onError={handleError} />
      <div style={{ backgroundImage: `url("${url}")` }} className={cs(styles.image, styles[mode.replace(/\s/, '')])}></div>
    </div>
  )
}

export default ImageComponent;
