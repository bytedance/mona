const fs = require('fs');
const path = require('path');

const DEV_SERVER_PORT = 10089;
const WS_PORT = 10079;
const TARGET_URL = `https://fxg.jinritemai.com/ffa/mshop/decorate/newIsv/edit?debug=1&id=7018570872021582093&pageId=2&WSPORT=${WS_PORT}`;

const SEND_DATA = {
	indexURL: `https://localhost:${DEV_SERVER_PORT}/index.umd.js`,
	settingURL: `https://localhost:${DEV_SERVER_PORT}/schema.json`,
	decp: '本地测试组件',
	name: 'LocalDebugComponent',
	type: 'LocalDebugComponent',
	group: '本地测试',
	data: {value: {}},
	isDebug: true
}

const MESSAGE_TYPE = {
	updateComponentInfo: {
		name: "UPDATE_COMPONENT_INFO",
	},
	exchangeSchemaJSON: {
		name: 'EXCHANGE_SCHEMA_JSON'
	}
}

const isJSON = v => {
	try {
		JSON.parse(v);
		return true;
	} catch (e) {
		return false;
	}

	return false;
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
			if (type === MESSAGE_TYPE.updateComponentInfo.name) {
				const nextData = {...SEND_DATA, id: (Math.random() * 1000).toString()};
				const nextMessage = JSON.stringify({data: nextData, type: MESSAGE_TYPE.updateComponentInfo.name});
				console.log('ws send message', nextMessage);
				wsForWatch.send(nextMessage);
				return;
			}

			if (type === MESSAGE_TYPE.exchangeSchemaJSON.name) {
				const schemaJsonFilePath = path.resolve(process.cwd(), './src/schema.json');
				const isSchemaJsonExist = fs.existsSync(schemaJsonFilePath);
				if (!isSchemaJsonExist) {
					console.error('schemaJson文件不存在');
					return;
				}

				// 如果没有data，说明是来获取schema.json的
				if (!data) {
					const jsonData = fs.readFileSync(schemaJsonFilePath, 'utf-8');
					wsForWatch.send(JSON.stringify({data: jsonData, type: MESSAGE_TYPE.exchangeSchemaJSON.name}));
					return;
				}
				// 如果有data，说明是来写入data的
				if (data) {
					fs.writeFileSync(schemaJsonFilePath, data ? JSON.stringify(data) : '{}');
				}

			}
		});
	});
} catch (e) {
	console.error('创建websocket调试失败:', e);
}

// send debug component info after emit
class AfterBuildPlugin {
	apply(compiler) {
		compiler.hooks.afterEmit.tap('AfterBuild', () => {
			if (wsForWatch) {
				// random id used to refresh editor
				const nextData = {...SEND_DATA, id: (Math.random() * 1000).toString()};
				console.log('ws send message', nextData);
				wsForWatch.send(JSON.stringify({data: nextData, type: MESSAGE_TYPE.updateComponentInfo.name}));
			}
		})
	}
}

module.exports = {
	DEV_SERVER_PORT,
	WS_PORT,
	AfterBuildPlugin,
	TARGET_URL
}