import React, { useState, useEffect, useContext, useRef } from 'react';
import { CheckboxProps } from '@bytedance/mona';
import cs from 'classnames';
import { CheckboxGroupContext } from '../CheckboxGroup';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { formatMouseEvent } from '../utils';

const Checkbox: React.FC<CheckboxProps> = (props) => {
  const {
    value,
    disabled,
    checked,
    color = '#F85959',
    children,
    id,
    ...restProps
  } = props;

  const group = useContext(CheckboxGroupContext);
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
  }
  
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

  return (
    <div
      className={handleClassName(styles.checkbox)}
      {...handlerProps}
    >
      <div className={styles.wrapper}>
        <div className={cs(styles.input, {[styles.checked]: isChecked})} style={{ borderColor: color, backgroundColor: isChecked ? color: '' }}>
          <input value={value} id={id} onClick={handleClick} type="checkbox" className={styles.inner}></input>
        </div>
        {children}
      </div>
    </div>
  )
}

export default Checkbox;
