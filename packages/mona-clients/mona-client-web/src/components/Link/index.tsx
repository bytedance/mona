import formatPath from '@bytedance/mona-shared/dist/formatPath';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

export interface LinkProps {
  to: string;
}

const Link: React.FC<LinkProps> = ({ children, to, ...props }) => <RouteLink to={formatPath(to)} {...props}>{children}</RouteLink>;

export default Link;
