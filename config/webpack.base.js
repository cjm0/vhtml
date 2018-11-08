const config = require('./base.conf.js') // 配置文件
const path = require('path') 
const webpack = require('webpack')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')

const HappyPack = require('happypack') // 多进程 默认三个
const os = require('os')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

// 处理路径
function resolve (dir) { 
    return path.join(__dirname, '..', dir)
}

// eslint检测
const createLintingRule = () => ({ 
    test: /\.(js|vue)$/,
    loader: 'eslint-loader',
    enforce: 'pre',
    exclude: /node_modules/,
    include: [resolve('src')],
    options: {
        formatter: require('eslint-friendly-formatter'),
        emitWarning: true
    }
})

// 获取当前环境
const prod = process.env.NODE_ENV === 'production' 


module.exports = {
    context: path.resolve(__dirname, '../'), // 作用于entry 和 loader
    entry: {
        index: './src/main.js',
    },
    output: { 
        path: resolve(`${config.base.filePath}`), // 输出到 dist 这个地址 只能是绝对路径
        filename: 'js/[name].js',
        chunkFilename: 'js/[name]_[chunkhash:6].js'
    },
    resolve: {
        extensions: ['.css', '.less', '.js', '.vue', '.json'], // 使用的扩展名
        alias: {
            // 'vue$': 'vue/dist/vue.esm.js', // 模块别名列表
            '@': resolve('src'),
        }
    },
    module: {
        rules: [
            ...(config.dev.useEslint ? [createLintingRule()] : []),
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                include: resolve('src')
            },
            {
                test: /\.pug$/,
                loader: 'pug-plain-loader',
                include: resolve('src')
            },
            {
               test: /\.css$/,
               oneOf: [
                   { // config.module.rule('css').oneOf('vue-modules')
                       resourceQuery: /module/,
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2,
                                   modules: true,
                                   localIdentName: 'v_[hash:6]'
                               }
                           },
                           'postcss-loader'
                       ]
                   },
                   { // config.module.rule('css').oneOf('vue')
                       resourceQuery: /\?vue/,
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2
                               }
                           },
                           'postcss-loader'
                       ]
                   },
                   { // config.module.rule('css').oneOf('normal-modules')
                       test: /\.module\.\w+$/,
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2,
                                   modules: true,
                                   localIdentName: 'v_[hash:6]'
                               }
                           },
                           'postcss-loader'
                       ]
                   },
                   { // config.module.rule('css').oneOf('normal')
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2,
                               }
                           },
                           'postcss-loader'
                       ]
                   },
               ]
            },
            {
               test: /\.less$/,
               oneOf: [
                   { // config.module.rule('less').oneOf('vue-modules')
                       resourceQuery: /module/,
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2,
                                   modules: true,
                                   localIdentName: 'v_[hash:6]'
                               }
                           },
                           'postcss-loader',
                           'less-loader'
                       ]
                   },
                   { // config.module.rule('less').oneOf('vue')
                       resourceQuery: /\?vue/,
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2
                               }
                           },
                           'postcss-loader',
                           'less-loader'
                       ]
                   },
                   { // config.module.rule('less').oneOf('normal-modules')
                       test: /\.module\.\w+$/,
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2,
                                   modules: true,
                                   localIdentName: 'v_[hash:6]'
                               }
                           },
                           'postcss-loader',
                           'less-loader'
                       ]
                   },
                   { // config.module.rule('less').oneOf('normal')
                       use: [
                           {
                               loader: prod ? MiniCssExtractPlugin.loader : 'vue-style-loader',
                               options: {
                                   /*
                                       复写css文件中资源路径
                                       因为css文件中的外链是相对与css的，
                                       我们抽离的css文件在可能会单独放在css文件夹内
                                       引用其他如img/a.png会寻址错误
                                       这种情况下所以单独需要配置../../，复写其中资源的路径
                                   */
                                   publicPath: '../'
                               },
                           },
                           {
                               loader: 'css-loader',
                               options: {
                                   importLoaders: 2,
                               }
                           },
                           'postcss-loader',
                           'less-loader'
                       ]
                   },
               ]
            },
            {
                test: /\.js$/,
                loader: 'HappyPack/loader?id=js',
                exclude: file => (
                    /node_modules/.test(file) && !/\.vue\.js/.test(file)
                )
            },
            {
                test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'img/[name]_[hash:6].[ext]',
                    limit: 4096,
                }
            },
            {
                test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'fonts/[name]_[hash:6].[ext]',
                    limit: 4096,
                }
            },
            {
                test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                loader: 'url-loader',
                options: {
                    name: 'media/[name]_[hash:6].[ext]',
                    limit: 4096,
                }
            },
            {
                test: /\.pdf$/,
                loader: 'file-loader',
                options: {
                    name: 'source/[name].[ext]',
                }
            },
        ]
    },
    plugins: [
        new VueLoaderPlugin(), // vue-loader新用法
        new HappyPack({ // 提高js编译速度
            id: 'js',
            loaders: [{
                loader: 'babel-loader',
                options: {
                    cacheDirectory: true
                }
            }]
        })
    ],
}


