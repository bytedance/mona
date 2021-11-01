# mona-cli
## 介绍
mona-cli是电商商家应用的CLI工具，主要为了能够提升商家应用在各端开发和运行效率，统一开放方案，从而保证安全开放。
## 快速开始
### 安装CLI
快速开始开发一个插件需要先安装该CLI工具，使用如下命令进行安装
```bash
npm install -g @bytedance/mona-cli
// 或使用yarn安装，任选其一
yarn global add @bytedance/mona-cli
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
注意：模板目前仅支持Plugin

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

## 配置
### 项目配置
项目配置文件为项目根目录下的`mona.config.js`，配置文件内容如下：
```js
// mona.config.ts
import { createProjectConfig } from '@bytedance/mona';
export default createProjectConfig({
  projectName: 'demo',
  input: './src/app.tsx',
  output: 'dist'
})
```
|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| projectName  | 应用/插件名称 | 是 | string | - |
| input  | 入口文件路径 | 是 | string | - |
| output  | 打包后的文件目录路径 | 否 | string | - |

### 应用配置
应用配置文件为项目根目录下的`app.config.js`，配置文件内容如下：
```js
// app.config.ts
import { createAppConfig } from '@bytedance/mona';
export default createAppConfig({
  pages: [
    'pages/Home/index',
    'pages/Info/index',
    'pages/List/index'
  ]
})
```
|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| pages  | 页面路径 | 是 | string[] | - |
### 页面配置
页面配置文件为每个页面目录下的`page.config.js`，配置文件内容如下：
```js
// page.config.ts
import { createPageConfig } from '@bytedance/mona';
export default createPageConfig({
  navigationBarTitleText: 'page title'
})
```

|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| navigationBarTitleText  | 当前页面标题 | 否 | string | - |

## 命令
可以使用`mona -h`查看帮助命令，`mona -v`查看当前版本

### mona init
初始化一个商家应用/商家应用插件项目

### mona start
启动开发模式服务器

### mona build
对项目进行打包

### mona update
更新CLI命令
