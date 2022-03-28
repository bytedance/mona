import { HTML_HANDLE_TAG } from '../constants';

export const TARGET = 'plugin';

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
