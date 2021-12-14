import React, { createContext, useRef } from 'react';
import { FormProps } from '@bytedance/mona';
import { useHandlers } from '../hooks';

interface FormContextProps {
  register: (submit: () => { name: string; value: any }, reset: () => void, order?: number | null) => number;
  unregister: (registerId: number | null) => void;
}
export const FormContext = createContext<FormContextProps | null>(null);

const Form: React.FC<FormProps> = (props) => {
  const {
    children,
    onSubmit,
    onReset,
    ...restProps
  } = props;

  const { handleClassName, ...handlerProps} = useHandlers(restProps)

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (e) => {
    e.preventDefault();

    const cbs = cbsRef.current;
    const result: Record<string, any> = {};
    cbs.forEach(cb => {
      const { submit } = cb;
      const { name, value } = submit();
      if (name) {
        result[name] = value;
      }
    })

    const event = {
      value: result
    }
    console.log(event);
  }

  const handleReset = () => {
    const cbs = cbsRef.current;
    cbs.forEach(cb => {
      const { reset } = cb;
     reset();
    })
  }

  const indexRef = useRef(0);
  const cbsRef = useRef<{submit: () => { name: string; value: any }, reset: () => void}[]>([]);
  const context: FormContextProps = {
    register: (submit, reset, order) => {
      const index = order == null ? indexRef.current++ : order;
      cbsRef.current[index] = { submit, reset };
      return index;
    },
    unregister: (index) => {
      if (index != null) {
        cbsRef.current.splice(index, 1);
      }
    }
  }

  
  return (
    <form onSubmit={handleSubmit} onReset={handleReset} className={handleClassName()} {...handlerProps}>
      <FormContext.Provider value={context}>
        {children}
      </FormContext.Provider>
    </form>
  )
}

export default Form;
