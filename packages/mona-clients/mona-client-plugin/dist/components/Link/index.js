import { formatPath } from '@/utils/formatPath';
import React from 'react';
import { Link as RouteLink } from 'react-router-dom';
var Link = function (_a) {
    var children = _a.children, to = _a.to;
    return React.createElement(RouteLink, { to: formatPath(to) }, children);
};
export default Link;
//# sourceMappingURL=index.js.map