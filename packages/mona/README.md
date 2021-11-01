# mona
对外暴露mona组件以及API

## 组件
### Link
跳转组件，支持插件/应用间页面跳转

#### 例子

```jsx
import { Link } from '@bytedance/mona';

const Index = () => {
  return (
    <div>
      <Link to="/pages/home/index">navigate to home </Link>
    </div>
  )
}

export default Index;
```
#### 参数说明

|  参数   | 说明  | 是否必填 | 类型 | 默认值 |
|  ----  | ----  | ---- | ---- | ---- |
| to  | 要跳转的页面路由 | 是 | string | - |

## API
### navigateTo
路由跳转，跳转到新的页面

#### 例子
```js
import { navigateTo } from '@bytedance/mona';

navigateTo('/pages/home/index')
```

### redirectTo
路由重定向，跳转并替换当前页面路由

#### 例子
```js
import { redirectTo } from '@bytedance/mona';

redirectTo('/pages/home/index')
```

## 其他
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
| input  | 入口文件路径 | 是 | string | - |
| output  | 打包后的文件目录路径 | 否 | string | - |

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
