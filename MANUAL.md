## 开发规范

### 通信

* 通信使用 `json` ，须通过 `base64` 进行编码后发送至服务端/客户端。具体格式如下：

```json
{
	"signal": "$CHAT",
	"data": {
		"message": "Hello"
	} 
}
```

> signal

* 信号名，表明该数据的作用，且该信号名会被直接当做事件进行派发。

> data

* 具体数据，派发的事件自动传递该对象作为参数。

### 事件机制

* 使用 [whevent](https://www.npmjs.com/package/whevent) 统一进行事件处理。
* 事件名全大写，空格使用 `_` 代替。
* 服务器接收到客户端的消息、以及客户端接收到服务器的消息时，自动会发送 `signal` 对应的事件。
* 基础通信事件使用 `$$` 作为前缀，目前只有 `$$OPEN`，`$$CLOSE`，`$$MESSAGE`，`$$ERROR` 四种。
* 服务器/客户端之间的事件使用 `$` 作为前缀，比如 `$CHAT`， `$LOGIN`，表示该事件由网络进行派发。
* 本地事件不使用前缀，比如 `LOGIN_BUTTON_CLICKED`、`CARD_PICKED`，表示该事件为本地触发。

## 代码规范

### CSS

#### Class 定义

* 使用 [BEM](http://getbem.com/naming/) 命名方式的变种，首字母大写的驼峰命名法，层级之间使用 `-` 隔开，变种使用 `_` 进行隔开，例如：

```html
<div className="LoginForm">
	<a className="LoginForm-Button Button Button_Wide">Submit</a>
</div>
```

#### 尺寸控制

* 使用 `rem`，`em` 进行基本尺寸控制，数值过小时使用 `px`。
* `1rem` 对应为 `10px`。
* 默认字体大小为 `1.6rem`。
* 例：

```
.Test {
	font-size: 2rem;	// 20px
	margin-top: 1rem;	// 10px
	margin-bottom: 1em;	// 20px
	border: solid 1px red;
}
```

### JavaScript
