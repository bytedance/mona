import React from 'react';
import { ButtonProps } from '@bytedance/mona';

const Button: React.FC<ButtonProps> = ({ children }) => {
  return <button>{children}</button>
}

export default Button;
