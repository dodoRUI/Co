import Home from '../views/home/Home.vue'
import Center from '../views/center/Center.vue'
import ClubStatistics from '../views/club/ClubStatistics.vue'
import ClubList from '../views/club/ClubList.vue'
import NotFound from '../views/NotFound.vue'
import ActivityAdd from '../views/activity/ActivityAdd.vue'
import ActivityList from '../views/activity/ActivityList.vue'
import UserList from '../views/users/UserList.vue'
import UserAdd from '../views/users/UserAdd.vue'
import Notice from '../views/notice/Notice.vue'
import ClubNews from '../views/club/ClubNews.vue'
import ClubMembers from '../views/club/ClubMembers.vue'
import ApplyConfirm from '../views/club/ApplyConfirm.vue'


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
        path:'/club/clubstatistics',
        component:ClubStatistics
    },
    {
        path:'/club/clubnews',
        component:ClubNews
    },
    {
        path:'/club/clubmembers',
        component:ClubMembers
    },
    {
        path:'/club/clublist',
        component:ClubList
    },
    {
        path:'/club/applyconfirm',
        component:ApplyConfirm
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
        path:'/notice',
        component:Notice
    },
    {
        path:'/:pathMatch(.*)*',
        name:NotFound,
        component:NotFound
    }
]

export default mainboxRoutes