import React, { useState } from 'react';
import { ButtonProps } from '@bytedance/mona';
import cs from 'classnames';
import styles from './index.module.less';

const Button: React.FC<ButtonProps> = (props) => {
  const {
    children,
    type,
    formType,
    openType,
    onAnimationEnd,
    onAnimationIteration,
    onAnimationStart,
    onGetPhoneNumber,
    onLongPress,
    onLongTap,
    onTap,
    onTouchCancel,
    onTouchEnd,
    onTouchForceChange,
    onTouchMove,
    onTouchStart,
    onTransitionEnd,
    className,
    hoverClassName = '',
    ...restProps
  } = props;

  const [isHover, setIsHover] = useState(false);

  const handleTouchStart = (e: any) => {
    setIsHover(true);
    if (onTouchStart) {
      onTouchStart(e);
    }
  }

  const handleTouchEnd = (e: any) => {
    setIsHover(false);
    if (onTouchEnd) {
      onTouchEnd(e);
    }
  }

  const handleTouchMove = (e: any) => {
    if (onTouchMove) {
      onTouchMove(e)
    }
  }

  const handleTap = (e: any) => {
    if (onTap) {
      onTap(e);
    }
  }

  return (
    <button
      {...restProps}
      className={cs(styles.button, className, { [hoverClassName]: hoverClassName && isHover })}
      type={formType}
      data-type={type}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onTouchMove={handleTouchMove}
      onMouseEnter={handleTouchStart}
      onMouseLeave={handleTouchEnd}
      onMouseMove={handleTouchMove}
      onClick={handleTap}
    >{children}</button>
  )
}

export default Button;
