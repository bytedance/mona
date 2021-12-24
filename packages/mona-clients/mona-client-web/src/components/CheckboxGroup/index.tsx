import React, { useCallback, useRef } from 'react';
import { CheckboxGroupProps, TouchEvent } from '@bytedance/mona';
import { useHandlers } from '../hooks';
import { useFormContext } from '../Form/hooks';

export const EMPTY_ITEM = Symbol('checkboxEmpty');

interface CheckboxGroupContextProps {
  initValue: (value?: string, checked?: boolean, clear?: () => void) => number;
  changeValue: (index: number, value?: string) => void
  toggleChecked: (index: number, checked?: boolean, e?: TouchEvent) => void
}

interface ValueItem {
  value?: string;
  checked?: boolean;
}

export const CheckboxGroupContext = React.createContext<CheckboxGroupContextProps | null>(null)

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, name = '', onChange, ...restProps }) => {
  const { handleClassName, ...handlerProps } = useHandlers(restProps);
  const valuesRef = useRef<ValueItem[]>([])
  const indexRef = useRef(0);
  const clearsRef = useRef<((() => void) | undefined)[]>([]);

  const reset = useCallback(() => {
    const newValues = valuesRef.current;
    const cbs = clearsRef.current;
    for (let i = 0; i < newValues.length; i++) {
      newValues[i] = { ...newValues[i], checked: false }
      const cb = cbs[i];
      if (typeof cb === 'function') {
        cb();
      }
    }
  }, [clearsRef, valuesRef]);

  const getValues = () => {
    return valuesRef.current.filter(v => v.checked).map(v => v.value);
  }
  useFormContext(name, getValues, reset);

  
  const context = {
    initValue: (value?: string, checked?: boolean, clear?: () => void) => {
      const index = indexRef.current++;
      const newValues = [...valuesRef.current];
      // record order
      newValues[index] = { value, checked };
      valuesRef.current = newValues;
      clearsRef.current[index] = clear;
      return index;
    },
    changeValue: (index: number, value?: string) => {
      const newValues = [...valuesRef.current];
      newValues[index] = { ...newValues[index], value };
      valuesRef.current = newValues;
    },
    toggleChecked: (index: number, checked?: boolean, event?: TouchEvent) => {
      const newValues = [...valuesRef.current];
      newValues[index] = { ...newValues[index], checked }
      valuesRef.current = newValues;
      
      if (typeof onChange === 'function') {
        const result = newValues.filter(v => v.checked).map(v => v.value);
        const e = { ...event!, detail: { value: result as string[] } };
        onChange(e)
      }
    }
  }

  return (
    <div className={handleClassName()} {...handlerProps}>
      <CheckboxGroupContext.Provider value={context}>
        {children}
      </CheckboxGroupContext.Provider>
    </div>
  )
}

export default CheckboxGroup;
