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
            <img
              className={styles['mona-web-navbar-back']}
              src="https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/5e8385040f71f4bc2b8d749a5406fae0.png~tplv-w59vco1lho-png.png"
            />
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
