import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
    mode: 'history',
    routes: [
        {
            path: '/',
            component: resolve => require(['../pages/index/index.vue'], resolve)
        },
        {
            path: '/index.html',
            component: resolve => require(['../pages/index/index.vue'], resolve)
        },
        {
            path: '/compliance.html',
            component: resolve => require(['../pages/compliance/index.vue'], resolve)
        },
        {
            path: '/contactus.html',
            component: resolve => require(['../pages/contactus/index.vue'], resolve)
        },
        {
            path: '/information.html',
            component: resolve => require(['../pages/information/index.vue'], resolve)
        },
        {
            path: '/security.html',
            component: resolve => require(['../pages/security/index.vue'], resolve)
        },
        {
            path: '/temp.html',
            component: resolve => require(['../pages/temp/index.vue'], resolve)
        }
    ]
})
