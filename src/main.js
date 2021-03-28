import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 讲axios挂载到vue的原型对象上,这样vue的组件都可以利用this.$http访问axios请求
Vue.prototype.$http = axios
    // 为axios设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
axios.interceptors.request.use(config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem('token')
        // 必须return config
    return config
})
Vue.config.productionTip = false
    // 注册为全局组件
Vue.component('tree-table', treeTable)

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')