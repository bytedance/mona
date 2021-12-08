import React, { useEffect, useState } from 'react';
import cs from 'classnames';
import styles from './index.module.less';
import { SwitchProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';

const Switch: React.FC<SwitchProps> = (props) => {
  const { children, id, disabled, color = '#F85959', checked, type = 'switch', ...restProps } = props;
  const { handleClassName, onClick, ...handlerProps} = useHandlers(restProps);

  const [isChecked, setIsChecked] = useState(checked);

  const handleClick = (e: React.MouseEvent) => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);
    onClick(e);
  }

  useEffect(() => {
    setIsChecked(checked);
  }, [checked])

  return (
    <div className={handleClassName(styles.switch)} {...handlerProps}>
      {
        type === 'checkbox' ? (
          <div className={cs(styles.cinput, {[styles.checked]: isChecked}, {[styles.disabled]: disabled})}>
            <input disabled={disabled} id={id} onClick={handleClick} type="checkbox" className={styles.inner} />
          </div>
        ) : (
          <div className={styles.wrapper}>
            <div className={cs(styles.input, {[styles.checked]: isChecked})} style={{ borderColor: isChecked ? color: undefined, backgroundColor: color }}>
              <i className={styles.before}></i>
              <input disabled={disabled} id={id} onClick={handleClick} type="checkbox" className={styles.inner} />
            </div>
            <i className={styles.before}>
              {children}
            </i>
          </div>
        )
      }
    </div>
  )
}

export default Switch;
