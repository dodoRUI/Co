<template>
    <div>
        <el-aside :width="store.isCollapse ? '64px' : '200px'">
            <el-menu class="el-menu-vertical-demo" @open="handleOpen" @close="handleClose"
                :collapse="store.isCollapse" :collapse-transition="false" :router="true" :default-active="route.fullPath">
                <el-menu-item index="/home">
                    <i class="iconfont icon-shouye"></i>
                    <span>系统首页</span>
                </el-menu-item>
                <el-menu-item index="/news">
                    <i class="iconfont icon-gonggaozixunicon-announcementInformation"></i>
                    <span>公告资讯</span>
                </el-menu-item>
                <el-menu-item index="/center">
                    <i class="iconfont icon-icon-person-renwu"></i>
                    <span>个人中心</span>
                </el-menu-item>
                <el-sub-menu index="/activity">
                    <template #title>
                        <i class="iconfont icon-huodong-saishiguanli"></i>
                        <span>活动中心</span>
                    </template>
                    <el-menu-item index="/activity/activitylist"><span>活动赛事</span></el-menu-item>
                    <el-menu-item index="/activity/activityadd"><span>创建活动</span></el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/community">
                    <template #title>
                        <i class="iconfont icon-shetuan"></i>
                        <span>社团管理</span>
                    </template>
                    <el-menu-item index="/community/communitylist"><span>所有社团</span></el-menu-item>
                    <el-menu-item index="/community/communityadd"><span>成立社团</span></el-menu-item>
                </el-sub-menu>
                <el-sub-menu index="/users" v-admin>
                    <template #title>
                        <i class="iconfont icon-yonghuguanli"></i>
                        <span>用户管理</span>
                    </template>
                    <el-menu-item index="/users/useradd"><span>添加用户</span></el-menu-item>
                    <el-menu-item index="/users/userlist"><span>用户列表</span></el-menu-item>
                </el-sub-menu>
            </el-menu>
        </el-aside>
    </div>
</template>

<script setup>
import { useHomeStore } from '@/stores/home'
import { useRoute } from 'vue-router';

const route = useRoute()
const store = useHomeStore()

// 自定义指令，用于控制菜单显示权限
const vAdmin = {
    mounted(el){
        if(store.userInfo.role !== 9){
            el.parentNode.removeChild(el)
        }
    }
}
</script>

<style lang="scss" scoped>
.el-aside {
    height: 100vh;
}

.el-sub-menu {
    padding: 0;

    span {
        font-size: 16px;
        margin-left: 10px;
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
</style>