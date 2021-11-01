# mona-cli
## 介绍
mona-cli是电商商家应用的CLI工具，主要为了能够提升商家应用在各端运行效率，对齐开发规范，统一开放方案，保证开放安全。
## 快速开始
### 安装CLI
快速开始开发一个商家应用/商家应用插件需要先安装该CLI工具，使用如下命令进行安装
```bash
npm install -g @ecom/mona-cli
// 或使用yarn安装，任选其一
yarn global add @ecom/mona-cli
```

安装完成后，控制台输入
```bash
mona -v
```
能正确打印出版本，则表明安装成功

### 初始化项目
下面我们来初始化一个项目，使用如下命令
```bash
mona init
```

按照提示依次输入项目名称，选择模板，选择是否使用typescript和样式预处理器
注意：模板目前仅支持PC和Plugin（pc适用于web应用和桌面端应用的开发）

### 开发
项目初始化完成后可以进行开发，使用如下命令启动开发服务器，可以实时调试
```bash
mona start
```

### 打包
开发完成后，对项目进行打包，可以使用如下命令
```
mona build
```

### 发布
web发布按照旧有流程发布
桌面端发布需要通过gecko进行发布
插件发布需要通过mona publish命令进行发布

## 配置
默认配置文件为项目根目录下的`mona.config.js`，配置文件内容如下：
```js
import { createMonaConfig } from '@ecom/mona-webpack'

// 修改CDN
const CDN = '/';

export default createMonaConfig({
  projectTarget: ['web'],
  projectName: 'mona-demo',
  input: './src/app',
  dest: 'build',
  output: {
    publicPath() {
      return process.env.NODE_ENV === 'production' ? `${CDN}` : '/';
    },
  },
  abilities: {
    react: {
      hot: true,
    },
    ts: true,
    less: true,
  },
  raw(options) {
    return options;
  },
  dev: {
    devServer: {
      historyApiFallback: true,
    },
  },
});
```

该配置与是Eden配置文件的扩展，增加了`projectTarget`和`projectName`两个字段。
### projectTarget
指定打包端，有效值如下：`desktop/web/miniapp/plugin`。可以接受一个字符串或者字符串数组作为值。非有效值直接忽略。
  - 模板`pc`默认值：`['web','desktop']`
  - 模板`mobile`默认值：`['miniapp']`
  - 模板`plugin`默认值：`['plugin']`
  - 模板`monorepo`：各个仓库值如上所示

### projectName
即应用名称或插件名称，如果选择了monorepo则各项目的命名如下，一期先不做
  - pc：[name]-pc
  - mobile: [name]-mobile
  - plugin: [name]-plugin

## 命令
可以使用`mona -h`查看帮助命令，`mona -v`查看当前版本

### mona init
初始化一个商家应用/商家应用插件项目

### mona start
启动开发模式服务器

### mona build
对项目进行打包

### mona lint
对项目进行代码格式化

### mona proxy
打开代理服务器

### mona publish
发布插件

### mona update
更新CLI命令
