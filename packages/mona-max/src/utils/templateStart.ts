// @ts-nocheck
import fs from 'fs';
import path from 'path';
import { finalData as getTmpData } from './getTmpData';
import { getTmpComponentData } from './getTmpComponentData';
import WebSocket from 'ws';

const WS_PORT = 10090;
const TARGET_URL = `https://fxg.jinritemai.com/ffa/mshop/decorate/isv/entry?debug=1&WSPORT=${WS_PORT}`;

const MESSAGE_TYPE = {
  exchangeSchemaJSON: {
    name: 'EXCHANGE_SCHEMA_JSON',
  },
  exchangePreviewJson: {
    name: 'EXCHANGE_PREVIEW_JSON',
  },
};

const isJSON = (v: any) => {
  try {
    JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
};

let wsForWatch: WebSocket.WebSocket;
try {
  const wss = new WebSocket.Server({ port: WS_PORT });
  wss.on('connection', ws => {
    wsForWatch = ws;
    ws.on('message', message => {
      console.log(`ws received message => ${message}`);
      const { type, data } = isJSON(message) ? JSON.parse(message as unknown as string) : {};
      if (type === MESSAGE_TYPE.exchangeSchemaJSON.name) {
        const schemaJsonFilePath = path.resolve(process.cwd(), './schema.json');
        const componentsJsonFilePath = path.resolve(process.cwd(), './components.json');
        // 如果有data，说明是来写入data的
        if (data) {
          fs.writeFileSync(schemaJsonFilePath, getTmpData(data));
          fs.writeFileSync(componentsJsonFilePath, getTmpComponentData(data));
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

export { WS_PORT, TARGET_URL };
