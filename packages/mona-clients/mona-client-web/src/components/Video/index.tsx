import React from 'react';
import { VideoProps } from '@bytedance/mona';

const Video: React.FC<VideoProps> = ({ children }) => {
  return <div>{children}</div>
}

export default Video;
