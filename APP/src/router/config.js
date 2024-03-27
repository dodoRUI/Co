import Home from '../views/home/Home.vue'
import Center from '../views/center/Center.vue'
import CommunityAdd from '../views/community/CommunityAdd.vue'
import CommunityList from '../views/community/CommunityList.vue'
import NotFound from '../views/NotFound.vue'
import ActivityAdd from '../views/activity/ActivityAdd.vue'
import ActivityList from '../views/activity/ActivityList.vue'
import UserList from '../views/users/UserList.vue'
import UserAdd from '../views/users/UserAdd.vue'
import News from '../views/news/News.vue'


// 需要给mainbox添加的子路由
const mainboxRoutes = [
    {
        path:"/home",
        component:Home
    },
    {
        path: '/center',
        component: Center
    },
    {
        path:'/community/communityadd',
        component:CommunityAdd
    },
    {
        path:'/community/communitylist',
        component:CommunityList
    },
    {
        path:'/activity/activityadd',
        component:ActivityAdd
    },
    {
        path:'/activity/activitylist',
        component:ActivityList
    },
    {
        path:'/users/userlist',
        component:UserList,
        requireAdmin: true
    },
    {
        path:'/users/useradd',
        component:UserAdd,
        requireAdmin: true
    },
    {
        path:'/news',
        component:News
    },
    {
        path:'/:pathMatch(.*)*',
        name:NotFound,
        component:NotFound
    }
]

export default mainboxRoutes