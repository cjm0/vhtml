const path = require('path') 


// 获取本地ip
const os = require('os')
const getIp = () => { 
    var interfaces = os.networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];
        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
                return alias.address;
            }
        }
    }
}


// 多页面路径处理
const glob = require('glob')
const files = glob.sync(path.resolve(__dirname, '../src/pages') + '/*/index.vue')

const getFilesName = () => { // 获取多页面文件名字
    let filesName = []
    files.forEach(file => {
        let dirName = path.dirname(file) // main.js 父级文件夹名字
        let fileName = dirName.substring(dirName.lastIndexOf('\/') + 1)

        if (fileName == 'index') {
            filesName.push('/')
        } else {
            filesName.push('/' + fileName)
        }
    })
    return filesName
}

module.exports = {
    base: {
        rootPath: '/',
        filePath: 'dist',
    },
    prerender: getFilesName(), // 预渲染页面文件
    dev: {
        useEslint: true,
        host: getIp(),
        port: 3007,
        historyApiFallback: {
            verbose: true, // 激活日志记录
            disableDotRule: true, // 允许使用点
            rewrites: [ // history 模式路由处理
                {from: /\/index/, to: '/index.html'},
            ] 
        },
        proxy: {
            
        }
    }
}
