import React, { useRef } from 'react';
import { CheckboxGroupProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';

export const EMPTY_ITEM = Symbol('checkboxEmpty');

interface CheckboxGroupContextProps {
  initValue: (value?: string, checked?: boolean) => number;
  changeValue: (index: number, value?: string) => void
  toggleChecked: (index: number, checked?: boolean) => void
}

interface ValueItem {
  value?: string;
  checked?: boolean;
}

export const CheckboxGroupContext = React.createContext<CheckboxGroupContextProps | null>(null)

const CheckboxGroup: React.FC<CheckboxGroupProps> = ({ children, onChange, ...restProps }) => {
  const { handleClassName, ...handlerProps } = useHandlers(restProps);
  // const [values, setValues] = useState<ValueItem[]>([]);
  const valuesRef = useRef<ValueItem[]>([])
  const indexRef = useRef(0);
  
  const context = {
    initValue: (value?: string, checked?: boolean) => {
      const index = indexRef.current++;
      const newValues = [...valuesRef.current];
      // record order
      newValues[index] = { value, checked };
      valuesRef.current = newValues;
      return index;
    },
    changeValue: (index: number, value?: string) => {
      const newValues = [...valuesRef.current];
      newValues[index] = { ...newValues[index], value };
      valuesRef.current = newValues;
    },
    toggleChecked: (index: number, checked?: boolean) => {
      const newValues = [...valuesRef.current];
      newValues[index] = { ...newValues[index], checked }
      valuesRef.current = newValues;
      
      if (typeof onChange === 'function') {
        const result = newValues.filter(v => v.checked).map(v => v.value);
        onChange({ detail: { value: result } })
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
