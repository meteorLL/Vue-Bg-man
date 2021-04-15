import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/components/Login'
import Home from '@/components/Home'
import Welcome from '@/components/Welcome'
import Users from '@/components/user/Users'
import Rights from '@/components/rights/Rights'
import Roles from '@/components/rights/Roles'
import List from '@/components/goods/List'
import Cate from '@/components/goods/Cate'
import Params from '@/components/goods/Params'
import Add from '@/components/goods/Add'
import Order from '@/components/order/Order'
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
        component: Home,
        redirect: '/welcome',
        children: [{
                path: '/welcome',
                component: Welcome
            },
            {
                path: '/users',
                component: Users
            },
            {
                path: '/rights',
                component: Rights
            },
            {
                path: '/roles',
                component: Roles
            }, {
                path: '/goods',
                component: List
            }, {
                path: '/categories',
                component: Cate

            }, {
                path: '/params',
                component: Params
            },
            {
                path: '/goods/add',
                component: Add
            },
            {
                path: '/orders',
                component: Order
            }
        ]
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