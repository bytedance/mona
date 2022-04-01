import { Navigation } from "../../../index";

function escapeStringRegexp(str: string) {
  if (typeof str !== 'string') {
    throw new TypeError('Expected a string');
  }

  // Escape characters with special meaning either inside or outside character sets.
  // Use a simple backslash escape when it’s always valid, and a `\xnn` escape when the simpler form would be disallowed by Unicode patterns’ stricter grammar.
  return str.replace(/[|\\{}()[\]^$+*?.]/g, '\\$&').replace(/-/g, '\\x2d');
}

export function interceptNavigation(navigation: Navigation, href: string) {
  if (navigation?.allowDomains?.length) {
    const allowDomains = navigation.allowDomains ?? [];
    for (let i = 0; i < allowDomains.length; i++) {
      const matchReg = escapeStringRegexp(allowDomains[i]).replace(/\*/g, 'S+');
      const result = new RegExp(matchReg).test(href);
      if (result) {
        return result;
      }
    }
  }
  return false;
}

export function processedListener(listener: EventListenerOrEventListenerObject) {
  return typeof listener === 'function' ? listener : listener.handleEvent;
}