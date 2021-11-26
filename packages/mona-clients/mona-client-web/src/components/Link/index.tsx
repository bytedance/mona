import formatPath from '../../utils/formatPath';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';

export interface LinkProps {
  to: string;
}

const Link: React.FC<LinkProps> = ({ children, to }) => <RouteLink to={formatPath(to)}>{children}</RouteLink>;

export default Link;
