# mona

## 目录

- [简介](https://github.com/bytedance/mona#简介)
- [安装](https://github.com/bytedance/mona#安装)
- [创建一个项目](https://github.com/bytedance/mona#创建一个项目)
- [发布上传项目](https://github.com/bytedance/mona#发布上传项目)
- [CLI 命令](https://github.com/bytedance/mona#CLI命令)
- [API](https://github.com/bytedance/mona#API)
- [组件](https://github.com/bytedance/mona#组件)
- [配置](https://github.com/bytedance/mona#配置)
- [目录结构](https://github.com/bytedance/mona#目录结构)
- [多端开发](https://github.com/bytedance/mona#多端开发)
- [public 目录](https://github.com/bytedance/mona#public目录)
- [query 参数获取](https://github.com/bytedance/mona#query参数获取)
- [移动端适配](https://github.com/bytedance/mona#移动端适配)
- [使用小程序原生模块](https://github.com/bytedance/mona#使用小程序原生模块)
- [常见问题](https://github.com/bytedance/mona#常见问题)
- [原理](https://github.com/bytedance/mona#原理)
- [特性](https://github.com/bytedance/mona#特性)
- [飞鸽插件开发须知](https://github.com/bytedance/mona#飞鸽插件开发须知)

## 简介

mona 是抖店开放平台推出的商家应用跨端开发方案，支持使用**React 框架**来开发应用，以求达到一次开发处处运行

- 飞鸽插件
- 店铺装修组件
- 移动端 h5 应用
- 字节小程序应用

同时后续会逐渐增加商家应用业务基础组件库，方便开发者更加高效的进行开发，方案尚处在逐渐完善的阶段，有问题欢迎在 issue 中指出，感谢您的支持~~

## 安装

> **Node 版本要求**
>
> Mona CLI 0.2.x 需要[Node.js](https://nodejs.org/en/) v14.x 或更高版本。你可以使用[n](https://github.com/tj/n)，[nvm](https://github.com/nvm-sh/nvm)，[nvm-windows](https://github.com/coreybutler/nvm-windows)在一台电脑中管理 Node 多个版本
> 可以使用如下任意命令来安装 Mona CLI

```bash
npm install -g @bytedance/mona-cli
# 或
yarn global add @bytedance/mona-cli
```

安装完成后，在控制台输入

```bash
mona -v
```

来验证是否安装成功，如果正确打印出版本，则表明安装成功

### 升级

如果需要升级全局的 Mona CLI，可以运行

```bash
npm update -g @bytedance/mona-cli
# 或
yarn global upgrade --latest @bytedance/mona-cli
# 或
mona update
```

## 创建一个项目

下面我们在本地创建一个项目，使用如下命令

```bash
mona init
```

按照提示依次输入项目名称，选择模板，选择是否使用 typescript 和样式预处理器等按需使用
**店铺装修模块需要传入 appid，请在抖店开放平台，创建店铺装修应用后，在应用概览-证书信息中查看 App Key，作为 appid 传入**

### 开发

项目初始化完成后进入项目跟目录，使用如下命令启动开发服务器，可以实时调试

```bash
npm run start
```

### 打包

开发完成后，对项目进行打包，可以使用如下命令

```
npm run build
```

## 发布上传项目

目前仅支持飞鸽插件、店铺装修模块项目的发布上传
项目开发完成后，需要在抖店开放平台进行发布

### 在开放平台手动上传

在项目跟目录运行以下命令

```
npm run compress
```

来进行项目的压缩，压缩完成后，到开放平台上传压缩包

### 通过 CLI 上传（目前仅支持店铺模块）

通过 CLI 上传需要先使用`mona login`登录当前开放平台账号，然后运行

```
npm run upload
```

来上传新版本到开放平台

**IMPORTANT: 请注意，请保证 appid 是正确的！**

## CLI 命令

`mona`采用命令分离的模式，CLI 命令共分为两类，一类是全局命令，一类是与项目相关的命令。

全局命令封装在`@bytedance/mona-cli`中，需要全局安装，通过`mona xxxx`进行调用

与项目相关的命令封装在`@bytedance/mona-service`中，该包随项目进行安装，需要在项目中通过`mona-service xxxx`进行调用。

### 全局命令

可以使用`mona -h`查看帮助命令，`mona -v`查看当前版本

#### mona init <projectName>

初始化一个商家应用/商家应用插件项目

- -h, --help：输出帮助信息
- -u, --use-typescript：是否使用 typescript
- -s, --style：指定样式处理器(css/less)
- -t, --template：指定模板(plugin)

#### mona login

登录抖店开放平台

** 如果上传代码的时候提示账号不正确，但确实已经登录了当前账号，可以尝试重新`mona logout`后，再重新`mona login`来登录，本地登录态有时会存在过期情况，目前还没有有效手段感知过期状态 **

#### mona logout

登出抖店开放平台

#### mona update

更新@bytedance/mona-cli 到最新版本

### 项目命令

可以使用`mona-service -h`查看帮助命令，`mona-service -v`查看当前版本

#### mona-service build & mona-service start

`build`命令对项目进行打包，需要通过`-t, --target`指定要打包的端，目前支持端的有

- plugin（飞鸽桌面端插件）
- max（店铺装修组件）
- max-tempalte（店铺装修模板）
- web（h5 应用）
- mini（小程序）

`start`命令会启动一个本地服务，用法同`build`

#### mona-service compress

压缩文件，对项目文件进行压缩。在开放平台手动上传代码包时，需要将代码打包成 zip 包进行上传

可以通过`-r, --use-root`来制定是打包源码，还是打包产物目录，指定该项则会打包源码。如果是打包产物目录，则不需要该选项。

目前在开放平台中，飞鸽插件需要上传产物目录，装修组件和模板需要上传源码包。后续会统一成源码包。

#### mona-service publish

上传代码到开放平台，目前仅支持店铺装修模块的上传。使用该命令需要前置使用`mona login`来登录开放平台。

上传时会自动调用`mona-service compress`并上传代码到相应应用。

#### mona-service preview

在本地进行代码预览，目前仅支持店铺装修模块。使用时需传入`--target,-t`

```bash
// 店铺装修组件预览
mona-service preview -t max

// 店铺装修模板预览
mona-service preview -t max-template
```

**<-----------------------------分割线，以下内容目前不支持店铺模块-------------------------------->**

## API

api 可以从`@bytedance/mona-runtime`中导入，如

```js
import { redirectTo } from '@bytedance/mona-runtime';
```

- 基础 api 见-[小程序 api](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/api/foundation/tt-can-i-use)
- 插件额外 api 见-[mona-runtime 文档](https://github.com/bytedance/mona/tree/main/packages/mona-runtime)

## 组件

如果你只是 web 项目，你完全可以使用在 web 中的开发方式，引入 antd 等三方库。

组件可以从`@bytedance/mona-runtime`中导入，如

```js
import { View, Text } from '@bytedance/mona-runtime';
```

- 基础组件见-[小程序组件](https://microapp.bytedance.com/docs/zh-CN/mini-app/develop/component/all)
- 插件额外组件见-[mona-runtime 文档](https://github.com/bytedance/mona/tree/main/packages/mona-runtime)

## 目录结构

```bash
.
├── README.md
├── app.config.ts // 应用配置文件
├── mona.config.ts // 项目配置文件
├── package.json
├── src
│   ├── app.tsx
│   ├── common
│   ├── components
│   ├── pages
│   │   ├── Home
│   │   │   ├── index.module.less
│   │   │   ├── index.tsx
│   │   │   └── page.config.ts // 页面配置文件
│   └── typings
│       └── assetsDefinition.d.ts
└── tsconfig.json // ts配置文件
```

所有的页面文件应放在 pages 中，所有的组件文件应放在 components 中。

项目构建配置文件为`mona.config.ts`，可以在该文件中更改构建配置

应用配置文件为`app.config.ts`，可以在该文件中配置路由

页面配置文件分别放在页面文件下`page.config.ts`中，可以在这里配置页面相关的配置

## 配置

### 项目配置

项目配置文件为项目根目录下的`mona.config.js`，配置文件内容如下：

```js
// mona.config.ts
import { createProjectConfig } from '@bytedance/mona';
export default createProjectConfig({
  projectName: 'demo',
  input: './src/app.tsx',
});
```

| 参数                         | 说明                                                             | 是否必填                   | 类型                     | 默认值                            |
| ---------------------------- | ---------------------------------------------------------------- | -------------------------- | ------------------------ | --------------------------------- |
| projectName                  | 应用/插件名称                                                    | 是                         | string                   | -                                 |
| appId                        | 开放平台 app_key                                                 | 否（店铺装修场景中需必填） | string                   | -                                 |
| input                        | 入口文件路径                                                     | 否                         | string                   | -                                 |
| chain                        | 定义函数来修改 webpack 配置                                      | 否                         | (config: Config) => void | -                                 |
| dev                          | 用来修改本地服务配置                                             | 否                         | string                   | { port: 9999 }                    |
| enableMultiBuild             | 是否开启多端构建，开启后能够识别以端为后缀的文件，并自动引入     | 否                         | boolean                  | true                              |
| compilerOptimization         | 是否开启编译优化，开启后产物会自动删除不必要的模板和不必要的属性 | 否                         | boolean                  | true                              |
| transformSvgToComponentInWeb | 是否开启 svg 文件转 react 组件（仅在 web 中有效）                | 否                         | boolean                  | false                             |
| postcss                      | postcss 相关配置                                                 | 否                         | object                   | { pxtransform: { enable: true } } |

#### postcss.pxtransform

移动端适配内容见[这里](https://github.com/bytedance/mona/tree/feat/miniapp#%E7%A7%BB%E5%8A%A8%E7%AB%AF%E9%80%82%E9%85%8D)

postcss 目前支持 pxtransform 的配置，该插件主要用于移动端尺寸单位转换以帮助适配。`postcss.pxtransform`的配置如下

| 参数        | 说明           | 是否必填 | 类型    | 默认值                                   |
| ----------- | -------------- | -------- | ------- | ---------------------------------------- |
| enable      | 是否开启该插件 | 否       | boolean | true                                     |
| designWidth | 设计稿尺寸     | 否       | number  | 750                                      |
| deviceRatio | 设计稿换算规则 | 否       | object  | { 640: 2.34 / 2, 750: 1, 828: 1.81 / 2 } |
| config      | pxtorem 配置   | 否       | object  | 见下表                                   |

#### postcss.pxtransform.config

| 参数              | 说明                           | 是否必填 | 类型     | 默认值                      |
| ----------------- | ------------------------------ | -------- | -------- | --------------------------- |
| unitPrecision     | rem 小数位精度                 | 否       | number   | 5                           |
| propList          | 允许转换的属性                 | 否       | string[] | ['*']                       |
| selectorBlackList | 黑名单里的选择器将会被忽略     | 否       | (string  | RegExp)[]                   | [] |
| replace           | 直接替换而不是追加一条进行覆盖 | 否       | boolean  | true                        |
| mediaQuery        | 允许媒体查询里的 px 单位转换   | 否       | boolean  | false                       |
| minPixelValue     | 设置一个可被转换的最小 px 值   | 否       | number   | 0                           |
| exclude           | 指定的文件将忽略转换           | 否       | RegExp   | ((name: string) => boolean) | - |

### 应用配置

应用配置文件为项目根目录下的`app.config.js`，配置文件内容如下：

```js
// app.config.ts
import { createAppConfig } from '@bytedance/mona';
export default createAppConfig({
  pages: ['pages/Home/index', 'pages/Info/index', 'pages/List/index'],
});
```

#### 配置项说明

| 参数                           | 说明                     | 是否必填 | 类型     | 默认值 |
| ------------------------------ | ------------------------ | -------- | -------- | ------ |
| pages                          | 页面路径                 | 是       | string[] | -      |
| entryPagePath                  | 默认启动页面             | 否       | string   | -      |
| window                         | 配置默认页面的窗口表现   | 否       | object   | -      |
| tabBar                         | 配置底部 tab 表现        | 否       | object   | -      |
| navigateToMiniProgramAppIdList | 需要跳转的小程序列表     | 否       | array    | -      |
| permission                     | 需要部分授权弹窗的副标题 | 否       | object   | -      |
| networkTimeout                 | 网络超时时间             | 否       | object   | -      |

#### entryPagePath

指定默认启动路径（首页）。如果不填，将默认为 pages 列表的第一项。不支持带页面路径参数。

```json
{
  "entryPagePath": "pages/index/index"
}
```

#### pages

这个字段用于配置所有页面路径，配置每项是 路径 + 文件名 这个结构。配置项的第一个页面路径就是小程序启动展示的第一个页面。
如开发目录如下：

```bash
├── src
│   ├── pages
│   │   ├── Home
│   │   │   ├── index.module.less
│   │   │   ├── index.tsx
│   │   │   └── page.config.ts // 页面配置文件
```

那么 `pages` 应该这样配置：

```json
{
  "pages": ["pages/Home/index"]
}
```

#### window

这个字段用于设置顶部状态栏、导航条、标题、窗口背景色。
需要注意的是，这里的窗口是指由端上控制的页面，与开发者用代码绘制的页面不是同一个概念。因此对于 `backgroundColor` 这类配置项，与开发者在代码中编写的样式不会有优先级覆盖关系。

| 参数                         | 说明                                                                                                                                       | 是否必填 | 类型     | 默认值             |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | -------- | ------------------ |
| navigationBarBackgroundColor | 导航栏背景颜色，如"#000000"；不支持 alpha 值，如"#AABBCCDD"                                                                                | 否       | HexColor | #000000            |
| navigationBarTextStyle       | 导航栏标题颜色，仅支持 black/white，同时影响：标题颜色、右胶囊颜色、左返回箭头颜色                                                         | 否       | string   | white              |
| navigationBarTitleText       | 导航栏标题文字内容                                                                                                                         | 否       | string   | -                  |
| navigationStyle              | 导航栏样式，仅支持 default/custom。custom 模式可自定义导航栏，只保留右上角胶囊状的按钮，可以通过 navigationBarTextStyle 设置胶囊按钮的颜色 | 否       | string   | default            |
| backgroundColor              | 窗口背景色                                                                                                                                 | 否       | HexColor | #ffffff            |
| backgroundTextStyle          | 下拉 loading 的样式，仅支持 dark/light                                                                                                     | 否       | string   | dark               |
| backgroundColorTop           | 顶部窗口的背景色，仅小程序 iOS 支持                                                                                                        | 否       | HexColor | 同 backgroundColor |
| backgroundColorBottom        | 底部窗口的背景色，仅小程序 iOS 支持                                                                                                        | 否       | HexColor | 同 backgroundColor |
| enablePullDownRefresh        | 是否开启下拉刷新，详见页面相关事件处理函数                                                                                                 | 否       | boolean  | false              |
| onReachBottomDistance        | 页面上拉触底事件触发时距页面底部距离，单位为 px                                                                                            | 否       | number   | 50                 |
| transparentTitle             | 仅在 navigationStyle 为 default 时该字段生效，用来控制导航栏透明设置。默认 none，支持 always 一直透明 / auto 滑动自适应 / none 不透明      | string   | -        |

#### tabBar

如果你的小程序包含多个 tab（客户端窗口的底部或顶部有 tab 栏可以切换页面），可以通过 tabBar 配置项指定 tab 栏的表现，以及 tab 切换时显示的对应页面。比如设置 tab 展示标题和 tab 颜色等。

| 参数            | 说明                                                     | 是否必填 | 类型     | 默认值 |
| --------------- | -------------------------------------------------------- | -------- | -------- | ------ |
| color           | tab 上的文字默认颜色                                     | 是       | HexColor | -      |
| selectedColor   | tab 上的文字选中时的颜色                                 | 是       | HexColor | -      |
| backgroundColor | tab 的背景色                                             | 是       | HexColor | -      |
| borderStyle     | tabbar 上边框的颜色， 仅支持 black/white                 | 否       | string   | black  |
| list            | tab 的列表，详见 list 属性说明，最少 2 个、最多 5 个 tab | 是       | array    | -      |

其中 list 接受一个数组，数组中的每个项都是一个对象，其属性值如下：

| 参数             | 说明                                                            | 是否必填 | 类型   | 默认值 |
| ---------------- | --------------------------------------------------------------- | -------- | ------ | ------ |
| pagePath         | 页面路径，必须在 pages 中先定义                                 | 是       | string | -      |
| text             | tab 上按钮文字                                                  | 是       | string | -      |
| iconPath         | 图片路径，icon 大小限制为 40kb，建议尺寸为 81px \* 81px         | 否       | string | -      |
| selectedIconPath | 选中时的图片路径，icon 大小限制为 40kb，建议尺寸为 81px \* 81px | 否       | string | -      |

#### navigateToMiniProgramAppIdList

当小程序需要使用 navigateToMiniProgram api 跳转到其他小程序时，需要先在配置文件中声明需要跳转的小程序 appId 列表，最多允许填写 10 个。

#### permission

部分授权弹窗的副标题支持开发者自定义，每次提审后会审核该文案，如不通过，直接打回；

不可自定义副标题的权限是：个人信息、手机号。

如果开发者没有填写某个 scope， 就使用该 scope 的默认文案，各 scope 的默认文案如下：
| scope | 默认文案 |
| ---- | ---- |
| scope.userLocation | 用于提供个性化服务及体验 |
| scope.address | 一键访问“今日头条/抖音/皮皮虾”收货地址，便捷管理 |
| scope.record | 用于采集声音 |
| scope.album | 用于选取图片视频，或保存图片视频到你的相册 |
| scope.camera | 用于拍摄图片、录制视频 |

#### networkTimeout

各类网络请求的超时时间，单位均为毫秒。
| 参数 | 说明 | 是否必填 | 类型 | 默认值 |
| ---- | ---- | ---- | ---- | ---- |
| request | request 的超时时间，单位：毫秒 | 否 | number | 60000 |
| connectSocket | connectSocket 的超时时间，单位：毫秒 | 否 | number | 60000 |
| uploadFile | uploadFile 的超时时间，单位：毫秒 | 否 | number | 60000 |
| downloadFile | downloadFile 的超时时间，单位：毫秒 | 否 | number | 60000 |

### 页面配置

页面配置文件为每个页面目录下的`page.config.js`，如果 `app.config.js` 的 `window` 字段里面配置了某个页面的窗口样式，同时该页面也在自己的 `page.config.js` 文件中做了对应字段的配置的话，框架会优先采用页面里面的 `page.config.js` 相应配置项,配置文件内容如下：

```js
// page.config.ts
import { createPageConfig } from '@bytedance/mona';
export default createPageConfig({
  navigationBarTitleText: 'page title',
});
```

| 参数                         | 说明                                                                                                                                       | 是否必填 | 类型     | 默认值  |
| ---------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------- | -------- | ------- |
| navigationBarBackgroundColor | 导航栏背景颜色，如"#000000"；不支持 alpha 值，如"#AABBCCDD"                                                                                | 否       | HexColor | #000000 |
| navigationBarTextStyle       | 导航栏标题颜色，仅支持 black/white，同时影响：标题颜色、右胶囊颜色、左返回箭头颜色                                                         | 否       | string   | white   |
| navigationBarTitleText       | 导航栏标题文字内容                                                                                                                         | 否       | string   | -       |
| navigationStyle              | 导航栏样式，仅支持 default/custom。custom 模式可自定义导航栏，只保留右上角胶囊状的按钮，可以通过 navigationBarTextStyle 设置胶囊按钮的颜色 | 否       | string   | default |
| backgroundColor              | 窗口背景色                                                                                                                                 | 否       | HexColor | #ffffff |
| backgroundTextStyle          | 下拉 loading 的样式，仅支持 dark/light                                                                                                     | 否       | string   | dark    |
| enablePullDownRefresh        | 是否开启下拉刷新，详见页面相关事件处理函数                                                                                                 | 否       | boolean  | false   |
| disableScroll                | 设置为 true 则页面整体不能上下滚动；只在 page.json 中有效，无法在 app.json 中设置该项                                                      | 否       | boolean  | false   |
| disableSwipeBack             | 禁止页面右滑手势返回                                                                                                                       | 否       | boolean  | false   |
| onReachBottomDistance        | 页面上拉触底事件触发时距页面底部距离，单位为 px                                                                                            | 否       | number   | 50      |

## 多端开发

在开发过程中，有时需要正对不同的端书写不同的代码，这个时候需要判断环境，可以使用如下方式来书写多端代码

### 使用环境变量判断

使用`process.env.MONA_TARGET`来判断环境，目前有效值为`web/mini/plugin`

代码示例

```jsx
<View>
  {process.env.MONA_TARGET === 'web' ? <Text>I am web</Text> : nul}
  {process.env.MONA_TARGET === 'mini' ? <Text>I am mini</Text> : nul}
<View>
```

### 多端文件构建

为了更方便的书写不同端的不同逻辑，不同的端可以使用不同的后缀名称，如`*.web.js`、`*.mini.js`

代码示例

```jsx
import Title from './Title';
```

当要引入一个`Title`组件，比如在小程序端需要有额外的处理，则可以在`Title.js`组件同级添加`Title.mini.js`来处理，mona 在打包 mini 端的时候，如果发现`.mini`后缀的文件则会自动打包`Title.mini.js`而不是`Title.js`。

```bash
├── Title.js 除小程序外的其他版本
└── Title.mini.js  小程序版本
```

该方式可以通过`mona.config.js`下的`enableMultiBuild`来控制是否开启，默认是开启状态。如果你不需要多端构建，可以关闭该开关，来加快打包速度。

## public 目录

在项目根目录下创建`public`目录，该目录下的所有文件会全部被复制到输出目录，你可以将一些图片等文件放在该目录下，以供`iconPath`或其他场景使用，如

```js
// app.config.ts
import { createAppConfig } from '@bytedance/mona';
export default createAppConfig({
  // ...more config
  tabBar: {
    list: [
      {
        pagePath: 'pages/home/index',
        text: 'home page',
        iconPath: '/image.png',
      },
    ],
  },
});
```

或使用链接引用资源的场景，但这里推荐使用 import 的方式引用图片

```js
// ...more code
return (
  <Image src="/image.png">
)
```

## query 参数获取

在页面见跳转时，可以在路径后加入查询参数，如

```js
navigateTo('/pages/home/index?name="xiaoming"');
```

查询参数的只可以在页面组件的`props`中进行获取，其中`search`为查询参数字符串，`searchParams`为解析后的查询参数

```jsx
import { PageProps } from '@bytedance/mona';

const Home: React.FC<PageProps> = ({ search, searchParams }) => {
  console.log(search, searchParams);
  // 输出：?name="xiaoming" { name: "xiaoming" }
  return <div></div>;
};
```

## 移动端适配

css 中的单位在小程序中会自动转为`rpx`在 web 中会自动转为`rem`，你不需要关心如何换算，只需要按照设计稿时机尺寸来书写就可以。Mona 会默认以`750px`标准设计稿作为换算尺寸的标准单位。如果设计稿不是`750px`那么你可以在`mona.config.js`的`postcss.pxtransform`中修改`deviceRatio`和`designWidth`。

如果不部分属性被转换，可以使用`Px`或者`PX`这样这种形式，则插件会忽略装换

## 使用小程序原生模块

### 小程序页面

与其他页面无异，直接在`app.config` 中的`pages`属性中加入路径即可

### 小程序组件

示例：

```js
//@ts-ignore
import CustomComponent from 'native://../CustomComponent/index';

export default function () {
  return (
    <CustomComponent ref={customRef} headerText={'headerText属性'}>
      <View>这是Children</View>
    </CustomComponent>
  );
}
```

#### 导入

路径前加入`native://`前缀, 路径是一个相对路径 或者 是与`app.config` 中`pages`路径相同的路径。

#### 使用

在原生模块组件的 jsx 上，不允许写 spread attribute。例如:

```js
// bad
<CustomComponent {...props}>
  <View>这是Children</View>
</CustomComponent>

// good
<CustomComponent  ref={customRef} headerText={'headerText属性'}>
  <View>这是Children</View>
</CustomComponent>
```

## 常见问题

### mona 性能如何

我们初步测试了同时增加 100 个以及 1000 个节点在字节小程序中的表现，实际表现如下

![100](https://github.com/bytedance/mona/blob/main/static/%E5%A2%9E%E5%8A%A0100%E4%B8%AA%E5%88%97%E8%A1%A8%E9%A1%B9.png)
![1000](https://github.com/bytedance/mona/blob/main/static/%E5%A2%9E%E5%8A%A01000%E4%B8%AA%E5%88%97%E8%A1%A8%E9%A1%B9.png)

### 当前可用性

目前我们已完全支持小程序转换，并实现了 web 大部分的组件和 api。目前处于测试打磨阶段，后续会不断完善。使用中的任何问题欢迎多多提出。

## 原理

mona 在小程序侧采用了运行时方案，配合 React 进行 diff 并将需要更新的虚拟 dom 树压缩后，通过 setData 传递到渲染层，通过模板组件动态构建页面，从而达到小程序渲染的目的。同时在 web 侧我们完整实现了字节小程序常用的基本组件和 api，这就使得 web 和小程序的还原度很高。

## 特性

- 多端构建
- 完整的 ts 提示
- 完整的字节小程序组件和 api
- 较优的运行性能
- 较小的打包体积

## 飞鸽插件开发须知

### 飞鸽配置文件

飞鸽插件开发工具型需在 mona 项目根目录下配置`pigeon.json`文件。该文件结构下所示

```json
// pigeon.json
{
  // 自定义按钮配置
  "custom_button": {
    // 售后单
    "after_sale": [
      {
        "id": "xxxx",
        "name": "按钮名称",
        "params": {
          "a": "v"
        }
      },
      {
        "id": "xxxxx",
        "name": "按钮名称",
        "params": {
          "xxxx": "xxxxx"
        }
      }
    ],
    // 商品单
    "sku_order": [],
    // 店铺单
    "order": [],
    // 商品列表
    "product": []
  }
}
```

`custom_button`用来配置自定义按钮，商家可以选择是否开启，开启后按钮会按照场景展示在不同位置

目前场景有

- 售后单（after_sale）
- 商品单（sku_order）
- 店铺单（order）
- 商品列表（product）

可以在每个按钮中通过`params`自定义参数，按钮跳转插件时就会带有该自定义参数

请注意：其中按钮 id 不可重复，每次发布新版本，如果 id 不变则视为同一个按钮（会保持按钮开关状态不变），否则视为新的按钮，新按钮默认处于关闭状态
