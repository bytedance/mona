import React from 'react';
import { RadioProps } from '@bytedance/mona';

const Radio: React.FC<RadioProps> = ({ children }) => {
  return <button>{children}</button>
}

export default Radio;
