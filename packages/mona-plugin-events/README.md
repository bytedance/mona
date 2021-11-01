# @ecom/mona-plugin-events
商家应用插件侧通信包

## 用来做什么
该包提供了与商家应用端进行通信的能力和类型提示，帮助开发者进行插件的开发。

插件需要与特定的集成方式集成在商家应用中才有效。

## 如何使用
### 安装该包
在插件项目中运行
```bash
npm install @ecom/mona-plugin-events
```

### 项目中引入
```js
import pluginEvents from "@ecom/mona-plugin-events";
```

sdk暴露的能力分为两大类，分别是普通API和监听API。监听API用在需要监听改变的情况，监听API以on开头，并且参数与普通API不同

普通API
```js
pluginEvents.xxx.xxxxx({
  data: {},
  success: () => {},
  fail: () => {}
})
```

监听API
```js
pluginEvents.xxx.onxxxx((data) => {
  // write code
})
```

所有能力都需要申请，默认都不进行开启

## 目前提供的能力
待定
