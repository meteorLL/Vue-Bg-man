import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '@/components/Home.vue'
Vue.use(VueRouter)

const routes = [

    {
        // 重定向
        path: '/',
        redirect: '/login'
    },
    {
        path: '/login',
        component: Login
    },
    {
        path: '/home',
        component: Home
    }

]

const router = new VueRouter({
        routes
    })
    // 挂载路由导航守卫
router.beforeEach((to, from, next) => {
    // to代表将要访问的路径
    // from代表从哪个路径跳转过来
    // next是一个函数，表示放行 next('/login') 强制跳转
    //如果访问的是登录页，直接放行
    if (to.path === '/login') {
        return next();
    } else {
        // 获取token
        const tokenStr = window.sessionStorage.getItem('token');
        // 如果token没有则跳转到login
        if (!tokenStr) {
            return next('/login')
        } else {
            // 放行
            next();
        }
    }

})

export default router