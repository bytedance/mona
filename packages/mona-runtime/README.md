# mona-runtime

mona 运行时

## 组件

### Link

跳转组件，支持插件/应用间页面跳转

#### 例子

```jsx
import { Link } from '@bytedance/mona-runtime';

const Index = () => {
  return (
    <div>
      <Link to='/pages/home/index'>navigate to home </Link>
    </div>
  );
};

export default Index;
```

#### 参数说明

| 参数 | 说明             | 是否必填 | 类型   | 默认值 |
| ---- | ---------------- | -------- | ------ | ------ |
| to   | 要跳转的页面路由 | 是       | string | -      |

## 通用 API

### navigateTo

路由跳转，跳转到新的页面

#### 例子

```js
import { navigateTo } from '@bytedance/mona-runtime';

navigateTo('/pages/home/index');
```

### redirectTo

路由重定向，跳转并替换当前页面路由

#### 例子

```js
import { redirectTo } from '@bytedance/mona-runtime';

redirectTo('/pages/home/index');
```

## 飞鸽 API

飞鸽 API 分为两类，一类是以`onXXXX`开头的监听类 API，该类 API 接受回调函数作为参数，当在飞鸽中相应事件发生时，飞鸽会调用传过来的回调函数。
另一类非`onXXXX`开头的普通的 API，可以直接触发飞鸽中相应的动作

注意：飞鸽 API 需要在开放平台中拥有相应的插件 API 权限

### addToInputBoxSafely

#### 使用场景

复制信息到输入框，支持文字。

#### 对应权限包

开放平台申请 复制能力权限包。示例 xxx

#### 使用限制

- 正在接待中

- 用户不在接待中。下列条件满足其一，则可复制

  - 与用户 7 天内有会话

  - 用户 180 天内有订单

#### 入参

| 名称    | 类型                                                 | 是否必填 | 描述                 |
| ------- | ---------------------------------------------------- | -------- | -------------------- |
| success | Function                                             | ❌       | 发送成功，无返回     |
| fail    | ( error: { code: number, message: string } ) => void | ❌       | 发送失败             |
| data    | string                                               | ✅       | 消息内容，length > 0 |

#### 错误码

| 错误码 | 错误描述             | 排查                                                                                           |
| ------ | -------------------- | ---------------------------------------------------------------------------------------------- |
| -100   | 未知错误             | 可能主应用内部原因。<br />① 与用户 7 天内无会话 且 用户 180 天内无订单<br />② 飞鸽本身代码出错 |
| -101   | 缺参数、入参类型错误 | 检查入参类型                                                                                   |
| -102   | 无权限               | 无权限，到开放平台申请权限包                                                                   |
| -103   | 应用不提供此能力     | 本身无此能力/ 应用未实现此功能                                                                 |

#### 示例代码

```javascript
import { pigeon } from '@bytedance/mona-runtime';

pigeon.addToInputBoxSafely({
  data: '复制的文字',
  success: () => {},
  fail: error => {
    console.log(error);
  } // {code: -100, message: '未知错误'}
});
```

### getInitInfo

#### 使用场景

应用初始化时获取信息。

#### 对应权限包

#### 入参

| 名称    | 类型                                                 | 是否必填 | 描述                           |
| ------- | ---------------------------------------------------- | -------- | ------------------------------ |
| success | (data: InitInfo) => void<br />                       | ❌       | 会将有权限的数据，透传给插件。 |
| fail    | ( error: { code: number, message: string } ) => void | ❌       | 发送失败                       |

#### 出参

#### 错误码

| 错误码 | 错误描述         | 排查                                                 |
| ------ | ---------------- | ---------------------------------------------------- |
| -100   | 未知错误         | ① 非飞鸽容器环境<br />② 飞鸽内部原因，请咨询官方人员 |
| -103   | 应用不提供此能力 | 本身无此能力/ 应用未实现此功能                       |

#### 示例代码

```javascript
import { pigeon } from '@bytedance/mona-runtime';

pigeon.getInitInfo({
  success: data => {
    //  {
    //    user_id: '',
    //    customer_service_id '': ,
    //    customer_service_name: '',
    //    shop_id: ''
    //  }
    console.log(data);
  },
  fail: error => {
    console.log(error);
  } // {code: -100, message: '未知错误'}
});
```

### onCurrentCustomerChange

#### 使用场景

监听用户改变，当切换飞鸽左侧的用户时，会触发该 API 回调
没申请 user_id 权限包时，将不会监听到对应变化

#### 出参

|          | 类型                          | 含义        |
| -------- | ----------------------------- | ----------- |
| UserInfo | {<br />user_id: string<br />} | 用户 openid |

#### 示例代码

```javascript
import { pigeon } from '@bytedance/mona-runtime';

pigeon.onCurrentCustomerChange(data => {
  console.log(data);
  // {
  //   user_id: 'xxxxxxx',
  // }
});
```

### onShow

#### 使用场景

监听插件展示，当插件在飞鸽中前台展示时，会触发该 API 回调

- 自定义按钮跳转，会携带部分 id

- 从 tab 点击进入

#### 对应权限包

#### 出参

| key             | 类型                                                                                                                                                                                       | 含义                                                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| showFrom<br />  | 0 \| 1 \| 2 \| 3 \| 4<br />                                                                                                                                                                | 0：点击 tab 进入<br />自定义按钮跳转<br />1：店铺单进入 order_id<br />2：商品单进入 sku_order_id<br />3：售后单进入 after_sale_id<br />4：商品列表进入 product_id<br />![](./image-1-1636359922405.png)<br /> |
| query<br />     | interface InitInfo {<br />user_id: string; // userOpenId<br />shop_id: number;<br />customer_service_id: string; // 客服 openUserId<br />customer_service_name: string; // 客服昵称<br />} | 官方参数<br />                                                                                                                                                                                                |
| extraData<br /> | Record<string,string><br />                                                                                                                                                                | 自定义按钮中配置的参数<br />路径【飞鸽】-【客服管理】-【应用设置】<br />![](./image-2-1636359922410.png)<br />                                                                                                |

#### 示例代码

```javascript
import { pigeon } from '@bytedance/mona-runtime';

pigeon.onShow(data => {
  console.log(data);
  // {
  //   showFrom: 0,
  //   query: {},
  //   extraData: {},
  // }
});
```
