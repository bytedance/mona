/**
 * easybox is a light sandbox for webapp
 * author: xwchris
 */
import importHTML from './import-html-entry';
import Sandbox from './sandbox';
// import { writeTemplate } from './utils';

export interface Navigation {
  allowDomains?: string[];
}

export interface NetWork {
  blockDomains?: string[];
  allowDomains?: string[];
  canAccessOriginDomain?: boolean;
  canAccessHttp?: boolean;
}
export interface EasyboxOptions {
  scope: string;
  domGetter: HTMLElement | null;
  entryPath?: string;
  navigation?: Navigation;
  network?: NetWork;
  // 覆盖子应用拿到的window
  global?: Record<string, any> | ((sandbox: Sandbox) => void);
}

type Options = Required<EasyboxOptions>;

const defaultOptions: Options = {
  scope: '',
  entryPath: '/',
  navigation: {},
  network: {},

  domGetter: document.documentElement,
  global: {},
};

export interface Provider {
  destroy: ({ dom: HTMLElement }: { dom: any }) => void;
  render: ({ dom: HTMLElement }: { dom: any }) => void;
}

class Easybox {
  entry: string;
  options: Options;
  private _sandbox?: Sandbox;
  private _provider?: Provider;
  constructor(entry: string, options?: EasyboxOptions) {
    this.entry = entry;
    this.options = { ...defaultOptions, ...(options || {}) };
  }

  async run() {
    // parse entry
    const { execScripts, assetPublicPath } = await importHTML(this.entry, {
      // PERF: handle publicPath
      getPublicPath: (entry: string) => `${new URL(entry).origin}/`,
    });
    // create sandbox
    const sandbox = new Sandbox(this.options);
    this._sandbox = sandbox;
    window.__mona_easy_box = sandbox;
    const global = sandbox.global;

    // handle publicPath
    window.__mona_public_path__ = assetPublicPath;

    // write template
    // writeTemplate(template, this.options.domGetter || document.documentElement);
    // document.write(template);

    // exec script
    await execScripts(global, false);

    //@ts-ignore
    this._provider = global?.exports?.provider() as Provider;
    this.render();
  }

  render() {
    if (this._provider) {
      // createBody
      // const fakeBody = global?.document.createElement('div');
      // fakeBody.setAttribute('__mockbody__', '');
      // this._sandbox?.options.domGetter?.appendChild(fakeBody);
      this._provider?.render({ dom: this._sandbox?.global?.document?.body });
    } else {
      console.error('provider 未设置');
    }
  }

  uninstall() {
    if (this._provider) {
      this._sandbox?.destroyCbs.forEach(cb => cb());
      this._provider?.destroy({ dom: this._sandbox?.global?.document?.body });
    } else {
      console.error('provider 未设置');
    }
  }
}

export default Easybox;
