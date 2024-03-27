import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainBox from '../views/MainBox.vue'
import mainboxRoutes from './config'
import { useHomeStore } from '../stores/home'

const routes = [
    {
        path: '/',
        redirect: "/home"
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'mainbox',
        path: '/mainbox',
        component: MainBox,
    },
    // {
    //     path:"/:pathMatch(.*)*",
    //     component:NotFound
    // }
    // mainbox的嵌套路由需要根据登录权限来动态创建
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 路由拦截
router.beforeEach((to, from, next) => {
    const store = useHomeStore()
    if (to.name === 'login') {
        next()
    } else {
        if (!localStorage.getItem("token")) {
            next({ path: "/login" })
        } else {
            if (!store.isGetterRouter) {
                router.removeRoute("mainbox")
                ConfigRouter()
                next({ path: to.fullPath })
            } else {
                next()
            }

        }
    }
})

// 给mainbox添加子路由，访问子路由，就会把对应组件添加到mainbox组件中
const ConfigRouter = () => {
    const store = useHomeStore()
    if (!router.hasRoute("mainbox")) {
        router.addRoute({
            name: 'mainbox',
            path: '/mainbox',
            component: MainBox,
        })
    }
    mainboxRoutes.forEach(item => {
        checkPermission(item) && router.addRoute("mainbox", item)
        store.changeGetterRouter(true)
    })
}
const checkPermission = (item) => {
    const store = useHomeStore()
    if (item.requireAdmin) {
        return store.userInfo.role === 9
    }
    return true
}

export default router