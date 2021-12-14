import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputProps } from '@bytedance/mona';
import styles from './index.module.less';
import { FormContext } from '../Form';
import { useHandlers } from '../hooks';

const Input: React.FC<InputProps> = (props) => {
  const {
    children,
    name = '',
    value: initValue = '',
    type = 'text',
    password = false,
    placeholderStyle,
    maxLength = 140,
    // TODO
    focus = false,
    cursorSpacing = 0,
    cursor = -1,
    selectionStart = -1,
    selectionEnd = -1,
    style = {},
    onInput,
    onFocus,
    onBlur,
    onConfirm,
    adjustPosition = true,
    confirmType = 'done',
    ...restProps
  } = props;

  const { handleClassName, ...handlerProps} = useHandlers(restProps)
  const context = useContext(FormContext);
  const [value, setValue] = useState(initValue);
  const orderRef = useRef<number | null>(null);

  useEffect(() => {
    if (context) {
      const index = orderRef.current;
      orderRef.current = context.register(
        () => ({ name, value }),
        () => setValue(''),
        index
      )

      return () => {
        context.unregister(index);
      }
    }
    return () => {}
  }, [context, name, value])

  const handleInput: React.FormEventHandler<HTMLInputElement> = (e) => {
    const newValue = (e.target as HTMLInputElement).value;
    setValue(newValue);
  }

  const inputType = password ? type === 'text' ? 'text' : 'number' : 'password';
  
  return <input maxLength={maxLength} name={name} value={value} type={inputType} onInput={handleInput} className={handleClassName(styles.input)} {...handlerProps} />
}

export default Input;
