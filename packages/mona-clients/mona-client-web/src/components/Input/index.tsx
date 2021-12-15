import React, { useContext, useEffect, useRef, useState } from 'react';
import { InputProps } from '@bytedance/mona';
import styles from './index.module.less';
import { FormContext } from '../Form';
import { useHandlers } from '../hooks';
import { plainStyle } from './utils';

const Input: React.FC<InputProps> = (props) => {
  const {
    children,
    name = '',
    value: initValue = '',
    type = 'text',
    password = false,
    placeholderStyle,
    maxLength = 140,
    focus = false,
    cursorSpacing = 0,
    cursor = -1,
    selectionStart = -1,
    selectionEnd = -1,
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
  const orderRef = useRef<number | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(value);
  }, [value])

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

    if (typeof onInput === 'function') {
      onInput({
        target: { id: '', tagName: 'input', dataset: {} },
        currentTarget: { id: '', tagName: 'input', dataset: {} },
        timeStamp: e.timeStamp,
        type: 'input',
        detail: {
          value: newValue,
          cursor: (e.target as HTMLInputElement).selectionStart || 0
        }
      });
    }
  }

  const handleFocus: React.FormEventHandler<HTMLInputElement> = (e) => {
    if (typeof onFocus === 'function') {
      onFocus({
        target: { id: '', tagName: 'input', dataset: {} },
        currentTarget: { id: '', tagName: 'input', dataset: {} },
        timeStamp: e.timeStamp,
        type: 'focus',
        detail: {
          value,
          // TODO
          height: -1
        }
      });
    }
  }

  const handleBlur: React.FormEventHandler<HTMLInputElement> = (e) => {
    if (typeof onBlur === 'function') {
      onBlur({
        target: { id: '', tagName: 'input', dataset: {} },
        currentTarget: { id: '', tagName: 'input', dataset: {} },
        timeStamp: e.timeStamp,
        type: 'blur',
        detail: {
          value,
        }
      });
    }
  }

   const handleConfirm: React.FormEventHandler<HTMLInputElement> = (e) => {
    if ((e as any).keyCode === 13 && typeof onConfirm === 'function') {
      onConfirm({
        target: { id: '', tagName: 'input', dataset: {} },
        currentTarget: { id: '', tagName: 'input', dataset: {} },
        timeStamp: e.timeStamp,
        type: 'confirm',
        detail: {
          value,
        }
      });
    }
  }

  // handle focus
  useEffect(() => {
    if (inputRef.current && focus) {
      inputRef.current.focus();
    }
  }, [focus, inputRef.current])

  // handle placeholderStyle
  useEffect(() => {
    // TODO: OPTIMIZE, this may cause memo leak
    if (placeholderStyle) {
      const style = plainStyle(placeholderStyle);
      let $style = document.getElementsByTagName("style")[0];
      if (!$style) {
        $style = document.createElement("style");
        document.head.appendChild($style);
      }
      const sheet = $style.sheet;
      const index = sheet?.cssRules.length || 0;
      sheet?.insertRule(`.${styles.input}::placeholder { ${style} }`, index)
    }
  }, [placeholderStyle])

  // handle focus
  useEffect(() => {
    const $input = inputRef.current
    if ($input && focus) {
      $input.focus();
      if (cursor && selectionStart === -1 && selectionEnd === -1) {
        $input.selectionStart = $input.selectionEnd = cursor;
      } else if (selectionStart !== -1 || selectionEnd !== -1) {
        $input.selectionStart = selectionStart;
        $input.selectionEnd = selectionEnd;
      }
    }
  }, [inputRef.current, selectionStart, selectionEnd, cursor, focus])

  const inputType = password ? 'password' : type === 'text' ? 'text' : 'number';
  
  return <input ref={inputRef} enterKeyHint={confirmType} maxLength={maxLength} name={name} value={value} type={inputType} onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleConfirm} onInput={handleInput} className={handleClassName(styles.input)} {...handlerProps} />
}

export default Input;
