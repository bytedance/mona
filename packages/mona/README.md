# @bytedance/mona
对外暴露提供构建时API
## 配置创建
### createProjectConfig
创建项目配置，`mona.config.ts`中使用
#### 例子
```js
// mona.config.ts
import { createProjectConfig } from '@bytedance/mona';
export default createProjectConfig({
  projectName: 'demo',
  input: './src/app.tsx',
  output: 'dist'
})
```

#### 参数说明
|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| projectName  | 应用/插件名称 | 是 | string | - |
| input  | 入口文件路径 | 否 | string | - |
| output  | 打包后的文件目录路径 | 否 | string | - |
| raw  | 定义函数来修改webpack配置 | 否 | (options: any) => any | - |
| dev  | 用来修改本地服务配置 | 否 | string | { port: 9999 } |

### createAppConfig
创建应用配置，`app.config.ts`中使用
#### 例子
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
#### 参数说明
|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| pages  | 页面路径 | 是 | string[] | - |

默认`pages`的第一项为首页
### createPageConfig
创建页面配置，需在每个页面目录的`page.config.ts`中使用

#### 例子
```js
// page.config.ts
import { createPageConfig } from '@bytedance/mona';
export default createPageConfig({
  navigationBarTitleText: 'page title'
})
```
#### 参数说明
|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| navigationBarTitleText  | 当前页面标题 | 否 | string | - |
