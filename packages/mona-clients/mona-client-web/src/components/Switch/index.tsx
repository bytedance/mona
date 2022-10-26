import React, { useCallback, useEffect, useState } from 'react';
import styles from './index.module.less';
import { SwitchProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';
import { useFormContext } from '../Form/hooks';

const Switch: React.FC<SwitchProps> = props => {
  const { children, id, disabled, name = '', color = '#F85959', checked, type = 'switch', ...restProps } = props;
  const { handleClassName, onClick, ...handlerProps } = useHandlers(restProps);

  const [isChecked, setIsChecked] = useState(checked);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleClick = (e: React.MouseEvent) => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);
    onClick(e);
  };

  const reset = useCallback(() => setIsChecked(false), []);
  useFormContext(name, isChecked, reset);

  return (
    <div className={handleClassName(styles.switch)} {...handlerProps}>
      {type === 'checkbox' ? (
        <div className={`${styles.cinput} ${isChecked ? styles.checked : ''} ${disabled ? styles.disabled : ''}`}>
          <input disabled={disabled} id={id} onClick={handleClick} type="checkbox" className={styles.inner} />
        </div>
      ) : (
        <div className={styles.wrapper}>
          <div
            className={`${styles.input} ${isChecked ? styles.checked : ''}`}
            style={{ borderColor: isChecked ? color : undefined, backgroundColor: color }}
          >
            <i className={styles.before}></i>
            <input disabled={disabled} id={id} onClick={handleClick} type="checkbox" className={styles.inner} />
          </div>
          <i className={styles.before}>{children}</i>
        </div>
      )}
    </div>
  );
};

export default Switch;
