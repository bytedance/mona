// handle link navigate

import Sandbox from '@/sandbox';
import RouteSandbox from './RouteSandbox';

export default (sandbox: Sandbox) => {
  const { options } = sandbox;
  const routeSandbox = new RouteSandbox(options);

  return {
    history: routeSandbox.history,
    location: routeSandbox.location,
    addEventListener: routeSandbox.addListener.bind(routeSandbox),
    removeEventListener: routeSandbox.removeListener.bind(routeSandbox),
    open: routeSandbox.open.bind(routeSandbox),
    _routeSandbox: routeSandbox,
  };
};
