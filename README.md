# vue仿网易云音乐
实现播放，歌单，搜索，歌词等功能。

之前一直想抽时间学vue,看到别人做的vue云播放器都挺不错的，于是趁最近有时间就自己动手做一个看看
> 第一次做一个相对完整的vue项目，如果有什么做的不足，请提出宝贵的建议，如果觉得做的不错，请star一下，谢谢O(∩_∩)O

在线演示地址迟点补上

## 技术栈

- vue
- vue-router ：管理单应用路由
- vuex：管理公共状态
- Muse-UI:UI框架
- Webpack：自动化构建工具
- ES6：采用ES6语法
- axios:发起http请求

## 功能分析与设计

基本使用了第三方提供的api，不过我没找到关于首页的请求，于是用node.js写了个简单的请求首页数据的server

路由结构如下

![router](https://github.com/DANdtan/vue-music/blob/master/mdpic/router.png)

组件

![component and view](https://github.com/DANdtan/vue-music/blob/master/mdpic/compoent.png)

歌单数据由第三方API提供，无限下拉加载歌单列表使用了节流阀

歌曲搜索用了防抖动来实现

节流防抖函数实现都放在

![throttle](https://github.com/DANdtan/vue-music/blob/master/mdpic/throttle.png)

## 效果预览

![index](https://github.com/DANdtan/vue-music/blob/master/mdpic/index.gif)

![songlist](https://github.com/DANdtan/vue-music/blob/master/mdpic/songlist.gif)

![insonglist](https://github.com/DANdtan/vue-music/blob/master/mdpic/insonglist.gif)

![search](https://github.com/DANdtan/vue-music/blob/master/mdpic/search.gif)


github项目地址:https://github.com/DANdtan/vue-music
