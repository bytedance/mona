import React, { FC } from 'react';
import cs from 'classnames';
import './index.module.less';

interface NavBarProps {
  left?: React.ReactNode;
  right?: React.ReactNode;
  title: string | React.ReactNode;
  onLeftClick?: () => void;
  onRightClick?: () => void;
  onTitleClick?: () => void;
  className?: string;
}

export const NavBar: FC<NavBarProps> = props => (
  <div className={cs('mona-web-navbar', props.className)}>
    <div className="mona-web-navbar-left" onClick={props.onLeftClick}>
      {props.left ? (
        props.left
      ) : (
        <img
          className="mona-web-navbar-back"
          src="https://p3-ecom-fe.byteimg.com/tos-cn-i-w59vco1lho/5e8385040f71f4bc2b8d749a5406fae0.png~tplv-w59vco1lho-png.png"
        />
      )}
    </div>
    <div className="mona-web-navbar-title" onClick={props.onTitleClick}>
      {props.title}
    </div>
    <div onClick={props.onRightClick}>{props.right}</div>
  </div>
);
