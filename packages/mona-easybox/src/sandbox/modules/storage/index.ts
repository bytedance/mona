import Sandbox from '@/sandbox';
import ScopeStorage from './ScopeStorage';

export default (sandbox: Sandbox) => {
  const { options } = sandbox;

  return {
    localStorage: new ScopeStorage(options.scope, window.localStorage),
    sessionStorage: new ScopeStorage(options.scope, window.sessionStorage),
  };
};
