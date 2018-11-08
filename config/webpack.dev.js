process.env.NODE_ENV = 'development' // 设置当前环境为开发环境 放在最上面
const config = require('./base.conf.js') // 配置文件
const baseWebpackConfig = require('./webpack.base.js')
const path = require('path')
const webpack = require('webpack')
const merge = require('webpack-merge')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin= require('friendly-errors-webpack-plugin')

module.exports = merge(baseWebpackConfig, {
    mode: 'development', // 启用开发模式配置
    output: {
        publicPath: '/', // 资源引用路径前后都有斜杠
    },
    devServer: {
        // contentBase: path.join(__dirname, '..', `${config.base.fileName}`), // 用来指定index.html所在目录
        clientLogLevel: "warning", // 热更新时阻止控制台显示消息 太多了 没加eslint none
        overlay: {warnings: true, errors: true}, // webpack的eslint等错误、警告提示显示在页面中 全为true会停止页面运行
        noInfo: true, // 每次启动和保存，只显示webpack编译的错误和警告信息
        historyApiFallback: config.dev.historyApiFallback, // 任意的跳转或404响应可以指向 index.html 页面
        watchContentBase: true, // 修改没有被入口文件托管的文件，比如index.html文件，也会自动更新
        compress: true, // 一切服务都启用gzip 压缩
        hot: true, // 启动webpack热模块替换特性
        inline: true, // 自动刷新
        open: true, // 自动打开浏览器
        host: config.dev.host,
        port: config.dev.port,
        proxy: config.dev.proxy,
    },
    plugins: [
        new HtmlWebpackPlugin({ 
            filename: 'index.html',
            template: path.resolve(__dirname, '../src/assets/template.html'),
            vendorJsName: 'vendor.dll.js', // 给模板引用
        }),
        new webpack.HotModuleReplacementPlugin(), // 开启webpack热更新功能
        new webpack.NoEmitOnErrorsPlugin(), // webpack编译出错跳过报错阶段，在编译结束后报错
        new FriendlyErrorsPlugin({ // webapck启动时在终端显示信息
            compilationSuccessInfo: {
                messages: [`Your application is running here: http://${config.dev.host}:${config.dev.port}`],
            }
        })
    ],
    devtool: 'cheap-module-eval-source-map',
})





