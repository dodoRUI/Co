import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import MainBox from '../views/MainBox.vue'
import mainboxRoutes from './config'

const routes = [
    {
        path: '/',
        redirect:"/index"
    },
    {
        name:'login',
        path: '/login',
        component: Login
    },
    {
        name:'mainbox',
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

// 给mainbox添加子路由，访问子路由，就会把对应组件添加到mainbox组件中
mainboxRoutes.forEach(item=>{
    router.addRoute("mainbox",item)
})

// 路由拦截
router.beforeEach((to,from,next)=>{
    if(to.name==='login'){
        next()
    }else{
        if(!localStorage.getItem("token")){
            next({path:"/login"})
        }else{
            next()
        }
    }
})

export default router