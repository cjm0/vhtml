const config = require('./base.conf.js') // 配置文件
const package = require('../package.json') 
const path = require('path')
const webpack = require('webpack')
const CleanWebpackPlugin = require('clean-webpack-plugin')

module.exports = {
    mode: 'production', // 启用生产模式配置
    entry: {
        //如果使用了chrome的vue-devtool，那打包的时候把vue也排除掉，因为压缩过的vue是不能使用vue-devtool的
        vendor: Object.keys(package.dependencies).filter((val) => {
                    return val != 'test'
                })
    },
    stats: {
            // 未定义选项时，stats 选项的备用值(fallback value)（优先级高于 webpack 本地默认值）
            all: undefined,
            modules: false, // 添加构建模块信息
            children: false, // 添加 children 信息
            colors: true, // `webpack --colors` 等同于
    },
    output: {
        path: path.resolve(__dirname, `../${config.base.filePath}`),
        filename: 'js/[name].dll.js',
        library: '[name]' // 生成文件的映射关系，与下面DllPlugin中name配置对应
    },
    plugins: [
        new CleanWebpackPlugin(
            [`${config.base.filePath}`],  // 匹配删除的文件
            {
                root: path.join(__dirname, '../'), // 必须先重置到根路经
                verbose: true, // 开启在控制台输出信息
                dry: false // 启用删除文件
            }
        ),
        new webpack.DllPlugin({ // 会生成一个json文件，里面是关于dll.js的一些配置信息
            path: path.resolve(__dirname, `../${config.base.filePath}/js/[name].manifest.json`),
            name: '[name]', // 与上面output中配置对应
            context: path.join(__dirname, '..') // 上下文环境路径（必填，为了与DllReferencePlugin存在与同一上下文中）
        })
    ]
}
