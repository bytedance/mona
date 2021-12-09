import React, { useRef, useState } from 'react';
import { ImageProps } from '@bytedance/mona';
import cs from 'classnames';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { formatSyntheticEvent } from '../utils';

const ImageComponent: React.FC<ImageProps> = ({ children, src, mode = 'scaleToFill', lazyLoad = false, onError, onLoad, ...restProps }) => {
  const { handleClassName, ...handlerProps} = useHandlers(restProps);
  const [url, setUrl] = useState('');
  const [load, setLoad] = useState(!lazyLoad);
  const ref = useRef<HTMLDivElement | null>(null);

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

  const onScroll = (scrollEle: Element) => {
    const scrollTop = scrollEle.scrollTop;
    const clientHeight = scrollEle.clientHeight;
    const rect = ref.current?.getBoundingClientRect();
    const top = rect?.top || 0;
    if ((scrollTop + clientHeight) > top) {
      setLoad(true);
    }
  }

  console.log('onScroll', onScroll);
  
  return (
    <div ref={ref} {...handlerProps} className={handleClassName(styles.wrapper)}>
      {load ? <img className={styles.hidden} src={src} onLoad={handleLoad} onError={handleError} /> : null}
      {url ? <div style={{ backgroundImage: `url("${url}")` }} className={cs(styles.image, styles[mode.replace(/\s/, '')])}></div> : url}
    </div>
  )
}

export default ImageComponent;
