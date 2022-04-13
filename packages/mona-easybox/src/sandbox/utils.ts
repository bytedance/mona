import Sandbox from '.';

export function hasOwn(target: any, prop: PropertyKey) {
  return Object.prototype.hasOwnProperty.call(target, prop);
}

const __func_bind__ = Symbol.for('mona_func_bind');
export function bindContext(value: any, context: any) {
  if (typeof value === 'function') {
    // get bind function from cache
    if (hasOwn(value, __func_bind__)) {
      return value[__func_bind__];
    }

    return (value[__func_bind__] = value.bind(context));
  }

  // FIX: hanle some spec cases
  return value;
}

// const SCRIPT_TAG_NAME = 'SCRIPT';
const IFRAME_TAG_NAME = 'IFRAME';
// const LINK_TAG_NAME = 'LINK';

export function isHijackTag(tagName: string = '') {
  // return [SCRIPT_TAG_NAME, LINK_TAG_NAME, IFRAME_TAG_NAME].includes(tagName?.toUpperCase());
  return [IFRAME_TAG_NAME].includes(tagName?.toUpperCase());
}

// export function createPlaceholderElement(text: string = '') {
//   const newDiv = document.createElement('div');
//   const newContent = document.createTextNode(text);
//   newDiv.appendChild(newContent);
//   return newDiv;
// }

export const sandboxMap = {
  deps: new WeakMap(),

  get(element: Element): Sandbox {
    return this.deps.get(element);
  },

  set(element: Element, sandbox: Sandbox) {
    if (this.deps.get(element)) return;
    this.deps.set(element, sandbox);
  },
};

export const limitedCreateElement = (tagName: string, options: ElementCreationOptions | undefined) => {
  if (isHijackTag(tagName.toUpperCase())) {
    // return null;
    console.error(`${tagName} limit creation`);
  }
  const el = document.createElement(tagName, options);
  //@ts-ignore
  // el.__createByMona = true;
  return el;
};
export const limitedCreateElementNS = (
  namespace: string | null,
  tagName: string,
  options?: string | ElementCreationOptions,
) => {
  if (isHijackTag(tagName.toUpperCase())) {
    // return null;
    console.error(`${tagName} limit creation`);
  }
  const el = document.createElementNS(namespace, tagName, options);
  //@ts-ignore
  // el.__createByMona = true;
  return el;
};
