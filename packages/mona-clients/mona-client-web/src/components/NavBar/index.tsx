import React, { FC, useEffect, useRef, useState } from 'react';
import { AppConfig } from '@bytedance/mona';
import { useNavBarTitle } from './utils';
import styles from './index.module.less';
const MONA_STATUS_BAR_HEIGHT = '__MONA_STATUS_BAR_HEIGHT__';

const isAndroid = navigator.userAgent.includes('com.ss.android.merchant');
// @ts-ignore
const statusBarHeight = window[MONA_STATUS_BAR_HEIGHT];

export type NavBarProps = AppConfig['window'];

const NavBar: FC<NavBarProps> = props => {
  const [canBack, setCanBack] = useState((history as any)._pos > 0);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h: any = history;
    if (h.onChange) {
      (history as any).onChange(() => {
        setCanBack(h._pos > 0);
      })
    }
  }, [setCanBack])

  useEffect(() => {
    const el = document.body;
    const originPaddingTop = el.style.paddingTop;
    if (ref.current) {
      el.style.paddingTop = `calc(${originPaddingTop || '0px'} + ${ref.current?.offsetHeight ?? 0}px)`
    }

    return () => {
      el.style.paddingTop = originPaddingTop;
    };
  }, [ref]);

  const { title, frontColor, backgroundColor } = useNavBarTitle(props);

  const navBarStyle: React.CSSProperties = {
    backgroundColor,
    color: frontColor,
  };

  if (!props.navigationBarTitleText) {
    return null;
  }

  return (
    <div ref={ref} className={styles['mona-web-navbar']} style={{ ...navBarStyle, ...(isAndroid ? { paddingTop: statusBarHeight } : {}) }}>
      {
        canBack ? (
          <div className={styles['mona-web-navbar-left']} onClick={() => history.go(-1)}>
            <svg viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3402" width="16" height="16"><path d="M395.21518 513.604544l323.135538-312.373427c19.052938-18.416442 19.052938-48.273447 0-66.660212-19.053961-18.416442-49.910737-18.416442-68.964698 0L291.75176 480.290811c-19.052938 18.416442-19.052938 48.273447 0 66.660212l357.633237 345.688183c9.525957 9.207709 22.01234 13.796214 34.497699 13.796214 12.485359 0 24.971741-4.588505 34.466999-13.82896 19.052938-18.416442 19.052938-48.242747 0-66.660212L395.21518 513.604544z" fill="currentColor" p-id="3403"></path></svg>
          </div>
        ) : null
      }
      <div className={styles['mona-web-navbar-title']} style={{ color: frontColor }}>
        {title}
      </div>
      <div></div>
    </div>
  );
};

export default NavBar;
