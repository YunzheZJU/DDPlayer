/**
 * Created by Yunzhe on 2018/8/22.
 */

'use strict';
// 导入Vue框架
import Vue from 'vue';
import VueRouter from 'vue-router';
import Routers from './router.js';
import Vuex from 'vuex';
// 导入vue组件
import App from './app.vue';
import './style.css';

Vue.use(VueRouter);
Vue.use(Vuex);

// 路由配置
const RouterConfig = {
    // 使用HTML 5的History模式
    mode: 'history',
    routes: Routers,
};
const router = new VueRouter(RouterConfig);

router.beforeEach((to, from, next) => {
    window.document.title = to.meta.title;
    next();
});

router.afterEach(() => {
    window.scrollTo(0, 0);
});

const store = new Vuex.Store({
    state: {},
    getters: {},
    mutations: {},
    actions: {},
});

const app = document.createElement('div');
app.id = 'app';
document.getElementsByTagName('body')[0].appendChild(app);

// 创建Vue根实例
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
});