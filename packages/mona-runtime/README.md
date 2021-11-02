# mona-runtime
mona运行时

## 组件
### Link
跳转组件，支持插件/应用间页面跳转

#### 例子

```jsx
import { Link } from '@bytedance/mona-runtime';

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

## 通用API
### navigateTo
路由跳转，跳转到新的页面

#### 例子
```js
import { navigateTo } from '@bytedance/mona-runtime';

navigateTo('/pages/home/index')
```

### redirectTo
路由重定向，跳转并替换当前页面路由

#### 例子
```js
import { redirectTo } from '@bytedance/mona-runtime';

redirectTo('/pages/home/index')
```

## 飞鸽API

飞鸽API分为两类，一类是以`onXXXX`开头的监听类API，该类API接受回调函数作为参数，当在飞鸽中相应事件发生时，飞鸽会调用传过来的回调函数。
另一类非`onXXXX`开头的普通的API，可以直接触发飞鸽中相应的动作

注意：飞鸽API需要在开放平台中拥有相应的插件API权限

### onCurrentCustomerChange
监听用户改变，当切换飞鸽左侧的用户时，会触发该API回调

### onShow
监听插件展示，当插件在飞鸽中前台展示时，会触发该API回调

### getInitInfo
获取初始化数据
### addToInputBoxSafely
复制文本到飞鸽会话框

