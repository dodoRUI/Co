<template>
    <div>
        <el-page-header icon="" title="社团管理" :content="`我的社团 - ${clubInfo.club_name}`"></el-page-header>
        <el-card>
            <div class="container">
                <div class="clubcard">
                    <div class="head">
                        <div class="image">
                            <img
                                :src="clubInfo.club_avatar ? 'http://localhost:3000' + clubInfo.club_avatar : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
                        </div>

                        <span>
                            <el-tag round effect="plain">{{ clubInfo.club_id }}</el-tag>
                            <span class="name">{{ clubInfo.club_name }}</span>
                        </span>
                    </div>
                    <div class="type"><span>{{ clubType[clubInfo.club_type - 1] }}</span></div>
                    <div class="birth">
                        成立时间：{{ clubInfo.club_birth }}
                    </div>
                    <div class="profile">
                        {{ clubInfo.club_profile }}
                    </div>
                    <div class="edit">
                        <el-button round plain @click="() => { clubInfoDialog = true }">修改社团信息</el-button>
                    </div>
                </div>
                <div class="memberscard">
                    <h3>
                        <el-button round :plain="!changeMinister" type="primary" style="position: absolute;left: 0;"
                            @click="() => { changeMinister = !changeMinister }" v-if="store.userInfo.role == 9||store.userInfo.role == 5">
                            {{ changeMinister ? '取消换任' : '社长换任' }}
                        </el-button>

                        <i class="iconfont icon-shetuan"></i>成员
                        <input type="text" v-model="searchMember" placeholder="查询社员" @input="searchMemberFn">

                        <el-button round plain type="warning" style="position: absolute;right: 0;"
                            @click="() => { leaderChangeDialog = true }" v-if="store.userInfo.role == 9">
                            更换指导老师
                        </el-button>
                    </h3>
                    <ul>
                        <li v-for="(item, index) in clubMembers"
                            :class="item.user_role === 5 ? 'leader' : item.user_role === 1 ? item.gender === 1 ? 'minister-male' : 'minister-female' : item.gender === 1 ? 'male' : 'female'"
                            :key="index">
                            <img
                                :src="item.avatar ? 'http://localhost:3000' + item.avatar : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
                            <div class="memberinfo">
                                <div class="userid">{{ item.userid }}</div>
                                <div class="username">
                                    {{ item.username }}
                                    <span v-if="item.user_role === 5">指导</span>
                                    <span v-if="item.user_role === 1">社长</span>
                                </div>
                                <div class="time">{{ item.join_time }}</div>
                            </div>
                            <div class="delete" v-if="changeMinister == false">
                                <el-popconfirm title="确认移除该成员?" :icon="Warning" icon-color="#ff0000"
                                    confirm-button-text="移除" cancel-button-text="取消" confirm-button-type="danger"
                                    @confirm="deleteMember(item)">
                                    <template #reference>
                                        <el-button type="danger" round>移除</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                            <div class="ministerchange" v-if="changeMinister == true">
                                <el-popconfirm title="确认更换社长?" :icon="Warning" icon-color="#417dff"
                                    confirm-button-text="确认" cancel-button-text="取消" confirm-button-type="primary"
                                    @confirm="submitMinister(item)">
                                    <template #reference>
                                        <el-button type="primary" round>任命该社员为新社长</el-button>
                                    </template>
                                </el-popconfirm>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </el-card>
        <el-dialog title="修改社团信息" v-model="clubInfoDialog" width="700px">
            <el-form :model="editClubForm" label-width="100px">
                <el-form-item label="社团名称">
                    <el-input v-model="clubInfo.club_name"></el-input>
                </el-form-item>
                <el-form-item label="社团介绍">
                    <el-input v-model="clubInfo.club_profile" type="textarea" rows="10" resize="none"></el-input>
                </el-form-item>
                <el-form-item label="头像与背景">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false" :auto-upload="false"
                        :on-change="avatarChange">
                        <img v-show="clubInfo.club_avatar" :src="uploadAvatar" class="avatar" />
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                    <el-upload class="bgimg-uploader" action="" :show-file-list="false" :auto-upload="false"
                        :on-change="bgimgChange">
                        <img v-show="clubInfo.club_background" :src="uploadBgimg" class="bgimg" />
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="clubInfoDialog = false">取消</el-button>
                    <el-button type="primary" @click="updateClubInfo(clubInfo)">
                        确认修改
                    </el-button>
                </div>
            </template>
        </el-dialog>
        <el-dialog title="更换指导老师" v-model="leaderChangeDialog" width="400px" class="leaderChangeDialog">
            <div>
                指导老师工号：
                <el-input v-model="newLeader.userid" @input="getLeaderInfo" maxlength="10" show-word-limit></el-input>
            </div>
            <div>
                指导老师姓名：
                <img :src="'http://localhost:3000' + newLeader.avatar" v-show="newLeader.avatar">
                <span :style="{ 'color': newLeader.gender == 1 ? 'rgb(64,158,255)' : 'rgb(212,143,229)' }">{{
                    newLeader.username
                }}</span>
            </div>
            <div class="institute">
                学院：
                <span class="institute" :style="{ 'border-width': newLeader.username ? '1px' : '0' }">{{
                    newLeader.institute
                    }}</span>
            </div>
            <div>
                指导社团：
                <span>
                    <span style="font-weight: bold;" v-if="newLeader.club">{{ newLeader.club }}</span>
                    <span style="font-weight: 100;color: #ccc;" v-else>暂无</span>
                </span>

            </div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="leaderChangeDialog = false">取消</el-button>
                    <el-button type="primary" @click="changeLeader()"
                        :disabled="newLeader.userid.length !== 10 || newLeader.userid === leader.userid || newLeader.club||newLeader.username==''">
                        确认更换
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import axios from 'axios'
import { useHomeStore } from '@/stores/home'
import { useRoute, useRouter } from 'vue-router'
import { ElNotification, ElMessage } from 'element-plus'
import { Delete, Warning, Plus } from '@element-plus/icons-vue'
import upload from '@/utils/upload'

const route = useRoute()
const router = useRouter()
const store = useHomeStore()

const clubType = ref(['学科学术类', '文化艺术类', '体育健身类', '志愿服务类', '科技创新类', '兴趣爱好类', '国际交流类', '创业就业类'])

const clubInfo = ref({})
const membersArr = ref([])
const searchMember = ref('')
const minister = ref({})
const leader = ref({})
const clubMembers = computed(() => {
    return membersArr.value.filter(item => {
        return item.userid.includes(searchMember.value) || item.username.includes(searchMember.value)
    })
})
onMounted(async () => {
    // 管理员从其他页面跳转过来的俱乐部id
    const route_id = route.query.club_id
    if (store.userInfo.role === 9 && route_id) {
        store.addUserInfo({ club_id: route_id })
    } else if (store.userInfo.role === 9 && !route_id && !store.userInfo.club_id) {
        router.push('/404')
    }
    getData()
})

const getData = async () => {
    let res = await axios.get(`/adminapi/clubs/clubinfo/${store.userInfo.club_id}`)
    if (res.data.success) {
        clubInfo.value = res.data.data.info
        membersArr.value = res.data.data.members
        minister.value = res.data.data.members.filter(item => { return item.userid == clubInfo.value.club_minister })[0]
        leader.value = res.data.data.members.filter(item => { return item.user_role === 5 }).length ? res.data.data.members.filter(item => { return item.user_role === 5 })[0] : { userid: '', username: '', institute: '', avatar: '', gender: '', club: '' }
        for(var i in leader.value){
            newLeader.value[i] = leader.value[i]
        }
        clubInfo.value.file = null
        clubInfo.value.file1 = null
    } else {
        ElMessage.error('服务器出错，请稍后再试！')
    }

}


// 移除社员
const deleteMember = async (user) => {
    const res = await axios.delete(`/adminapi/clubs/deletemember/${clubInfo.value.club_id}/${user.userid}`)
    ElNotification({
        title: res.data.success ? '移除成功' : '移除失败',
        message: res.data.success ? `${user.username} 已被移除 ${clubInfo.value.club_name}` : '服务器出错，移除失败',
        type: res.data.success ? 'success' : 'error'
    })
    getData()
}

// 社长换任
const changeMinister = ref(false)
const submitMinister = async (minister) => {
    const res = await axios.put(`/adminapi/clubs/changeminister`, {
        clubid: clubInfo.value.club_id,
        oldMin: clubInfo.value.club_minister,
        newMin: minister.userid
    })
    ElNotification({
        title: res.data.success ? '操作成功' : '操作失败',
        message: res.data.success ? `${minister.username} 已成为 ${clubInfo.value.club_name}新社长` : res.data.message,
        type: res.data.success ? 'success' : 'error'
    })
    changeMinister.value = false
    getData()
}

// 更换指导老师
const leaderChangeDialog = ref(false)
const newLeader = ref({})
const changeLeader = async () => {
    const res = await axios.post('/adminapi/clubs/leaderchange', { newLeader: newLeader.value.userid, clubid: clubInfo.value.club_id })
    if(res.data.success){
        ElNotification({
            title: '更换成功',
            message: `${newLeader.value.username} 已成为 ${clubInfo.value.club_name} 新指导老师`,
            type: 'success'
        }),
        getData()
        leaderChangeDialog.value = false
    }else{
        ElNotification({
            title: '操作失败',
            message: res.data.message,
            type: 'error'
        })
    }
}
const getLeaderInfo = async () => {
    if (newLeader.value.userid.length === 10) {
        const res = await axios.get(`/adminapi/clubs/leaderinfo/${newLeader.value.userid}`)
        if (res.data.data) {
            newLeader.value = res.data.data
        } else {
            ElMessage.error('未找到老师信息!')
            for (var i in newLeader.value) {
                if (i !== 'userid') {
                    newLeader.value[i] = ''
                }
            }
        }
    }
}

// 修改社团信息
const clubInfoDialog = ref(false)
// 头像上传显示
const uploadAvatar = computed(() => clubInfo.value.club_avatar && clubInfo.value.club_avatar.includes("blob") ? clubInfo.value.club_avatar : 'http://localhost:3000' + clubInfo.value.club_avatar)
const avatarChange = (file) => {
    clubInfo.value.club_avatar = URL.createObjectURL(file.raw)
    clubInfo.value.file = file.raw
}
// 背景上传显示
const uploadBgimg = computed(() => clubInfo.value.club_background && clubInfo.value.club_background.includes("blob") ? clubInfo.value.club_background : 'http://localhost:3000' + clubInfo.value.club_background)
const bgimgChange = (file) => {
    clubInfo.value.club_background = URL.createObjectURL(file.raw)
    clubInfo.value.file1 = file.raw
}
const updateClubInfo = async (form) => {
    const res = await upload('/adminapi/clubs/clubinfo/update', form)
    ElMessage({
        type: res.success ? 'success' : 'error',
        message: res.success ? '修改成功' : '修改失败'
    })
    clubInfoDialog.value = false
    getData()
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
    border-radius: 15px;
    margin: 0 auto;
    margin-top: 75px;

    .el-dialog__header {
        font-weight: 100;

        .el-dialog__title {
            color: rgb(64, 158, 255);
        }
    }

    .el-dialog__footer {
        text-align: center;
    }
}

:deep(.leaderChangeDialog) {
    border-radius: 15px;

    .el-dialog__header {
        font-weight: 100;
    }

    .el-dialog__body {
        &>div {
            font-size: 16px;
            font-weight: 100;
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            padding: 0;

            img {
                width: 50px;
                height: 50px;
                border-radius: 25px;
                margin-right: 10px;
            }

            .el-input {
                width: 200px;
            }
        }

        .institute {
            span {
                display: inline-block;
                height: 20px;
                padding: 2px 5px;
                border: 1px solid #494949;
            }
        }
    }

}

.male {
    background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));
}

.female {
    background: linear-gradient(-45deg, rgba(123, 90, 255, 0.1), rgba(255, 91, 181, 0.1));
}

.leader {
    background: linear-gradient(15deg, gold, orange);
    color: white;

    &:hover {
        background: linear-gradient(15deg, gold, orange);

        .delete {
            z-index: -1 !important;
        }

        .ministerchange {
            z-index: -1 !important;
        }
    }

    .memberinfo {
        width: 110px;

        .username {
            position: relative;

            span {
                display: inline-block;
                width: 30px;
                position: absolute;
                right: 10px;
                text-align: center;
                font-size: 12px;
                border: 1px solid white;
                border-radius: 20px;
                padding: 2px;
            }
        }

        .time {
            color: white !important;
        }
    }

}

.minister-male {
    background: linear-gradient(15deg, #417dff, #55e7fc);
    color: white;

    &:hover {
        background: linear-gradient(15deg, #417dff, #55e7fc);

        .delete {
            z-index: -1 !important;
        }

        .ministerchange {
            z-index: -1 !important;
        }
    }

    .memberinfo {
        width: 110px;

        .username {
            position: relative;

            span {
                display: inline-block;
                width: 30px;
                position: absolute;
                right: 10px;
                text-align: center;
                font-size: 12px;
                border: 1px solid white;
                border-radius: 20px;
                padding: 2px;
            }
        }

        .time {
            color: white !important;
        }
    }

}

.minister-female {
    background: linear-gradient(15deg, #a58fff, #ff8fcd);
    color: white;

    &:hover {
        background: linear-gradient(15deg, #a58fff, #ff8fcd);

        .delete {
            z-index: -1 !important;
        }

        .ministerchange {
            z-index: -1 !important;
        }
    }

    .memberinfo {
        width: 110px;

        .username {
            position: relative;

            span {
                display: inline-block;
                width: 30px;
                position: absolute;
                right: 10px;
                text-align: center;
                font-size: 12px;
                border: 1px solid white;
                border-radius: 20px;
                padding: 2px;
            }
        }

        .time {
            color: white !important;
        }
    }

}

.el-card {
    margin-top: 10px;
}

.container {
    height: 590px;
    display: flex;

    .clubcard {
        width: 40%;
        position: relative;
        background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));

        .head {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;

            .image {
                width: 200px;
                height: 200px;
                position: relative;
                margin: 20px 0;
                user-select: none;

                img {
                    width: 200px;
                    height: 200px;
                    border-radius: 50%;
                    box-sizing: border-box;
                    border: 4px solid rgb(64, 158, 255);
                    object-fit: cover;
                    object-position: center;
                    position: absolute;
                    top: 0;
                    left: 0;
                }
            }



            span {
                position: relative;

                .name {
                    font-size: 24px;
                    font-weight: bold;
                    color: rgb(64, 158, 255);
                }

                .el-tag {
                    position: absolute;
                    top: 5px;
                    left: -40px;
                }
            }
        }

        .type {
            margin-top: 10px;
            text-align: center;

            span {
                font-size: 14px;
                display: inline-block;
                padding: 5px;
                border-radius: 20px;
                font-weight: 100;
                color: #6b6b6b;
                border: 1px solid #6b6b6b;
            }
        }

        .birth {
            text-align: center;
            margin-top: 10px;
            font-size: 12px;
            color: #707070;
        }

        .profile {
            padding: 20px;
            text-indent: 2em;
        }

        .edit {
            width: 100%;
            position: absolute;
            bottom: 20px;
            text-align: center;

            .el-button {
                background-color: transparent;
                border-color: rgb(144, 144, 144);

                &:hover {
                    background-color: white;
                    border-color: rgb(64, 158, 255);
                }
            }
        }
    }

    .memberscard {
        width: 60%;
        padding-left: 20px;

        h3 {
            text-align: center;
            color: rgb(64, 158, 255);
            margin-bottom: 20px;
            position: relative;

            i {
                font-size: 24px;
                margin-right: 10px;
                margin-top: 10px;
            }

            input {
                width: 160px;
                height: 25px;
                outline: none;
                border: 1px solid #ccc;
                border-radius: 25px;
                padding-left: 15px;
                margin-left: 10px;
                font-size: 14px;
                line-height: 25px;

                &:focus {
                    border: 1px solid rgb(64, 158, 255);
                }
            }
        }

        ul {
            list-style: none;
            height: 540px;
            overflow-y: scroll;
            display: flex;
            justify-content: flex-start;
            flex-wrap: wrap;
            gap: 20px;

            li {
                width: 200px;
                height: 80px;
                padding: 0;
                display: flex;
                align-items: center;
                border-radius: 10px;
                position: relative;
                overflow: hidden;
                user-select: none;
                cursor: pointer;

                &:hover {
                    .delete {
                        z-index: 1;
                        background: rgba(255, 0, 0, 0.2);

                        .el-button {
                            transform: translateX(0);
                        }
                    }

                    .ministerchange {
                        z-index: 1;
                        background-color: rgba(255, 255, 255, 0.5);

                        .el-button {
                            transform: translateY(0);
                        }
                    }
                }

                .delete {
                    width: 200px;
                    height: 80px;
                    position: absolute;
                    z-index: -1;

                    .el-button {
                        position: absolute;
                        right: 20px;
                        top: 25px;
                        transform: translateX(100px);
                        transition: all 0.5s ease;
                    }
                }

                .ministerchange {
                    position: absolute;
                    width: 200px;
                    height: 80px;
                    z-index: -1;

                    .el-button {
                        position: absolute;
                        right: 20px;
                        top: 25px;
                        transform: translateY(-80px);
                        transition: all 0.5s ease;
                    }
                }

                img {
                    width: 50px;
                    border-radius: 25px;
                    margin-left: 20px;
                }

                .memberinfo {
                    margin-left: 20px;

                    .userid {
                        font-size: 12px;
                        margin-top: -10px;
                    }

                    .username {
                        font-weight: bold;
                    }

                    .time {
                        font-size: 12px;
                        position: absolute;
                        right: 10px;
                        bottom: 5px;
                        color: #7e7e7e;
                    }
                }
            }

            &::-webkit-scrollbar {
                width: 5px;
                background-color: transparent;
            }

            &::-webkit-scrollbar-thumb {
                width: 10px;
                background: linear-gradient(15deg, rgb(64, 158, 255), #55e7fc);
                /* 设置滑块颜色 */
                border-radius: 5px;
                /* 设置滑块圆角 */
            }
        }
    }
}

.avatar-uploader .avatar {
    display: block;
    position: absolute;
    z-index: 2;
    overflow: hidden;
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
    object-position: center;
    position: absolute;
    top: 0;
    left: 0;
}

.bgimg-uploader .bgimg {
    display: block;
    position: absolute;
    z-index: 2;
    overflow: hidden;
    width: 350px;
    height: 178px;
    object-fit: cover;
    object-position: center;
    position: absolute;
    top: 0;
    left: 0;
}

:deep(.avatar-uploader .el-upload) {
    border: 1px solid var(--el-border-color);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
    margin-right: 20px;
}

:deep(.bgimg-uploader .el-upload) {
    width: 350px;
    border: 1px solid var(--el-border-color);
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);
}

:deep(.avatar-uploader .el-upload:hover) {
    border-color: var(--el-color-primary);
}

:deep(.bgimg-uploader .el-upload:hover) {
    border-color: var(--el-color-primary);
}

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}

:deep(.el-icon.bgimg-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>