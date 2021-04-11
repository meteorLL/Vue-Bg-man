import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
import './assets/css/global.css'
import './assets/fonts/iconfont.css'
import treeTable from 'vue-table-with-tree-grid'
// 导入axios
import axios from 'axios'
// 导入vue-quill-editor富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 导入样式
import 'quill/dist/quill.core.css' // import styles
import 'quill/dist/quill.snow.css' // for snow theme
import 'quill/dist/quill.bubble.css' // for bubble theme


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
    // 使用富文本编辑器
Vue.use(VueQuillEditor)
    // 自定义格式化时间的全局过滤器
Vue.filter('dataFormat', function(originVal) {
    const dt = new Date(originVal)
    const y = dt.getFullYear()
    const m = (dt.getMonth() + 1 + '').padStart(2, '0')
    const d = (dt.getDate() + '').padStart(2, '0')
    const hh = (dt.getHours() + '').padStart(2, '0')
    const mm = (dt.getMinutes() + '').padStart(2, '0')
    const ss = (dt.getSeconds() + '').padStart(2, '0')
    return `${y}-${m}-${d} ${hh}:${mm}:${ss}`
})

new Vue({
    router,
    render: h => h(App)
}).$mount('#app')