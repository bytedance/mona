import React, { FC } from 'react';
import { AppConfig } from '@bytedance/mona';
import { useNavBarTitle } from './utils';
import './index.module.less';

export type NavBarProps = AppConfig['window'];

const NavBar: FC<NavBarProps> = props => {
  if (!props.navigationBarTitleText) {
    return null;
  }

  const { title, frontColor, backgroundColor } = useNavBarTitle(props);

  const navBarStyle: React.CSSProperties = {
    backgroundColor,
    color: frontColor,
  };

  return (
    <div className="mona-web-navbar" style={{ ...navBarStyle }}>
      <div className="mona-web-navbar-left" onClick={() => history.go(-1)}>
        <img
          className="mona-web-navbar-back"
          src="https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/5e8385040f71f4bc2b8d749a5406fae0.png~tplv-w59vco1lho-png.png"
        />
      </div>
      <div className="mona-web-navbar-title" style={{ color: frontColor }}>
        {title}
      </div>
      <div></div>
    </div>
  );
};

export default NavBar;
