/**
 * easybox is a light sandbox for webapp
 * author: xwchris
 */
import importHTML from './import-html-entry';
import Sandbox from './sandbox';
import { writeTemplate } from './utils'

export interface Navigation {
  allowDomains?: string[];
}

export interface NetWork {
  blockDomains?: string[];
  allowDomains?: string[];
  canAccessOriginDomain?: boolean;
  canAccessHttp?: false;
}
export interface EasyboxOptions {
  scope: string;
  entryPath?: string;
  navigation?: Navigation;
  network?: NetWork;
}

type Options = Required<EasyboxOptions>;

const defaultOptions: Options = {
  scope: '',
  entryPath: '/',
  navigation: {},
  network: {},
};

class Easybox {
  entry: string;
  options: Options;

  constructor(entry: string, options?: EasyboxOptions) {
    this.entry = entry;
    this.options = Object.assign({}, options, defaultOptions);
  }

  async run() {
    // parse entry
    const { execScripts, template, assetPublicPath } = await importHTML(this.entry, {
      // PERF: handle publicPath
      getPublicPath: (entry: string) => `${new URL(entry).origin}/`,
    });
    // create sandbox
    const sandbox = new Sandbox(this.options);
    window.__mona_easy_box = sandbox;
    const global = sandbox.global;

    // handle publicPath
    window.__mona_public_path__ = assetPublicPath;

    // write template
    writeTemplate(template);
    // document.write(template);

    // exec script
    await execScripts(global, false);
  }
}

export default Easybox;
