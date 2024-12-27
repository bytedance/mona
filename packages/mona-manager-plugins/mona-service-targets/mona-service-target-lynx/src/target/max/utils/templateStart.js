const fs = require('fs');
const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const getTmpData = require('./getTmpData.js');
const getTmpComponentData = require('./getTmpComponentData.js');

const WS_PORT = 10090;
const CATE_TARGET_URL = `https://fxg.jinritemai.com/ffa/shop-editor/designable?debug=1&WSPORT=${WS_PORT}&type=1`;
const TARGET_URL = `https://fxg.jinritemai.com/ffa/shop-editor/designable?debug=1&WSPORT=${WS_PORT}&type=1`;

const MESSAGE_TYPE = {
  updateComponentInfo: {
    name: 'UPDATE_COMPONENT_INFO',
  },
  exchangeSchemaJSON: {
    name: 'EXCHANGE_SCHEMA_JSON',
  },
  exchangePreviewJson: {
    name: 'EXCHANGE_PREVIEW_JSON',
  },
  exchangeCategoryJSON: {
    name: 'EXCHANGE_CATEGORY_JSON',
  },
};

const isJSON = v => {
  try {
    JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
};

let wsForWatch;
function templateStart(debugPage, sendData) {
  try {
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: WS_PORT });
    console.log(`ws链接已建立!打开${TARGET_URL}，请在装修页面编排组件`);
    if (debugPage === 'category') {
      openBrowser(CATE_TARGET_URL)
    } else {
      openBrowser(TARGET_URL);
    }
    wss.on('connection', ws => {
      wsForWatch = ws;
      const SEND_DATA = sendData;
      wsForWatch.send(JSON.stringify({ data: SEND_DATA, type: MESSAGE_TYPE.updateComponentInfo.name }));

      ws.on('message', message => {
        console.log(`ws received message => ${message}`);
        const { type, data } = isJSON(message) ? JSON.parse(message) : {};

         if (type === MESSAGE_TYPE.updateComponentInfo.name) {
          const nextData = { ...SEND_DATA, id: (Math.random() * 1000).toString() };
          const nextMessage = JSON.stringify({ data: nextData, type: MESSAGE_TYPE.updateComponentInfo.name });
          console.log('ws send message', nextMessage);
          wsForWatch.send(nextMessage);
          return;
        }

        if (type === MESSAGE_TYPE.exchangeSchemaJSON.name) {
          const schemaJsonFilePath = path.resolve(process.cwd(), './schema.json');
          const componentsJsonFilePath = path.resolve(process.cwd(), './components.json');
          // 如果有data，说明是来写入data的
          if (data) {
            fs.writeFileSync(schemaJsonFilePath, getTmpData(data));
            fs.writeFileSync(componentsJsonFilePath, getTmpComponentData(data));
          }
        }

        if (type === MESSAGE_TYPE.exchangeCategoryJSON.name) {
          const categoryJsonFilePath = path.resolve(process.cwd(), './src/category.json');

          if (data) {
            fs.writeFileSync(categoryJsonFilePath, data);
          }
        }

        if (type === MESSAGE_TYPE.exchangePreviewJson.name) {
          const previewJsonFilePath = path.resolve(process.cwd(), './preview.json');
          if (data) {
            fs.writeFileSync(previewJsonFilePath, data);
          }
        }
      });
    });
  } catch (e) {
    console.error('创建websocket调试失败:', e);
  }
}


module.exports = {
  templateStart
};
