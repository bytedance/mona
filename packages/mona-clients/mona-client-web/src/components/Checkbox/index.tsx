import React, { useState, useEffect, useContext, useRef } from 'react';
import { CheckboxProps } from '@bytedance/mona';
import cs from 'classnames';
import { CheckboxGroupContext } from '../CheckboxGroup';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const {
    value,
    disabled,
    checked,
    color = '#F85959',
    children,
    ...restProps
  } = props;

  const group = useContext(CheckboxGroupContext);
  const orderRef = useRef(-1);

  const { handleClassName, onClick, ...handlerProps } = useHandlers(restProps);

  const [isChecked, setIsChecked] = useState(checked);
  
  // don't change order of useEffects, the order is important
  useEffect(() => {
    setIsChecked(checked);
    if (orderRef.current >= 0) {
      group?.toggleChecked(orderRef.current, checked);
    }
  }, [checked])

  useEffect(() => {
    orderRef.current = group ? group?.initValue(value, checked) : -1;
  }, [])

  useEffect(() => {
    if (orderRef.current >= 0) {
      group?.changeValue(orderRef.current, value);
    }
  }, [value])

  const handleClick = (e: any) => {
    const newIsChecked = !isChecked;
    setIsChecked(newIsChecked);
    if (orderRef.current >= 0) {
      group?.toggleChecked(orderRef.current, newIsChecked);
    }
    onClick(e);
  }

  return (
    <div
      className={handleClassName(styles.checkbox)}
      {...handlerProps}
      onClick={handleClick}
    >
      <div className={styles.wrapper}>
        <div className={cs(styles.input, {[styles.checked]: isChecked})} style={{ borderColor: color, backgroundColor: isChecked ? color: '' }}></div>
        {children}
      </div>
    </div>
  )
}

export default Checkbox;
