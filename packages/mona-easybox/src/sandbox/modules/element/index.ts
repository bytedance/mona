// bind event to element a to handle link navigate
// ban tag iframe

import { importEntry } from '@/import-html-entry';
import Sandbox from '@/sandbox';

const Element = window.Element as any;
const rawSetAttribute = Element.prototype.setAttribute;
const rawAddEventListener = Element.prototype.addEventListener;
const rawRemoveEventListener = Element.prototype.removeEventListener;
const rawAppendChild = Element.prototype.appendChild;

const rawWindow = window;
let alreadyProxied = false;

function dispatchEvent(node: any, type: string) {
  const event: Event & { mona?: boolean } = new Event(type);
  event.mona = true;
  Object.defineProperty(event, 'target', { value: node });
  node.dispatchEvent(event);
  type === 'error' && window.dispatchEvent(event);
}

function ProxyScriptNode(_sandbox: Sandbox, node: any) {
  // const that = this;
  node.scriptText = node.innerHTML || node.text || node.innerText;
  ['innerHTML', 'text', 'innerText'].forEach(property => {
    node[property] = '';
    node.removeAttribute(property);
    Object.defineProperty(node, property, {
      get: function get() {
        return this.scriptText || '';
      },
      set: function set(value) {
        this.scriptText = value;

        // // 如果是已经插入到 dom 树里面，则直接执行
        // if (node.parentNode && !node.scriptLoad) {
        //   const { type } = this;
        //   const code = value;
        //   if (!type || isJs(parseContentType(type))) {
        //     const { baseUrl } = sandbox.options;
        //     node.scriptLoad = true;
        //     sandbox.execScript(code, {}, baseUrl, { noEntry: true });
        //   }
        // }
      },
      enumerable: false,
    });
  });
  node.scriptSrc = node.src;
  node.removeAttribute('src');
  Object.defineProperty(node, 'src', {
    get: function get() {
      return this.scriptSrc || '';
    },
    set: function set(value) {
      this.scriptSrc = value;

      // // 如果是已经插入到 dom 树里面，则直接执行
      // if (node.parentNode && value && !node.scriptLoad) {
      //   const { baseUrl, namespace = '' } = sandbox.options;

      //   const fetchUrl = baseUrl ? transformUrl(baseUrl, value) : value;
      //   consoleLog('dynamic script', fetchUrl);
      //   node.scriptLoad = true;
      //   sandbox.loader
      //     .load<JavaScriptManager>(namespace, fetchUrl)
      //     .then(({ resourceManager: { url, scriptCode } }) => {
      //       // if(this.src)
      //       that.dispatchEvent('load');
      //       sandbox.execScript(scriptCode, {}, url, { noEntry: true });
      //     })
      //     .catch((e) => {
      //       __DEV__ && warn(e);
      //       that.dispatchEvent('error');
      //     });
      // }
    },
    enumerable: false,
  });
}

// bind navigation event
function bindNavEvent(target: any) {
  const _this = target;

  // ensure bind once
  if (_this._hasBindNavEvent) {
    return;
  }
  _this._hasBindNavEvent = true;

  // add listeners to navigation
  if (!_this._listeners) {
    _this._listeners = [];
  }
  const routeSandbox = rawWindow.__mona_easy_box.global._routeSandbox;
  _this._listeners.unshift(function (e: Event) {
    e.preventDefault();
    if (routeSandbox) {
      const href = _this.href;
      if (href) {
        routeSandbox.history.openPage(href, true);
      }
    } else {
      console.error('非有效的a标签');
    }
  });
  if (!_this._hasBind) {
    _this._hasBind = true;
    rawAddEventListener.call(_this, 'click', function (e: Event) {
      _this.clickEventProxy(e);
    });
  }
}

function proxyElement(sandbox: Sandbox) {
  if (alreadyProxied) {
    return;
  }
  alreadyProxied = true;

  Element.prototype.clickEventProxy = function (e: Event) {
    const funcs = this._listeners || [];
    funcs.forEach((func: Function) => {
      func.call(this, e);
    });
  };

  // react router will add
  Element.prototype.setAttribute = function () {
    const [key] = [...arguments];
    if (this.tagName === 'A' && key === 'href') {
      bindNavEvent(this);
    }

    return rawSetAttribute.apply(this, arguments);
  };

  Element.prototype.addEventListener = function (type: string, callback: Function) {
    if (this.tagName === 'A' && type === 'click') {
      const _this = this;
      if (!this._listeners) {
        this._listeners = [];
      }
      this._listeners.push(callback);
      if (!this._hasBind) {
        this._hasBind = true;
        rawAddEventListener.call(this, 'click', function (e: Event) {
          _this.clickEventProxy(e);
        });
      }
    } else {
      rawAddEventListener.call(this, type, callback);
    }
  };
  Element.prototype.removeEventListener = function (type: string, callback: Function) {
    if (this.tagName === 'A' && type === 'click') {
      const listeners = [].concat([], this._listeners);
      const targetIndex = listeners.findIndex(listener => listener === callback);
      listeners.splice(targetIndex, 1);
      this._listeners = listeners;
    } else {
      rawRemoveEventListener.call(this, type, callback);
    }
  };

  Element.prototype.appendChild = function (node: HTMLScriptElement) {
    if (node.tagName === 'SCRIPT') {
      if (node.src) {
        const SRC = node.src;
        importEntry(
          {
            scripts: [node.src],
          },
          { getPublicPath: () => `${new URL(SRC).origin}/` },
        )
          // @ts-ignore
          .then(({ execScripts }) => {
            console.log({ execScripts });
            // exec script
            return execScripts(sandbox.global, false);
          })
          .then(() => {
            dispatchEvent(node, 'load');
          })
          .catch(() => {
            dispatchEvent(node, 'error');
          });
      }
      ProxyScriptNode(sandbox, node);
    }

    return rawAppendChild.call(this, node);
  };
}

const element = (sandbox: Sandbox) => {
  // proxy element only once
  proxyElement(sandbox);

  const { MutationObserver } = window;
  const observer = new MutationObserver(mutations => {
    const linkNodes: HTMLAnchorElement[] = [];
    const iframeNodes: HTMLIFrameElement[] = [];
    mutations.forEach(({ type, target, attributeName, addedNodes }) => {
      // collect all target element
      if (type === 'childList' && addedNodes.length > 0) {
        addedNodes.forEach(node => {
          const tagName = (node as Element).tagName;
          if (tagName === 'A') {
            linkNodes.push(node as HTMLAnchorElement);
          } else if (tagName === 'IFRAME') {
            iframeNodes.push(node as HTMLIFrameElement);
          } else if ((node as Element).getElementsByTagName) {
            const cn1 = (node as Element).getElementsByTagName('a');
            const cn2 = (node as Element).getElementsByTagName('iframe');
            linkNodes.push(...[].slice.call(cn1));
            iframeNodes.push(...[].slice.call(cn2));
          }
        });
      } else if (type === 'attributes' && attributeName === 'href' && (target as HTMLAnchorElement).tagName === 'A') {
        linkNodes.push(target as HTMLAnchorElement);
      }

      // handle link element
      linkNodes.forEach(linkNode => {
        bindNavEvent(linkNode);
      });

      // handle all iframe element
      iframeNodes.forEach(iframeNode => {
        // remove the element
        iframeNode.remove();
      });
    });
  });

  // const root = options.domGetter || document.documentElement;
  const root = document.documentElement;

  observer.observe(root, { attributes: true, subtree: true, childList: true });
  sandbox.destroyCbs.push(() => {
    observer.disconnect();
  });
  return {};
};

export default element;
