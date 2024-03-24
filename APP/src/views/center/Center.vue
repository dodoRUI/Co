<template>
    <div>
        <el-page-header icon="" title="社团管理系统" content="个人中心"></el-page-header>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <el-avatar :size="140" :src="avatarUrl" />
                    <h5 class="id">ID:{{ store.userInfo.userid }}</h5>
                    <h3 class="name">{{ store.userInfo.username }}</h3>
                    <h5 class="authorization">{{ store.userInfo.role === 9 ? '管理员' : '社长' }}</h5>
                </el-card>
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span style="color: rgb(64, 158, 255); font-size: 16px;">修改密码</span>
                        </div>
                    </template>
                    <div class="passEditor">
                        <div>
                            <div :class="!pwdForm.isCorrect ? ['tip'] : ['tip', 'hidden']">
                                <el-icon style="color: red;">
                                    <CircleCloseFilled />
                                </el-icon>
                                <span>密码错误</span>
                            </div>
                            <input type="password" v-model="pwdForm.oldPwd" @input="() => { pwdForm.isCorrect = true }"
                                placeholder="原密码">
                        </div>

                        <div>
                            <div :class="pwdForm.blur1 ? ['tip'] : ['tip', 'hidden']">
                                <el-icon v-if="pwdForm.isLegal" style="color: green;">
                                    <CircleCheckFilled />
                                </el-icon>
                                <el-icon v-else style="color: red;">
                                    <WarningFilled />
                                </el-icon>
                                <span v-show="!pwdForm.isLegal">新密码必须包含字母和数字，长度在8-14位之间</span>
                            </div>
                            <input type="password" v-model="pwdForm.newPwd" @input="checkNewPwd" placeholder="新密码">
                        </div>

                        <div>
                            <div :class="pwdForm.blur2 ? ['tip'] : ['tip', 'hidden']">
                                <el-icon v-if="pwdForm.isSame" style="color: green;">
                                    <CircleCheckFilled />
                                </el-icon>
                                <el-icon v-else style="color: red;">
                                    <WarningFilled />
                                </el-icon>
                                <span v-show="!pwdForm.isSame">两次输入不一致</span>
                            </div>
                            <input type="password" v-model="pwdForm.newPwd2" @input="samePassword" placeholder="确认密码">
                        </div>
                        <div class="button">
                            <el-button type="primary" round @click="changePassword(pwdForm)">确认修改</el-button>
                            <el-button type="reset" round @click="clearPwdForm(pwdForm)">重置</el-button>
                        </div>

                    </div>

                </el-card>
            </el-col>
            <el-col :span="16">
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span style="color: rgb(64, 158, 255); font-size: 16px;">个人信息</span>
                        </div>
                    </template>

                    <el-form ref="userFormRef" style="max-width: 600px" :model="userForm" label-width="auto"
                        class="demo-ruleForm" status-icon>
                        <el-form-item label="用户名" prop="username">
                            <el-input v-model="userForm.username" />
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="userForm.gender" placeholder="Select" size="middle" style="width: 100%">
                                <el-option v-for="item in genderOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="个人简介" prop="profile">
                            <el-input v-model="userForm.profile" type="textarea" resize="none" />
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                                :auto-upload="false" :on-change="handleChange">
                                <div class="sheld">点击上传头像</div>
                                <img v-if="userForm.avatar" :src="uploadAvatar" class="avatar" />
                                <el-icon v-else class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>

                        </el-form-item>
                        <div style="margin-left: 80px;">
                            <el-button type="primary" round @click="submitForm(userForm)"><el-icon
                                    style="margin-right: 8px;">
                                    <Promotion />
                                </el-icon>提交</el-button>
                            <el-button type="reset" round :native-type="reset" @click="handleReset">重置</el-button>
                        </div>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
    </div>
</template>
<script setup>
import { useHomeStore } from '../../stores/home';
import { computed, reactive } from 'vue'
import { Plus, Promotion, CircleCheckFilled, CircleCloseFilled, WarningFilled } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import upload from '@/utils/upload.js'
import { useRouter } from 'vue-router'

const store = useHomeStore();
const router = useRouter()

const { userid, username, profile, gender, avatar } = store.userInfo
const userForm = reactive({     // 修改信息表单
    userid,
    username,
    gender,
    profile,
    avatar,
    file: null
})

const pwdForm = reactive({
    isCorrect: true,
    blur1: false,
    blur2: false,
    isLegal: false,
    isSame: false,
    oldPwd: '',
    newPwd: '',
    newPwd2: ''
})

// 新密码检查
function checkNewPwd() {
    pwdForm.blur1 = true
    var reg = /^(?=.*[a-zA-Z])(?=.*\d).+$/
    var regLegal = reg.test(pwdForm.newPwd)
    if (pwdForm.newPwd.length >= 8 && pwdForm.newPwd.length <= 14 && regLegal) {
        pwdForm.isLegal = true
    } else {
        pwdForm.isLegal = false
    }
}
// 两次密码输入一致性检查
function samePassword() {
    pwdForm.blur2 = true
    pwdForm.isSame = pwdForm.newPwd === pwdForm.newPwd2
}

// 修改密码请求
function changePassword(pwdForm) {
    if (pwdForm.isLegal && pwdForm.isSame) {
        axios.post('/adminapi/users/changepassword', {
            userid,
            password: pwdForm.oldPwd,
            newpassword: pwdForm.newPwd,
        }).then(res => {
            if (res.data.ActionType === 'OK') {
                ElMessage({
                    message: '修改成功！请您重新登录',
                    type: 'success',
                })
                store.clearUserInfo()
                localStorage.removeItem("token")
                router.push('/login')
            }
            else {
                pwdForm.isCorrect = false
                pwdForm.newPwd = ''
                pwdForm.oldPwd = ''
                pwdForm.newPwd2 = ''
                pwdForm.blur1 = false
                pwdForm.blur2 = false
            }
        })
    }

}
// 重置密码单
function clearPwdForm(pwdForm) {
    pwdForm.blur1 = false
    pwdForm.blur2 = false
    pwdForm.oldPwd = ''
    pwdForm.newPwd = ''
    pwdForm.newPwd2 = ''
}

const genderOptions = [
    {
        label: "男",
        value: 1
    },
    {
        label: "女",
        value: 0
    },
    {
        label: "保密",
        value: -1
    },
]

// 头像上传回显
const handleChange = (file) => {
    userForm.avatar = URL.createObjectURL(file.raw)
    userForm.file = file.raw
}

// 个人中心头像显示路径
const avatarUrl = computed(() => store.userInfo.avatar ? 'http://localhost:3000' + store.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')
const uploadAvatar = computed(() => userForm.avatar.includes("blob") ? userForm.avatar : 'http://localhost:3000' + store.userInfo.avatar)

// 重置按钮
function handleReset() {
    for (var i in userForm) {
        userForm[i] = store.userInfo[i]
    }
}

// 修改信息提交请求
async function submitForm(userForm) {
    var res = await upload('/adminapi/users/upload', userForm)
    if (res.ActionType === 'OK') {
        // 修改完成后，需要重新改写持久化的userInfo
        store.addUserInfo(res.data)
        ElMessage({
            message: '更新成功！',
            type: 'success',
        })
    }
    // console.log(params)
}
</script>

<style lang="scss" scoped>
.hidden {
    visibility: hidden;
}

.box-card {
    text-align: center;
    padding: 0;
    background: linear-gradient((to bottom, white, rgb(92, 174, 255)));
    position: relative;

    .id {
        font-size: 14px;
        font-weight: 100;
        color: white;
        position: absolute;
        bottom: 8px;
        left: 10px;
    }

    .name {
        color: white;
    }

    .authorization {
        font-weight: 500;
        width: 50px;
        background-color: white;
        color: rgb(92, 174, 255);
        border-radius: 5px;
        margin: 5px auto;
    }
}

.passEditor {
    padding-right: 10px;

    >div {
        height: 60px;

        // background-color: red;
        input {
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid gray;
            outline: none;
            font-size: 14px;
            padding: 5px;
            margin-bottom: 10px;
            width: 100%;
        }

        .tip {
            margin-top: -5px;
            font-size: 12px;

            span {
                margin-left: 5px;
                font-size: 11px;
                color: red;
            }
        }

        .el-icon {
            font-size: 14px;
        }
    }

    .button {
        height: auto;
        text-align: center;
    }
}

.el-avatar {
    margin: 0;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
    border-radius: 50%;
}

.el-form-item {
    margin-bottom: 30px;

    .el-button {
        margin-top: 20px;
    }
}

:deep(.avatar-uploader .el-upload) {
    border: 1px solid var(--el-border-color);
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    transition: var(--el-transition-duration-fast);

    .sheld {
        width: 178px;
        height: 178px;
        border-radius: 50%;
        position: absolute;
        display: none;
        color: white;
        text-align: center;
        line-height: 178px;
        background: rgba(0, 0, 0, 0);
        transition: all 0.2s ease-in;
    }

    img {
        transition: all 0.5s ease-out;
    }
}

:deep(.avatar-uploader .el-upload:hover) {
    border-color: var(--el-color-primary);

    .sheld {
        display: block;
        z-index: 9;
        background: rgba(0, 0, 0, 0.1);
    }

    img {
        transform: scale(1.05);
        background: rgba(0, 0, 0, 1);
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
</style>