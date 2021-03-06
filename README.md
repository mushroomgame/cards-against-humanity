# Cards Against Humanity

## 说明

反人类卡牌游戏是风靡欧美的知名卡牌游戏，详见 [维基百科: Cards Against Humanity](https://en.wikipedia.org/wiki/Cards_Against_Humanity)

蘑菇游戏工作室曾经制作过本游戏的中国版本，可是年久失修，卡组无法契合现今的中国网络环境（石锤过气小马），性能也亟待提升，在本repo进行新版本游戏的开发

## 开发详细

### 客户端

* React
* Sass/Scss
* WebSocket

### 服务端

* Node.js
* Express
* WebSocket

## 开发步骤

### 客户端调试方法

1. 进入 `client` 文件夹。
2. 运行 `npm i` 安装所需模组。
3. 运行 `npm start` 开始测试。

### 服务端调试方法

1. 进入 `server` 文件夹。
2. 运行 `npm i nodemon -g` 安装 `nodemon`。
3. 运行 `npm i` 安装所需模组。
4. 运行 `npm start` 开始运行服务器。

## 部署方法

### 客户端部署方法

1. 进入 `client` 文件夹。
2. 运行 `npm i` 安装所需模组。
3. 运行 `npm build` 开始构建项目。
4. 构建完成的项目在新生成的 `/build` 文件夹中。

### 服务端调试方法

1. 同[服务端调试方法](#服务端调试方法)