import { SandboxOptions } from "@/sandbox";
import ScopeStorage from "./ScopeStorage";

export default (options: SandboxOptions) => ({
  localStorage: new ScopeStorage(options.scope, window.localStorage),
  sessionStorage: new ScopeStorage(options.scope, window.sessionStorage),
})