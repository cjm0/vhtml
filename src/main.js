import Vue from 'vue'
import App from './App.vue'
import router from './router'
import axios from 'axios'
import jsonp from '@/assets/jsonp.js'

import '@/assets/common.js'
import components from '@/components/index.js'


// 收集已经改好的页面的名字
let routerName = []
router.options.routes.forEach(v => {
    routerName.push(v.path)
})

document.setTitle = function(title) {
    document.title = `${title}-` + document.title
    document.getElementById('keywords').content = document.getElementById("keywords").content + `,${title}`
}

// 全局引入组件
Object.keys(components).forEach(key => Vue.component(key, components[key]))




// 定义全局公用ajax
Object.defineProperty(Vue.prototype, 'axios', {value: axios})
Object.defineProperty(Vue.prototype, '$jsonp', {value: jsonp})
axios.defaults.withCredentials = true // 是否携带cookie信息

axios.interceptors.request.use(res => { // 添加请求拦截器
    return res;
}, err => {
    return Promise.reject(err);
})
axios.interceptors.response.use(res => { // 添加响应拦截器 
    return res.data
}, err => {
    Promise.reject(err)
})
axios.defaults.transformRequest = [function (data) { // 用于请求之前对请求数据进行操作
    var ret = []
    for (var it in data) {
        ret.push(encodeURIComponent(it) + '=' + encodeURIComponent(data[it]))
    }
    return ret.join('&')
}]




// 路由跳转前拦截
router.beforeEach((to, from, next) => {
    next()
    window.scrollTo(0, 0)
})



// 兼容ie支持promise
// window.Promise = Promise

// 关闭提示
Vue.config.productionTip = false

// new 创建对象实例后需要赋值给变量
const vue = new Vue({ 
    el: '#app',
    data() {
        return {
            routerName
        }
    },
    router,
    render: h => h(App), // App 组件并不是根组件
    mounted () {
        document.dispatchEvent(new Event('render-event'))
    }
})
Vue.use({
    vue
})






