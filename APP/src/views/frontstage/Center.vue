<template>
    <div>
        <div class="nodata" v-show="!store.userInfo.userid">
            <h1>NO DATA</h1>
            <div>暂无用户信息，点击右上角
                <span>登录↗</span>
            </div>
        </div>
        <div class="userinfo" v-show="store.userInfo.userid">
            <div
                :class="{ 'usercard': true, 'male': userinfo.gender === 1, 'female': userinfo.gender === 0, 'admin': userinfo.admin === 1, 'mounted': showcard }">
                <div class="header">
                    <img
                        :src="userinfo.avatar ? 'http://localhost:3000' + userinfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                </div>
                <div class="center">
                    <div class="id">ID：{{ userinfo.userid }}</div>
                    <div class="name">
                        <span>
                            <i v-if="userinfo.gender === 1" class="iconfont icon-xingbie_nan"
                                style="color: rgb(0, 145, 255);"></i>
                            <i v-if="userinfo.gender === 0" class="iconfont icon-xingbie_nv"
                                style="color: rgb(255, 77, 148);"></i>
                            {{ userinfo.username }}
                        </span>
                    </div>
                    <div class="major" v-show="userinfo.institute">
                        <span
                            :style="userinfo.gender == 0 ? { color: 'rgb(212,143,229)' } : { color: 'rgb(118,189,255)' }">{{
                                userinfo.institute }}</span>
                        <div>{{ userinfo.major }} 丨 {{ userinfo.classid }}</div>
                    </div>
                    <div class="profile">
                        <div class="title">个人简介</div>
                        <div class="content">
                            {{ userinfo.profile }}
                        </div>
                    </div>
                </div>
                <div class="footer">
                    SWUST COMMUNITY
                </div>
            </div>
            <div :class="{ 'clubinfo': true, 'mounted': showcard }">
                <div class="edit" @click="() => { showEditCard = !showEditCard }">{{ showEditCard ? '取消修改' : '修改信息' }}
                </div>
                <div v-if="!showEditCard">
                    <div class="basicinfo">
                        <h3>基本信息</h3>
                        <div class="info">
                            <div class="left">
                                <div><span>学号：</span>{{ userinfo.userid }}</div>
                                <div><span>姓名：</span>{{ userinfo.username }}</div>
                                <div><span>性别：</span>{{ userinfo.gender === 1 ? '男' : '女' }}</div>
                                <div><span>学院：</span>{{ userinfo.institute }}</div>
                                <div><span>专业：</span>{{ userinfo.major }}</div>
                                <div><span>班级：</span>{{ userinfo.classid }}</div>
                            </div>
                            <div class="right">
                                <div><span>个人简介</span></div>
                                {{ userinfo.profile }}
                            </div>
                        </div>
                    </div>
                    <div class="clublist">
                        <h3>我的社团</h3>
                        <div class="clubs">
                            <ul>
                                <li v-for="item in userclubs" :key="item.club_id"
                                    @click="() => { router.push({ path: '/front/clubs/clubinfo', query: { id: item.club_id } }) }">
                                    <div class="image">
                                        <img
                                            :src="item.club_avatar ? 'http://localhost:3000' + item.club_avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                                    </div>
                                    <div class="clubname">{{ item.club_name }}</div>
                                    <div class="members"><span><i class="iconfont icon-shetuan"></i>{{ item.members
                                            }}</span></div>
                                    <div class="jointime">{{ item.join_time }}加入该社团</div>
                                </li>
                                <li class="more">
                                    <div @click="() => { router.push('/front/clubs') }">浏览更多<el-icon>
                                            <Right />
                                        </el-icon></div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div v-else>
                    <h3>修改信息</h3>
                    <div class="editform">
                        <el-form style="max-width: 600px" :model="userinfo" label-width="auto" class="demo-ruleForm"
                            status-icon>
                            <el-form-item label="学号" prop="userid">
                                <el-input v-model="userinfo.userid" disabled />
                            </el-form-item>
                            <el-form-item label="用户名" prop="username">
                                <el-input v-model="userinfo.username" maxlength="10" show-word-limit />
                            </el-form-item>
                            <el-form-item label="个人简介" prop="profile">
                                <el-input v-model="userinfo.profile" type="textarea" resize="none" :rows="6"
                                    maxlength="200" show-word-limit />
                            </el-form-item>
                            <el-form-item label="头像" prop="avatar">
                                <el-upload class="avatar-uploader" action="" :show-file-list="false"
                                    :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                                    :auto-upload="false" :on-change="handleChange">
                                    <img v-if="userinfo.newAvatar" :src="uploadAvatar" class="avatar" />
                                    <el-icon v-else class="avatar-uploader-icon">
                                        <Plus />
                                    </el-icon>
                                </el-upload>

                            </el-form-item>
                            <div style="margin-left: 80px;">
                                <el-button type="primary" round @click="submitEditForm"><el-icon
                                        style="margin-right: 8px;">
                                        <Promotion />
                                    </el-icon>提交</el-button>
                            </div>
                        </el-form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { Right, Plus, Promotion } from '@element-plus/icons-vue'
import upload from '@/utils/upload'
import { ElMessage } from 'element-plus'

const router = useRouter()
const store = useHomeStore()
const showcard = ref(false)

onMounted(async () => {
    if (store.userInfo.userid) {
        await getUserInfo()
    }
    showcard.value = true
})

// 获取用户信息
const userinfo = reactive({})
const userclubs = ref([])
const getUserInfo = async () => {
    const id = store.userInfo.userid
    const res = await axios.post(`/frontapi/user`, { id })
    for (var i in res.data.data.userinfo) {
        userinfo[i] = res.data.data.userinfo[i]
    }
    userinfo.newAvatar = ''
    userinfo.file = null
    userclubs.value = res.data.data.clubs
}

// 修改个人信息
const showEditCard = ref(false)
// 头像上传回显
const handleChange = (file) => {
    userinfo.newAvatar = URL.createObjectURL(file.raw)
    userinfo.file = file.raw
}
const uploadAvatar = computed(() => userinfo.newAvatar.includes("blob") ? userinfo.newAvatar : 'http://localhost:3000' + store.userInfo.avatar)

const submitEditForm = async () => {
    const userform = {
        userid: '',
        username: '',
        profile: '',
        avatar: '',
        file: null,
    }
    for (var i in userform) {
        userform[i] = userinfo[i]
    }
    const res = await upload('/frontapi/user/update', userform)
    if (res.success) {
        ElMessage.success('修改成功')
        await getUserInfo()
        for (var i in userform) {
            userform[i] = userinfo[i]
        }
        store.addUserInfo(userform)
    } else {
        ElMessage.error(res.data.message)
    }
}
</script>

<style lang="scss" scoped>
.nodata {
    width: 100%;
    height: calc(100vh - 100px);
    text-align: center;
    display: flex;
    flex-direction: column;
    justify-content: center;
    background-image: linear-gradient(45deg, #417dff, #55e7fc);
    background-clip: text;
    -webkit-text-fill-color: transparent;

    h1 {
        margin-bottom: 20px;
        font-size: 60px;
    }

    span {
        background-image: linear-gradient(45deg, #9378ff, #ff77c2);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }
}

.female {
    background: linear-gradient(45deg, #a58fff, #ff8fcd);
}

.male {
    background: linear-gradient(45deg, #6395ff, #8df0ff);
}

.admin {
    background: linear-gradient(to bottom, #000000, #444444);
}

.userinfo {
    width: 100%;
    height: calc(100vh - 100px);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 90px;
    position: relative;
    overflow-x: hidden;

    .editform {
        width: 100%;
        height: 500px;

        :deep(.avatar-uploader .el-upload) {
            border: 1px solid var(--el-border-color);
            border-radius: 5%;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: var(--el-transition-duration-fast);

            img {
                transition: all 0.5s ease-out;
                width: 178px;
                height: 178px;
            }
        }

        :deep(.avatar-uploader .el-upload:hover) {
            border-color: var(--el-color-primary);

            img {
                transform: scale(1.05);
            }

            .el-icon {
                color: var(--el-color-primary);
            }
        }

        :deep(.el-icon.avatar-uploader-icon) {
            font-size: 28px;
            color: #8c939d;
            width: 178px;
            height: 178px;
            text-align: center;
        }
    }

    .usercard {
        transform: translateX(-500px);
        width: 400px;
        height: 520px;
        user-select: none;
        box-sizing: border-box;
        padding: 20px;
        border-radius: 20px;
        overflow: hidden;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.18);
        color: white;
        transition: all 0.5s ease;

        .header {
            width: 100%;
            text-align: center;

            img {
                width: 150px;
                height: 150px;
                border: 2px solid white;
                border-radius: 100px;
            }
        }

        .center {
            .id {
                text-align: center;
                font-size: 14px;
                font-weight: 100;
            }

            .name {
                margin-top: 10px;
                text-align: center;

                span {
                    padding: 0;
                    font-size: 35px;
                    line-height: 35px;
                    text-align: center;
                    font-weight: 600;
                    position: relative;

                    i {
                        margin: 0;
                        position: absolute;
                        top: 10px;
                        left: -35px;
                        font-size: 25px;
                    }
                }
            }

            .major {
                padding: 0;
                margin-top: 15px;
                text-align: center;
                font-size: 18px;
                line-height: 20px;

                /* background-color: red; */
                span {
                    padding: 2px;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 20px;
                    background-color: white;
                    border-radius: 5px;
                    color: rgb(118, 189, 255);
                }

                div {
                    margin-top: 10px;
                }
            }

            .profile {
                margin-top: 20px;
                display: flex;
                flex-direction: column;
                align-items: center;

                .title {
                    width: 95%;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.7);
                    padding-bottom: 5px;
                    border-bottom: 1px solid white;
                    font-size: 14px;
                }

                .content {
                    width: 90%;
                    height: 100px;
                    margin-top: 10px;
                    font-size: 12px;
                    color: rgba(255, 255, 255, 0.7);
                    text-indent: 2rem;
                    overflow: auto;

                    &::-webkit-scrollbar {
                        width: 5px;
                        background-color: transparent;
                    }

                    &::-webkit-scrollbar-thumb {
                        width: 10px;
                        background: rgba(255, 255, 255, 0.5);
                        border-radius: 5px;
                    }
                }
            }
        }

        .footer {
            padding: 0;
            margin: 0;
            text-align: center;
            font-size: 35px;
            font-weight: 600;
            color: rgba(255, 255, 255, 0.1);
            position: absolute;
            bottom: 0;
            left: 10px;
        }
    }

    .clubinfo {
        transform: translateX(1000px);
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 90%;
        width: 800px;
        position: relative;
        border-radius: 10px;
        box-sizing: border-box;
        padding: 30px;
        box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.2);
        transition: all 0.5s ease;

        .edit {
            position: absolute;
            top: 20px;
            left: 20px;
            background-color: transparent;
            width: 80px;
            text-align: center;
            height: 30px;
            line-height: 30px;
            font-weight: 100;
            font-size: 14px;
            color: rgb(75, 178, 253);
            border-radius: 15px;
            border: 1px solid rgb(75, 178, 253);
            transition: all 0.2s ease;
            user-select: none;
            cursor: pointer;

            &:hover {
                background-color: rgb(75, 178, 253);
                color: white;
            }

            &:active {
                transform: scale(0.95);
            }
        }

        h3 {
            text-align: center;
            margin-bottom: 20px;
            background-image: linear-gradient(45deg, #417dff, #55e7fc);
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .basicinfo {
            height: 48%;

            .info {
                display: flex;

                .left {
                    width: 300px;
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    margin-left: 40px;

                    div {
                        color: #4f4f4f;
                        font-weight: 100;

                        span {
                            color: #000000;
                            margin-right: 20px;
                            user-select: none;
                            font-weight: normal;
                        }
                    }
                }

                .right {
                    width: 350px;
                    height: 190px;
                    overflow-y: scroll;
                    font-size: 14px;
                    font-weight: 100;
                    color: #4f4f4f;

                    &::-webkit-scrollbar {
                        width: 2px;
                        background-color: transparent;
                    }

                    &::-webkit-scrollbar-thumb {
                        width: 2px;
                        background: rgba(116, 116, 116, 0.5);
                        border-radius: 5px;
                    }

                    div {
                        text-align: center;

                        span {
                            display: inline-block;
                            width: 75px;
                            height: 24px;
                            line-height: 24px;
                            font-size: 16px;
                            color: #363636;
                            background-color: rgba(255, 255, 255, 0.5);
                            border-radius: 6px;
                            font-weight: normal;
                        }
                    }
                }
            }
        }

        .clublist {
            width: 100%;
            height: 50%;

            .clubs {
                width: 100%;
                height: 100%;
                overflow: auto;

                &::-webkit-scrollbar {
                    height: 5px;
                    background-color: transparent;
                }

                &::-webkit-scrollbar-thumb {
                    width: 10px;
                    background: linear-gradient(15deg, rgba(64, 158, 255, 0.5), rgba(85, 231, 252, 0.5));
                    border-radius: 5px;
                }

                ul {
                    // width: 200%;
                    height: 100%;
                    list-style: none;
                    display: flex;
                    justify-content: start;
                    align-items: center;
                    box-sizing: border-box;
                    padding: 0 20px;

                    li:not(:last-child) {
                        width: 180px;
                        background: linear-gradient(45deg, rgba(64, 158, 255, 0.5), rgba(85, 231, 252, 0.5));
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        border-radius: 5px;
                        margin-right: 20px;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                            transform: scale(1.05);
                        }

                        .image {
                            width: 100px;
                            height: 100px;
                            position: relative;
                            margin-top: 20px;

                            img {
                                position: absolute;
                                width: 100px;
                                height: 100px;
                                object-fit: cover;
                                object-position: center;
                                position: absolute;
                                top: 0;
                                left: 0;
                                border-radius: 50%;
                            }
                        }

                        .clubname {
                            font-weight: bold;
                            margin-top: 10px;
                            color: #323232;
                        }

                        .members {
                            color: white;
                            margin-top: 5px;
                            margin-bottom: 15px;

                            i {
                                margin-right: 5px;
                            }
                        }

                        .jointime {
                            font-size: 14px;
                            color: #727272;
                            font-weight: 100;
                        }
                    }

                    .more {
                        width: 180px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        div {
                            width: 100px;
                            height: 40px;
                            text-align: center;
                            line-height: 40px;
                            display: flex;
                            align-items: center;
                            justify-content: center;
                            border: 1px solid #c0c0c0;
                            box-sizing: border-box;
                            font-weight: 100;
                            color: #919191;
                            font-size: 14px;
                            cursor: pointer;
                            user-select: none;
                            transition: all 0.2s ease;

                            &:hover {
                                border: none;
                                color: white;
                                background-color: rgb(201, 92, 218);
                            }

                            &:active {
                                transform: scale(0.95);
                            }
                        }
                    }
                }
            }
        }
    }

    .mounted {
        transform: translateX(0);
    }
}
</style>