<template>
    <div>
        <el-page-header icon="" title="社团管理系统" content="个人中心"></el-page-header>
        <el-row :gutter="20">
            <el-col :span="8">
                <el-card class="box-card">
                    <el-avatar :size="140" :src="avatarUrl" />
                    <h5 class="id">ID:{{ store.userInfo.userid }}</h5>
                    <h3 class="name">{{ store.userInfo.username }}</h3>
                    <h5 class="authorization">{{ store.userInfo.role === 1 ? '管理员' : '社长' }}</h5>
                </el-card>
                <el-card>
                    <template #header>
                        <div class="card-header">
                            <span style="color: rgb(64, 158, 255); font-size: 16px;">修改密码</span>
                        </div>
                    </template>
                    <div class="passEditor">
                        <div>
                            <div class="tip">
                                <el-icon style="color: red;">
                                    <CircleCloseFilled />
                                </el-icon>
                                密码错误
                            </div>
                            <input type="password" v-model="pwdForm.oldPwd" placeholder="原密码"> 
                        </div>
                        <div>
                            <div class="tip">
                                <el-icon v-if="pwdForm.isLegal" style="color: green;"><CircleCheckFilled /></el-icon>
                                <el-icon v-else style="color: red;"><WarningFilled /></el-icon>
                                新密码长度必须在8-14位之间
                            </div>
                            <input type="password" v-model="pwdForm.newPwd" @change="checkNewPwd" placeholder="新密码">
                        </div>
                        <div>
                            <div class="tip">
                                <el-icon style="color: red;"><WarningFilled /></el-icon>
                                两次输入不一致
                            </div>
                            <input type="password" v-model="pwdForm.newPwd2" placeholder="确认密码">
                        </div>
                        <el-button type="primary" round @click="changePassword(pwdForm)">确认修改</el-button>
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
import { Plus, Promotion, CircleCheckFilled, CircleCloseFilled ,WarningFilled} from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import axios from 'axios'
import upload from '@/utils/upload.js'

const store = useHomeStore();

const { userid, username, profile, gender, avatar } = store.userInfo
const userForm = reactive({     // 修改信息表单
    userid,
    username,
    gender,
    profile,
    avatar,
    file: null
})

const pwdForm = {
    isLegal:true,
    oldPwd: '',
    newPwd: '',
    newPwd2: ''
}

// 修改密码请求
function addPassword(pwdForm) {
    console.log(pwdForm)
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
    display: flex;
    flex-direction: column;
    justify-content: start;

    div {
        display: flex;
        align-items: center;
        justify-content: start;

        input {
            border-top: none;
            border-left: none;
            border-right: none;
            border-bottom: 1px solid gray;
            outline: none;
            font-size: 16px;
            padding: 5px;
            margin-bottom: 10px;
        }

        .tip{
            font-size: 12px;
        }
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