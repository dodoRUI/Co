<template>
    <el-header>
        <div class="left">
            <img src="../../assets/西科大logo.png" title="西南科技大学">
            <span>西南科技大学社团管理系统</span>
        </div>
        <div class="right">
            <span> {{store.userInfo.username}} </span>
            <el-dropdown>
                <el-icon>
                    <UserFilled />
                </el-icon>

                <template #dropdown>
                    <el-dropdown-menu>
                        <el-dropdown-item :icon="Plus" @click="handleCenter">个人中心</el-dropdown-item>
                        <el-dropdown-item :icon="Plus" @click="logOut">退出登录</el-dropdown-item>
                    </el-dropdown-menu>
                </template>
            </el-dropdown>
        </div>
    </el-header>
</template>

<script setup>
import { DArrowRight, DArrowLeft, UserFilled } from '@element-plus/icons-vue'
import { useHomeStore } from '@/stores/home'
import { useRoute, useRouter } from 'vue-router'

const router = useRouter()
const store = useHomeStore()

function handleCollapse() {
    store.toggleCollapse()
}
function handleCenter() {
    router.push('/center')
}
function logOut(){
    store.clearUserInfo()
    localStorage.removeItem("token")
    router.push('/login')
}
</script>

<style scoped>
.el-header {
    user-select: none;
    margin: 0;
    padding: 0;
    height: 60px;
    /* background:rgb(64,158,255); */
    background: linear-gradient(90deg, #417dff, #64c7fc);
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    position: sticky;
    z-index: 5;
    top: 0;
    img{
        width: 50px;
        border-radius: 50%;
        margin-left: 10px;
    }

    .left {
        display: flex;
        align-items: center;

        span {
            margin-left: 15px;
            font-size: 20px;
        }

        i {
            font-size: 30px;
            margin: 15px;
        }

        div:hover {
            background-color: rgb(114, 184, 255);
            cursor: pointer;
        }
    }

    .right {
        display: flex;
        align-items: center;

        span {
            font-size: 18px;
        }

        i {
            font-size: 30px;
            color: white;
            margin: auto 15px;
            outline: none;
            border: none;
            transition: all 0.2s ease-in;
            &:hover{
                transform: scale(1.1);
            }
        }
    }
}
</style>