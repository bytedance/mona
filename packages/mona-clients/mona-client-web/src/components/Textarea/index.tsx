import React, { useCallback, useEffect, useRef, useState } from 'react';
import { TextareaProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';
import { plainStyle } from '../Input/utils';
import { useFormContext } from '../Form/hooks';

const Textarea: React.FC<TextareaProps> = (props) => {
  const {
    children,
    name = '',
    value: initValue = '',
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
    // TODO: to complete
    autoHeight = false,
    fixed = false,
    disableDefaultPadding = false,
    ...restProps
  } = props;

  const { handleClassName, ...handlerProps} = useHandlers(restProps)
  const inputRef = useRef<HTMLTextAreaElement | null>(null);

  const [value, setValue] = useState(initValue);

  useEffect(() => {
    setValue(value);
  }, [value])

  const reset = useCallback(() => setValue(''), []);
  useFormContext(name, value, reset);

  const handleInput: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
    const newValue = (e.target as HTMLTextAreaElement).value;
    setValue(newValue);

    if (typeof onInput === 'function') {
      onInput({
        target: { id: '', tagName: 'input', dataset: {} },
        currentTarget: { id: '', tagName: 'input', dataset: {} },
        timeStamp: e.timeStamp,
        type: 'input',
        detail: {
          value: newValue,
          cursor: (e.target as HTMLTextAreaElement).selectionStart || 0
        }
      });
    }
  }

  const handleFocus: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
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

  const handleBlur: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
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

   const handleConfirm: React.FormEventHandler<HTMLTextAreaElement> = (e) => {
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
      sheet?.insertRule(`.${styles.textarea}::placeholder { ${style} }`, index)
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

  return <textarea ref={inputRef} maxLength={maxLength} name={name} value={value} onFocus={handleFocus} onBlur={handleBlur} onKeyDown={handleConfirm} onInput={handleInput} className={handleClassName(styles.textarea)} {...handlerProps} />
}

export default Textarea;
