import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import BackStage from '../views/BackStage.vue'
import FrontStage from '../views/FrontStage.vue'
import NotFound from '../views/NotFound.vue'
import backstageRoutes from './config'
import { useHomeStore } from '../stores/home'

const routes = [
    {
        path: '/',
        redirect: "/backstage/home"
    },
    {
        name: 'login',
        path: '/login',
        component: Login
    },
    {
        name: 'backstage',
        path: '/backstage',
        component: () => import('../views/BackStage.vue'),
    },
    {
        name: 'front',
        path: '/front',
        component: FrontStage,
        children: [
            {
                path: '',
                redirect: '/front/home'
            },
            {
                path: 'home',
                name: 'home',
                component: () => import('@/views/frontstage/Home.vue')
            },
            {
                path: 'center',
                name: 'center',
                component: () => import('@/views/frontstage/Center.vue')
            },
            {
                path: 'clubs',
                name: 'clubs',
                children: [
                    {
                        path: '',
                        name: 'clubs',
                        component: () => import('@/views/frontstage/Clubs.vue'),
                    },
                    {
                        path: 'clubinfo',
                        name: 'clubinfo',
                        component: () => import('@/views/frontstage/ClubInfo.vue')
                    }
                ]
            },
            {
                path: 'activities',
                name: 'activities',
                component: () => import('@/views/frontstage/Activities.vue')
            },
            {
                path: ':pathMatch(.*)*',
                component: () => import('@/views/frontstage/NotFound.vue')
            }
        ]
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
})

// 路由拦截
router.beforeEach((to, from, next) => {
    if (to.fullPath.includes('backstage')) {       // 如果前往后台界面
        const store = useHomeStore()
        if (!localStorage.getItem("token")) {       // 如果没有登录，跳转登录界面
            next({ path: "/login" })
        } else {
            if (store.userInfo.role == 0) {             // 用户登录，但是是普通用户，跳转到前台错误界面
                next({ path: "/front/error" })
            }
            else if (!store.isGetterRouter) {            // 用户第一次登录，根据权限分配子路由
                router.removeRoute("backstage")
                ConfigRouter()
                next({ path: to.fullPath })         // 跳转到目标界面
            } else {                                // 用户不是首次登录了，直接跳转
                next()
            }
        }
    } else {
        next()
    }
})

// 给mainbox添加子路由，访问子路由，就会把对应组件添加到mainbox组件中
const ConfigRouter = () => {
    const store = useHomeStore()
    if (!router.hasRoute("backstage")) {
        router.addRoute({
            name: 'backstage',
            path: '/backstage',
            component: BackStage,
        })
    }
    backstageRoutes.forEach(item => {
        checkPermission(item) && router.addRoute("backstage", item)
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