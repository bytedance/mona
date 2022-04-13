// bind event to element a to handle link navigate
// ban tag iframe

import Sandbox from '@/sandbox';

const Element = window.Element as any;
const rawSetAttribute = Element.prototype.setAttribute;
const rawAddEventListener = Element.prototype.addEventListener;
const rawRemoveEventListener = Element.prototype.removeEventListener;
const rawWindow = window;
let alreadyProxied = false;

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

function proxyElement() {
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
}

const element = (sandbox: Sandbox) => {
  // proxy element only once
  proxyElement();

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
