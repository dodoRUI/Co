<template>
    <div :class="currentPage == 'home' && topDistance <= videoHeight ? 'root' : ['root', 'navitop']">
        <div class="logo">
            <div class="LOGO">
                <img src="@/assets/西科大logo.png" v-if="currentPage == 'home' && topDistance <= videoHeight">
                <img src="@/assets/西科大logo蓝绿.png" v-else>
            </div>
            <div class="name">
                <img src="@/assets/SWUSTname.png" v-if="currentPage == 'home' && topDistance <= videoHeight">
                <img src="@/assets/SWUSTname蓝绿.png" v-else>
                <div>SouthWest University of Science
                    and
                    Technology</div>
            </div>
        </div>
        <div class="navbar">
            <ul>
                <li :class="currentPage == 'home' ? 'active' : ''" @click="() => { router.push('/front/home') }">
                    <div>首页</div>
                </li>
                <li :class="currentPage == 'clubs' ? 'active' : ''" @click="() => { router.push('/front/clubs') }">
                    <div>所有社团</div>
                </li>
                <li :class="currentPage == 'activities' ? 'active' : ''"
                    @click="() => { router.push('/front/activities') }">
                    <div>活动中心</div>
                </li>
                <li :class="currentPage == 'center' ? 'active' : ''" @click="() => { router.push('/front/center') }">
                    <div>个人中心</div>
                </li>
            </ul>
            <div class="signin">
                <div class="user" v-if="store.userInfo.userid">
                    <el-dropdown>
                        <img
                            :src="store.userInfo.avatar ? 'http://localhost:3000' + store.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                        <template #dropdown>
                            <el-dropdown-menu>
                                <el-dropdown-item @click="router.push('/backstage/home')"
                                    v-if="store.userInfo.role !== 0">
                                    管理系统
                                </el-dropdown-item>
                                <el-dropdown-item @click="passwordDialog = true">修改密码</el-dropdown-item>
                                <el-dropdown-item @click="logout">退出登录</el-dropdown-item>
                            </el-dropdown-menu>
                        </template>
                    </el-dropdown>
                    <div>{{ store.userInfo.username }}</div>
                </div>
                <div class="button" v-else @click="() => { router.push('/login') }">登录</div>
            </div>
        </div>
        <el-dialog v-model="passwordDialog" title="修改密码" width="400">
            <el-form ref="passwordFormRef" style="max-width: 400px" :model="passwordForm" status-icon
                :rules="passwordRules" label-width="auto" class="demo-ruleForm">
                <el-form-item label="原密码" prop="oldpass">
                    <el-input v-model="passwordForm.oldpass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="新密码" prop="newpass">
                    <el-input v-model="passwordForm.newpass" type="password" autocomplete="off" />
                </el-form-item>
                <el-form-item label="确认密码" prop="confirm">
                    <el-input v-model="passwordForm.confirm" type="password" />
                </el-form-item>
            </el-form>
            <div class="button">
                <el-button round @click="resetForm(passwordFormRef)">重置</el-button>
                <el-button type="primary" round @click="submitChangePwd(passwordFormRef)">确认</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, defineProps, reactive } from 'vue'
import { useRouter, useRoute, onBeforeRouteUpdate } from 'vue-router'
import { useHomeStore } from '@/stores/home'
import axios from 'axios'
import { ElMessage } from 'element-plus'

const router = useRouter()
const route = useRoute()
const store = useHomeStore()
const props = defineProps({
    page: String
})
const currentPage = ref('')

const topDistance = ref(0)
const videoHeight = ref(0)
onMounted(() => {
    const path = route.path.split('/')
    currentPage.value = path[path.length - 1]
    window.addEventListener('scroll', handleScroll)
    videoHeight.value = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
})
onBeforeRouteUpdate((to, from, next) => {
    currentPage.value = to.name
    next()
})
onBeforeUnmount(() => {
    window.removeEventListener('scroll', handleScroll)
})
const handleScroll = () => {
    topDistance.value = window.scrollY
}

const logout = () => {
    store.clearUserInfo()
    localStorage.removeItem("token")
    router.push('/login')
}

// 修改密码
const passwordDialog = ref(false)
const passwordFormRef = ref()
const passwordForm = reactive({
    userid: store.userInfo.userid,
    oldpass: '',
    newpass: '',
    confirm: ''
})
const validateOld = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入原密码!'))
    } else {
        callback()
    }
}
const validateNew = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请输入新密码!'))
    } else if (value === passwordForm.oldpass) {
        callback(new Error('新密码不能与原密码相同!'))
    } else {
        if (passwordForm.confirm !== '') {
            if (!passwordFormRef.value) return
            passwordFormRef.value.validateField('confirm', () => null)
        }
        callback()
    }
}
const validateConfirm = (rule, value, callback) => {
    if (value === '') {
        callback(new Error('请再次输入新密码!'))
    } else if (value !== passwordForm.newpass) {
        callback(new Error("两次输入不一致!"))
    } else {
        callback()
    }
}

const passwordRules = reactive({
    oldpass: [{ validator: validateOld, trigger: 'blur' }],
    newpass: [
        { validator: validateNew, trigger: 'blur' },
        { min: 8, max: 16, message: '密码长度为8-16位', trigger: 'blur' }
    ],
    confirm: [{ validator: validateConfirm, trigger: 'blur' }],
})

const submitChangePwd = async (form) => {
    await form.validate(async (valid) => {
        if (valid) {
            const res = await axios.post('/frontapi/user/changepwd', passwordForm)
            if (res.data.success) {
                store.clearUserInfo()
                localStorage.removeItem("token")
                router.push('/login')
                ElMessage.success('密码修改成功，请重新登录!')
            } else {
                ElMessage.error(res.data.message)
            }
        }
    })
}
const resetForm = (form) => {
    if (!form) return
    form.resetFields()
}
</script>

<style lang="scss" scoped>
.root {
    user-select: none;
    height: 100px;
    display: flex;
    align-items: center;
    background: transparent;
    transition: background 0.5s ease;

    :deep(.el-dialog) {
        height: 300px;
        border-radius: 10px;
        margin: 10% auto;

        .el-form {
            display: flex;
            flex-direction: column;
            height: 180px;
            justify-content: space-around;
        }

        .button {
            text-align: center;
        }
    }

    .logo {
        display: flex;
        width: 600px;

        .LOGO {
            img {
                width: 80px;
                margin-left: 60px;
                margin-top: 5px;
            }
        }

        .name {
            color: white;
            position: relative;

            img {
                width: 260px;
                height: 50px;
                position: absolute;
                top: 10px;
                left: 30px;

            }

            div {
                position: absolute;
                bottom: 10px;
                left: 10px;
                width: 400px;
                font-size: 14px;
                font-family: 'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif;
            }
        }
    }

    .navbar {
        position: absolute;
        right: 20px;
        display: flex;
        align-items: center;

        ul {
            list-style: none;
            display: flex;

            .active {
                border: 2px solid white;
                background-color: rgba(255, 255, 255, 0.2)
            }

            li {
                margin-right: 20px;
                width: 120px;
                height: 50px;
                color: white;
                text-align: center;
                line-height: 50px;
                font-size: 18px;
                border-radius: 10px;
                box-sizing: border-box;
                cursor: pointer;
                transition: all 0.5s ease;

                div {
                    width: 100%;
                    height: 100%;
                }

                &:hover {
                    background-color: rgba(255, 255, 255, 0.2);
                }
            }
        }

        .signin {

            .user {
                display: flex;
                align-items: center;
                font-size: 16px;
                color: white;

                img {
                    width: 50px;
                    border-radius: 25px;
                    margin-right: 15px;
                    border: 2px solid white;
                    cursor: pointer;
                }
            }

            .button {
                width: 60px;
                height: 40px;
                background-color: white;
                border-radius: 10px;
                text-align: center;
                line-height: 40px;
                font-weight: 100;
                transition: all 0.2s ease;
                cursor: pointer;
                box-sizing: border-box;

                &:hover {
                    transform: scale(1.05);
                    height: 60px;
                    border-radius: 50%;
                    line-height: 60px;
                }

                &:active {
                    transform: scale(0.95);
                    color: white;
                    background-color: transparent;
                    border: 2px solid white;
                }
            }
        }
    }
}

.navitop {
    border-bottom: 1px solid rgb(233, 233, 233);

    .logo {
        .name {
            div {
                color: #0095ff;
            }
        }
    }

    background-color: white;

    .navbar {
        ul {
            .active {
                div {
                    background-color: transparent;
                    color: white;
                }
            }

            li {
                background: linear-gradient(45deg, rgba(64, 158, 255, 1), rgba(85, 231, 252, 1));

                div {
                    background-color: white;
                    color: rgba(64, 158, 255, 0.9);
                    transition: all 0.5s ease;
                }

                &:hover {
                    div {
                        background-color: transparent;
                        color: white;
                    }

                    background: linear-gradient(-45deg, rgba(64, 158, 255, 1), rgba(85, 231, 252, 1));
                }
            }
        }

        .signin {
            .user {
                color: black;

                img {
                    border: 2px solid rgba(64, 158, 255, 0.9);
                }
            }

            .button {
                background: linear-gradient(45deg, #9378ff, #ff77c2);
                color: white;

                &:active {
                    color: rgb(209, 119, 210);
                    background: transparent;
                    border: 2px solid rgb(209, 119, 210);
                }
            }
        }
    }
}
</style>