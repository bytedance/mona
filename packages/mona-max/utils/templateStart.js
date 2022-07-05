const fs = require('fs');
const path = require('path');
const getTmpData = require('./getTmpData.js');
const getTmpComponentData = require('./getTmpComponentData.js');

const WS_PORT = 10090;
const TARGET_URL = `https://fxg.jinritemai.com/ffa/mshop/decorate/isv/entry?debug=1&WSPORT=${WS_PORT}`;

const MESSAGE_TYPE = {
  exchangeSchemaJSON: {
    name: 'EXCHANGE_SCHEMA_JSON'
  },
}

const isJSON = v => {
  try {
    JSON.parse(v);
    return true;
  } catch (e) {
    return false;
  }
};


let wsForWatch;
try {
  const WebSocket = require('ws');
  const wss = new WebSocket.Server({port: WS_PORT});
  wss.on('connection', ws => {
    wsForWatch = ws;
    ws.on('message', message => {
      console.log(`ws received message => ${message}`);
      const {type, data} = isJSON(message) ? JSON.parse(message) : {};
      if (type === MESSAGE_TYPE.exchangeSchemaJSON.name) {
        const schemaJsonFilePath = path.resolve(process.cwd(), './schema.json');
        const componentsJsonFilePath = path.resolve(process.cwd(), './components.json');
        // 如果有data，说明是来写入data的
        if (data) {
          fs.writeFileSync(schemaJsonFilePath, getTmpData(data));
          fs.writeFileSync(componentsJsonFilePath, getTmpComponentData(data));
        }

      }
    });
  });
} catch (e) {
  console.error('创建websocket调试失败:', e);
}


module.exports = {
  WS_PORT,
  TARGET_URL
}
