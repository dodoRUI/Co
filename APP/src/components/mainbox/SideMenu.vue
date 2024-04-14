<template>
    <div>
        <el-aside :width="store.isCollapse ? '64px' : '200px'">
            <div class="LOGO" @click="store.isCollapse = !store.isCollapse">
                <el-icon v-show="store.isCollapse">
                    <Menu />
                </el-icon>
                <span v-show="!store.isCollapse">MENU</span>
            </div>
            <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose" :collapse="store.isCollapse"
                :collapse-transition="true" :router="true" :default-active="route.fullPath">
                <el-menu-item index="/backstage/home">
                    <i class="iconfont icon-shouye"></i>
                    <span>系统首页</span>
                </el-menu-item>
                <el-menu-item index="/backstage/notice" v-admin>
                    <i class="iconfont icon-gonggaozixunicon-announcementInformation"></i>
                    <span>公告通知</span>
                </el-menu-item>
                <el-menu-item index="/backstage/center">
                    <i class="iconfont icon-icon-person-renwu"></i>
                    <span>个人中心</span>
                </el-menu-item>
                <el-sub-menu index="/backstage/activity">
                    <template #title>
                        <i class="iconfont icon-huodong-saishiguanli"></i>
                        <span>活动中心</span>
                    </template>
                    <el-menu-item index="/backstage/activity/activitylist"><span>活动赛事</span></el-menu-item>
                    <el-menu-item index="/backstage/activity/activityadd"><span>创建活动</span></el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/backstage/club">
                    <template #title>
                        <i class="iconfont icon-shetuan"></i>
                        <span>社团管理</span>
                    </template>
                    <el-menu-item index="/backstage/club/clublist" v-admin><span>所有社团</span></el-menu-item>
                    <el-menu-item index="/backstage/club/clubstatistics" v-admin><span>社团数据</span></el-menu-item>
                    <el-menu-item index="/backstage/club/clubnews"><span>社团资讯</span></el-menu-item>
                    <el-menu-item index="/backstage/club/applyconfirm"><span>申请审批</span></el-menu-item>
                    <el-menu-item index="/backstage/club/clubinfo"><span>我的社团</span></el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/backstage/users" v-admin>
                    <template #title>
                        <i class="iconfont icon-yonghuguanli"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/backstage/users/useradd"><span>添加用户</span></el-menu-item>
                    <el-menu-item index="/backstage/users/userlist"><span>用户列表</span></el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
    </div>
</template>

<script setup>
import { useHomeStore } from '@/stores/home'
import { useRoute } from 'vue-router';
import { Menu } from '@element-plus/icons-vue'

const route = useRoute()
const store = useHomeStore()

// 自定义指令，用于控制菜单显示权限
const vAdmin = {
    mounted(el) {
        if (store.userInfo.role !== 9) {
            el.parentNode.removeChild(el)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-aside {
    user-select: none;
    height: 100vh;
    transition: all 0.5s ease;
    position: sticky;
    top: 0;

    .LOGO {
        position: relative;
        top: 0;
        left: 0;
        z-index: 5;
        background: linear-gradient(90deg, #417dff, #55e7fc);
        height: 60px;
        text-align: center;
        cursor: pointer;

        i {
            font-size: 30px;
            color: white;
            position: absolute;
            left: 17px;
            top: 15px;
        }

        span {
            font-size: 40px;
            color: white;
            position: absolute;
            left: 40px;
            line-height: 60px
        }
    }

    .el-menu {
        transition: all 0.5s ease;
        height: calc(100vh - 60px);
        overflow: auto;

        &::-webkit-scrollbar {
            width: 3px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            width:10px;
            background: linear-gradient(15deg, rgba(64, 158, 255,0.5), rgba(85,231,252,0.5));
            /* 设置滑块颜色 */
            border-radius: 5px;
            /* 设置滑块圆角 */
        }

        .el-menu-item {
            span {
                margin-left: 25px
            }
        }
    }

    .el-sub-menu {
        padding: 0;

        span {
            font-size: 16px;
            margin-left: 25px;
        }

        i {
            font-size: 16px;
        }

        .el-menu-item {
            font-size: 16px;

            span {
                height: 16px;
                line-height: 16px;
                margin-left: 15px;
                padding-left: 5px;
                border-left: 2px solid #ccc;
            }

            &:hover {
                span {
                    border-color: rgb(64, 158, 255);
                }
            }
        }
    }

    .el-menu-item {
        padding-left: 20px;

        span {
            font-size: 16px;
            margin-left: 10px;
        }

        i {
            font-size: 16px;
        }
    }
}
</style>