# mona-cli
## 介绍
mona-cli是电商商家应用的CLI工具，主要为了能够提升商家应用在各端运行效率，对齐开发规范，统一开放方案，保证开放安全。
## 快速开始
### 安装CLI
快速开始开发一个插件需要先安装该CLI工具，使用如下命令进行安装
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
默认配置文件为项目根目录下的`mona.config.js`，配置文件内容如下：
```js
import { createProjectConfig } from '@ecom/mona'

export default createProjectConfig({
  projectName: 'test1',
  input: './src/app.tsx',
  output: 'dist'
})
```

### projectName
即应用名称或插件名称

### input
入口文件
### output
项目输出文件夹

### abilities
配置是否开启ts和less
```js
{
  ts: true,
  less: true,
}
```

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
