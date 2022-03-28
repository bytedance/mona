import { useContext, useEffect, useRef } from "react";
import { FormContext } from './index';

export const useFormContext = (name: string, value: any, reset: () => void) => {
  const context = useContext(FormContext);
  const orderRef = useRef<number | null>(null);

  useEffect(() => {
    if (context) {
      const index = orderRef.current;
      orderRef.current = context.register(
        () => ({ name, value: typeof value === 'function' ? value() : value }),
        () => reset(),
        index
      )

      return () => {
        context.unregister(index);
      }
    }
    return () => {}
  }, [context, name, value, reset])
}