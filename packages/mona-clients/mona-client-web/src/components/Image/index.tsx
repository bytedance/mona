import React, { useContext, useEffect, useRef, useState } from 'react';
import { ImageProps } from '@bytedance/mona';
import cs from 'classnames';
import { ScrollViewContext } from '../ScrollView';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { formatSyntheticEvent } from '../utils';

const ImageComponent: React.FC<ImageProps> = ({ children, src, mode = 'scaleToFill', lazyLoad = false, onError, onLoad, ...restProps }) => {
  const { handleClassName, ...handlerProps} = useHandlers(restProps);
  const [url, setUrl] = useState('');
  const [load, setLoad] = useState(!lazyLoad);
  const ref = useRef<HTMLDivElement | null>(null);
  const loadedRef = useRef(!lazyLoad);

  const context = useContext(ScrollViewContext);

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setUrl(src || '');
    if (typeof onLoad === 'function') {
      onLoad(formatSyntheticEvent({ event: e }));
    }
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (typeof onError === 'function') {
      onError(formatSyntheticEvent({ event: e }));
    }
  }

  // only run when init
  useEffect(() => {
    const callback = (scrollEle: Element) => {
      if (!loadedRef.current) {
        const { top: offsetTop, left: offsetLeft } = scrollEle.getBoundingClientRect();
        const clientHeight = scrollEle.clientHeight;
        const clientWidth = scrollEle.clientWidth;
        const rect = ref.current?.getBoundingClientRect();
        const top = rect?.top || 0;
        const left = rect?.left || 0;
        if ((offsetTop + clientHeight) >= top && (offsetLeft + clientWidth) >= left) {
          loadedRef.current = true;
          setLoad(true);
        }
      }
    }
    
    if (lazyLoad) {
      context?.registerScrollCallback(callback);
    }
    return () => {
      context?.unregisterScrollCallback(callback);
    }
  }, [lazyLoad])
  
  return (
    <div ref={ref} {...handlerProps} className={handleClassName(styles.wrapper)}>
      {load ? <img className={styles.hidden} src={src} onLoad={handleLoad} onError={handleError} /> : null}
      {url ? <div style={{ backgroundImage: `url("${url}")` }} className={cs(styles.image, styles[mode.replace(/\s/, '')])}></div> : null}
    </div>
  )
}

export default ImageComponent;
