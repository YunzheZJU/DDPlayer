/**
 * Created by Yunzhe on 2018/8/22.
 */

'use strict';
// 导入Vue框架
import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VueHash from './plugins/hash';
import VueAjax from './plugins/ajax';
import StoreConfig from './stores';
import RouterConfig from './router';
// 导入vue组件
import App from './app.vue';
// 导入全局样式表
import './styles/style.scss';
// 导入SVG Symbol
import './assets/ddicon.js';

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // 若service-worker.js不在网站根目录下，需要设置scope和响应的Service-Worker-Allowed头
        navigator.serviceWorker.register('/service-worker.js');
    });
}

Vue.use(VueRouter);
const router = new VueRouter(RouterConfig);

Vue.use(Vuex);
// noinspection JSValidateTypes
const store = new Vuex.Store(StoreConfig);

Vue.use(VueHash);
Vue.use(VueAjax);

const app = document.createElement('div');
app.id = 'app';
document.getElementsByTagName('body')[0].appendChild(app);

// 创建Vue根实例
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App),
});