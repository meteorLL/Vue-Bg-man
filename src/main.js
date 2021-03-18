import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
// 导入axios
import axios from 'axios'
// 讲axios挂载到vue的原型对象上,这样vue的组件都可以利用this.$http访问axios请求
Vue.prototype.$http = axios
    // 为axios设置请求根路径
axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.config.productionTip = false

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')