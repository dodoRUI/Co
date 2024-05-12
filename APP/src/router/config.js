// import Home from '../views/home/Home.vue'
// import Center from '../views/center/Center.vue'
// import ClubStatistics from '../views/club/ClubStatistics.vue'
// import ClubList from '../views/club/ClubList.vue'
// import NotFound from '../views/backstage/NotFound.vue'
// import ActivityAdd from '../views/activity/ActivityAdd.vue'
// import ActivityList from '../views/activity/ActivityList.vue'
// import UserList from '../views/users/UserList.vue'
// import UserAdd from '../views/users/UserAdd.vue'
// import Notice from '../views/notice/Notice.vue'
// import ClubNews from '../views/club/ClubNews.vue'
// import ClubInfo from '../views/club/ClubInfo.vue'
// import ApplyConfirm from '../views/club/ApplyConfirm.vue'


// 需要给mainbox添加的子路由
const backstageRoutes = [
    {
        path:"home",
        component: () => import('@/views/backstage/home/Home.vue')
    },
    {
        path: 'center',
        component: () => import('@/views/backstage/center/Center.vue')
    },
    {
        path:'club/clubstatistics',
        component: () => import('@/views/backstage/club/ClubStatistics.vue'),
        requireAdmin: 9
    },
    {
        path:'club/clubnews',
        component: () => import('@/views/backstage/club/ClubNews.vue')
    },
    {
        path:'club/clubinfo',
        component: () => import('@/views/backstage/club/ClubInfo.vue')
    },
    {
        path:'club/clublist',
        component: () => import('@/views/backstage/club/ClubList.vue'),
        requireAdmin: 9
    },
    {
        path:'club/applyconfirm',
        component: () => import('@/views/backstage/club/ApplyConfirm.vue')
    },
    {
        path:'activity/activityadd',
        component: () => import('@/views/backstage/activity/ActivityAdd.vue')
    },
    {
        path:'activity/activitylist',
        component: () => import('@/views/backstage/activity/ActivityList.vue')
    },
    {
        path:'activity/activitypermit',
        component: () => import('@/views/backstage/activity/ActivityPermit.vue'),
        requireAdmin:5
    },
    {
        path:'users/userlist',
        component: () => import('@/views/backstage/users/UserList.vue'),
        requireAdmin: 9
    },
    {
        path:'users/useradd',
        component: () => import('@/views/backstage/users/UserAdd.vue'),
        requireAdmin: 9
    },
    {
        path:'notice',
        component: () => import('@/views/backstage/notice/Notice.vue'),
        requireAdmin: 9
    },
    {
        path:'/:pathMatch(.*)*',
        component: () => import('@/views/backstage/NotFound.vue')
    }
]

export default backstageRoutes