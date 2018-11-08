# vue 静态页面生成器

## 说明

1. 本地开发用 `historyApiFallback.rewrites` 重写地址，确保刷新能找到路由   

2. 保持原网址不变，每个路由保持两个 `/a /a.html`

3. 每个页面视情况重新设置标题、关键字、描述，注意标签的语义化  

4. 引入 `prerender-spa-plugin` 输出静态页面


## 启动项目

放在 xw_fe 目录下

```bash
git clone git@github.com:cjm0/vhtml.git
yarn 
yarn dev

部署
yarn start
yarn build
```

## 注意

预渲染插件安装不上用下面的命令

`cnpm install prerender-spa-plugin -D`

## 地址

[vue 静态页面生成器](http://vhtml.bigqianduan.top)

#### License

[MIT](./License)

