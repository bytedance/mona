const fs = require('fs');
const path = require('path');
const openBrowser = require('react-dev-utils/openBrowser');
const getTmpData = require('./getTmpData.js');
const getTmpComponentData = require('./getTmpComponentData.js');

const WS_PORT = 10090;

function genUrl(pageType) {
  return `https://fxg.jinritemai.com/ffa/shop-editor/designable?debug=1&WSPORT=${WS_PORT}&type=1&page_type=${pageType}`; 
}

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

function safeReadJsonFile(filePath) {
    try {
      if (fs.existsSync(filePath)) {
        const data = fs.readFileSync(filePath, 'utf8');
        // 将JSON字符串解析为JavaScript对象
        const jsonData = JSON.parse(data);
        return JSON.stringify(jsonData);
      }
      return ''
    } catch (error) {
        console.error('在读取 ' + filePath + ' 并作为json数据转换时出现错误:', error);
        return '';
    }
}

let wsForWatch;
function templateStart(debugPage, sendData) {
  try {
    const WebSocket = require('ws');
    const wss = new WebSocket.Server({ port: WS_PORT });
    const targetUrl = genUrl(debugPage);
    console.log(`ws链接已建立!打开 ${targetUrl} 请在装修页面编排组件`)
    openBrowser(genUrl(debugPage));
    wss.on('connection', ws => {
      wsForWatch = ws;
      const SEND_DATA = sendData;

      const schemaJsonFilePath = path.resolve(process.cwd(), './schema.json');
      const categoryJsonFilePath = path.resolve(process.cwd(), './category.json');
      const previewJsonFilePath = path.resolve(process.cwd(), './preview.json');
      
      wsForWatch.send(JSON.stringify({ data: {
        ...SEND_DATA,
        categoryJson: safeReadJsonFile(categoryJsonFilePath),
        previewJson: safeReadJsonFile(previewJsonFilePath),
        schemaJson: safeReadJsonFile(schemaJsonFilePath),
      }, type: MESSAGE_TYPE.updateComponentInfo.name }));

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
          
          const componentsJsonFilePath = path.resolve(process.cwd(), './components.json');
          // 如果有data，说明是来写入data的
          if (data) {
            fs.writeFileSync(schemaJsonFilePath, getTmpData(data));
            fs.writeFileSync(componentsJsonFilePath, getTmpComponentData(data));
          }
        }

        if (type === MESSAGE_TYPE.exchangeCategoryJSON.name) {

          if (data) {
            fs.writeFileSync(categoryJsonFilePath, data);
          }
        }

        if (type === MESSAGE_TYPE.exchangePreviewJson.name) {
         
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
