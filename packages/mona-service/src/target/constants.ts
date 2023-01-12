export const DEFAULT_PORT = '9999';
export const DEFAULT_HOST = 'localhost';
export const HTML_HANDLE_TAG = 'createdByMonaCli';
export const DEFAULT_APPID = 'testAppId';

export const NPM_DIR = 'npm/';
export const NODE_MODULES = 'node_modules';

export enum Platform {
  LIGHT = 'light',
  PLUGIN = 'plugin',
  WEB = 'web',
  MINI = 'mini',
  H5 = 'h5',
  MAX = 'max',
  MAX_TEMPLATE = 'max-template',
}

export const genH5Html = (_buildId: string, injectScript: string = '') => {
  return `
  <!DOCTYPE html>
  <html lang="zh-cn" style="font-size: 10vw">
  <head>
      <meta charset="utf-8">
      <title></title>
      <meta name="screen-orientation" content="portrait">
      <meta name="x5-orientation" content="portrait">
      <meta name="format-detection" content="telephone=no">
      <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no, minimum-scale=1, maximum-scale=1, minimal-ui, viewport-fit=cover">
      <meta name="apple-mobile-web-app-capable" content="yes">
      ${injectScript}
  </head>
  <body>
      <div id="root"></div>
  </body>
  </html>
  `;
};

export const SAFE_SDK_SCRIPT = '<script src="https://lf3-open-web-sdk.bytetos.com/obj/open/sdk_v2.js"></script>';
export const genPluginHtml = (buildId: string, injectScript: string = '') => {
  return `
  <!-- ${HTML_HANDLE_TAG} -->
  <!DOCTYPE html>
  <html id="${buildId}">
    <head>
      <meta charset="utf-8">
      <title>Mona Plugin</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"></head>
      ${injectScript}
      <script></script>
    <body>
      <div id="root" style="height: 100%"></div>
    </body>
  </html>
  `;
};

export const genWebHtml = (_buildId: string, injectScript: string = '') => {
  return `
  <!-- ${HTML_HANDLE_TAG} -->
  <!DOCTYPE html>
  <html style="font-size: 10vw">
    <head>
      <meta charset="utf-8">
      <title>Mona Web</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover">
      ${injectScript}
    </head>
    <body style="padding: 0; margin: 0;">
      <div id="root"></div>
    </body>
  </html>
  `;
};
