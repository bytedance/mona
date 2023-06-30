import React, { FC, useEffect } from 'react';
import { AppConfig } from '@bytedance/mona';
import { useNavBarTitle } from './utils';
import styles from './index.module.less';

export type NavBarProps = AppConfig['window'];

const NavBar: FC<NavBarProps> = props => {
  if (!props.navigationBarTitleText) {
    return null;
  }

  useEffect(() => {
    const classList = document.body.classList;
    const styleName = styles['mona-navbar-extra-height'];
    if (!classList.contains(styleName)) {
      classList.add(styleName);
    }

    return () => classList.remove(styleName);
  }, []);

  const { title, frontColor, backgroundColor } = useNavBarTitle(props);

  const navBarStyle: React.CSSProperties = {
    backgroundColor,
    color: frontColor,
  };

  return (
    <div className={styles['mona-web-navbar']} style={{ ...navBarStyle }}>
      <div className={styles['mona-web-navbar-left']} onClick={() => history.go(-1)}>
        <img
          className={styles['mona-web-navbar-back']}
          src="https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/5e8385040f71f4bc2b8d749a5406fae0.png~tplv-w59vco1lho-png.png"
        />
      </div>
      <div className={styles['mona-web-navbar-title']} style={{ color: frontColor }}>
        {title}
      </div>
      <div></div>
    </div>
  );
};

export default NavBar;
