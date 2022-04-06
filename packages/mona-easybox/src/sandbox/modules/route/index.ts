// handle link navigate

import { SandboxOptions } from "@/sandbox";
import RouteSandbox from "./RouteSandbox";

export default (options: SandboxOptions) => {
  const routeSandbox = new RouteSandbox(options);
  
  return {
    history: routeSandbox.history,
    location: routeSandbox.location,
    addEventListener: routeSandbox.addListener.bind(routeSandbox),
    removeEventListener: routeSandbox.removeListener.bind(routeSandbox),
    open: routeSandbox.open.bind(routeSandbox),
    _routeSandbox: routeSandbox
  }
}