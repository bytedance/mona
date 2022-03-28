import React from 'react';
import { LabelProps } from '@bytedance/mona';
import styles from './index.module.less';
import { useHandlers } from '../hooks';

interface labelContextProps {
   tap: (callback: () => void) => void;
}

export const LabelContext = React.createContext<labelContextProps | null>(null);

const Label: React.FC<LabelProps> = (props) => {
  const { children, for: htmlFor, ...restProps } = props;
  const { handleClassName, ...handlerProps } = useHandlers(restProps);

  return (
    <label htmlFor={htmlFor} className={handleClassName(styles.label)} {...handlerProps}>
        {children}
    </label>
  )
}

export default Label;
