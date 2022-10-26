import React, { useState, useEffect, useContext, useRef } from 'react';
import { RadioProps } from '@bytedance/mona';
import { RadioGroupContext } from '../RadioGroup';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { formatMouseEvent } from '../utils';

const Radio: React.FC<RadioProps> = props => {
  const { value, disabled, checked, color = '#F85959', children, id, ...restProps } = props;

  const group = useContext(RadioGroupContext);
  const orderRef = useRef(-1);

  const { handleClassName, onClick, ...handlerProps } = useHandlers(restProps);

  const [isChecked, setIsChecked] = useState(checked);

  const handleClick = (e: React.MouseEvent) => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);
    if (orderRef.current >= 0) {
      group?.toggleChecked(orderRef.current, newIsChecked, formatMouseEvent({ event: e, type: 'change' }));
    }
    onClick(e);
  };

  // don't change order of useEffects, the order is important
  useEffect(() => {
    setIsChecked(checked);
    if (orderRef.current >= 0) {
      group?.toggleChecked(orderRef.current, checked);
    }
  }, [checked]);

  useEffect(() => {
    orderRef.current = group ? group?.initValue(value, checked, () => setIsChecked(false)) : -1;
  }, []);

  useEffect(() => {
    if (orderRef.current >= 0) {
      group?.changeValue(orderRef.current, value);
    }
  }, [value]);

  return (
    <div className={handleClassName(styles.radio)} {...handlerProps}>
      <div className={styles.wrapper}>
        <div
          className={`${styles.input} ${isChecked ? styles.checked : ''}`}
          style={{ borderColor: color, backgroundColor: isChecked ? color : '' }}
        >
          <input id={id} value={value} onClick={handleClick} type="radio" className={styles.inner}></input>
        </div>
        {children}
      </div>
    </div>
  );
};

export default Radio;
