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
}

export const genPluginHtml = (buildId: string) => {
  return `
  <!-- ${HTML_HANDLE_TAG} -->
  <!DOCTYPE html>
  <html id="${buildId}">
    <head>
      <meta charset="utf-8">
      <title>Mona Plugin</title>
      <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"></head>
      <script></script>
    <body>
      <div id="root" style="height: 100%"></div>
    </body>
  </html>
  `;
};

export const WEB_HTML = `
<!-- ${HTML_HANDLE_TAG} -->
<!DOCTYPE html>
<html style="font-size: 10vw">
  <head>
    <meta charset="utf-8">
    <title>Mona Web</title>
    <meta name="viewport" content="width=device-width,initial-scale=1,maximum-scale=1,minimum-scale=1,user-scalable=no,viewport-fit=cover"></head>
  <body style="padding: 0; margin: 0;">
    <div id="root"></div>
  </body>
</html>
`;
