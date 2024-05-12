<template>
    <div>

        <el-card>
            <template #header>
                <div class="card-header">
                    <span style="color: rgb(64, 158, 255); font-size: 16px;">用户添加</span>
                </div>
            </template>

            <div class="cardbody">
                <el-card class="formcard">
                    <el-form style="max-width: 600px" :model="userForm" label-width="auto" class="demo-ruleForm"
                        status-icon :rules="addUserRules" ref="userFormRef">
                        <el-form-item label="用户ID" prop="userid">
                            <el-input v-model="userForm.userid" @change="repeatConfirm" @input="inputNumber"
                                :class="userForm.repeat ? ['warning'] : []" />
                        </el-form-item>
                        <el-form-item label="姓名" prop="username">
                            <el-input v-model="userForm.username" />
                        </el-form-item>
                        <el-form-item label="性别" prop="gender">
                            <el-select v-model="userForm.gender" placeholder="请选择性别" size="middle">
                                <el-option v-for="item in genderOptions" :key="item.value" :label="item.label"
                                    :value="item.value" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="学院" prop="institute">
                            <el-select v-model="userForm.institute" placeholder="请选择学院" size="middle"
                                @change="() => { userForm.major = '' }">
                                <el-option v-for="item in Object.keys(instituteMajor)" :key="item" :label="item"
                                    :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="专业" prop="major">
                            <el-select v-model="userForm.major" placeholder="请选择专业" size="middle">
                                <el-option v-for="item in instituteMajor[userForm.institute]" :key="item" :label="item"
                                    :value="item" />
                            </el-select>
                        </el-form-item>
                        <el-form-item label="班级" prop="classid">
                            <el-input v-model="userForm.classid" />
                        </el-form-item>
                        <el-form-item label="个人简介" prop="profile">
                            <el-input v-model="userForm.profile" type="textarea" resize="none" />
                        </el-form-item>
                        <el-form-item label="头像" prop="avatar">
                            <el-upload class="avatar-uploader" action="" :show-file-list="false"
                                :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload"
                                :auto-upload="false" :on-change="handleChange">
                                <img v-show="userForm.avatar" :src="userForm.avatar" class="avatar" />
                                <el-icon class="avatar-uploader-icon">
                                    <Plus />
                                </el-icon>
                            </el-upload>
                        </el-form-item>
                        <el-form-item label="权限" prop="role">
                            <el-radio-group v-model="userForm.role">
                                <el-radio-button label="管理员" value="9" />
                                <el-radio-button label="指导老师" value="5" />
                                <el-radio-button label="用户" value="0" />
                            </el-radio-group>
                        </el-form-item>
                        <div style="margin-left: 80px;">
                            <el-button type="primary" round @click="submitForm(userFormRef)"><el-icon
                                    style="margin-right: 8px;">
                                    <Promotion />
                                </el-icon>提交</el-button>
                            <el-button type="reset" round :native-type="reset" @click="resetForm">重置</el-button>
                        </div>
                    </el-form>
                </el-card>
                
                <div
                    :class="{'card':true,'admin':userForm.role==9,'leader':userForm.role==5,'male':userForm.gender!==0,'female':userForm.gender===0}">
                    <div class="header">
                        <img :src="userForm.avatar" v-show="userForm.avatar">
                    </div>
                    <div class="center">
                        <div class="id" v-show="userForm.userid">ID：{{ userForm.userid }}</div>
                        <div class="name">
                            <span>
                                <i v-if="userForm.gender === 1" class="iconfont icon-xingbie_nan"
                                    style="color: rgb(0, 145, 255);"></i>
                                <i v-if="userForm.gender === 0" class="iconfont icon-xingbie_nv"
                                    style="color: rgb(255, 77, 148);"></i>
                                {{ userForm.username }}
                            </span>
                        </div>
                        <div class="major">
                            <span v-show="userForm.institute"
                                :style="{color: userForm.role==9?'rgb(255,73,73)':userForm.role==5?'rgb(255,195,0)':userForm.gender==0?'rgb(212,143,229)':'rgb(118,189,255)'}">
                                {{userForm.institute }}
                            </span>
                            <div v-show="userForm.major">{{ userForm.major }} 丨 {{ userForm.classid }}</div>
                        </div>
                        <div class="profile" v-show="userForm.profile">
                            <div class="title">个人简介</div>
                            <div class="content">
                                {{ userForm.profile }}
                            </div>
                        </div>
                    </div>
                    <div class="footer">
                        SWUST COMMUNITY
                    </div>
                </div>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import axios from 'axios'
import { computed, reactive, ref } from 'vue'
import { Promotion, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import upload from '@/utils/upload.js'
import instituteMajor from '@/assets/instituteMajor.js'

const userForm = reactive({
    userid: '',
    repeat: false,
    username: '',
    gender: '',
    profile: '',
    avatar: '',
    file: null,
    role: 0,
    institute: '',
    major: '',
    classid: ''
})
const genderOptions = [
    {
        label: "男",
        value: 1
    },
    {
        label: "女",
        value: 0
    }
]

// 头像上传显示
const handleChange = (file) => {
    userForm.avatar = URL.createObjectURL(file.raw)
    userForm.file = file.raw
}

// 限制ID格式和长度
function inputNumber() {
    userForm.userid = userForm.userid.replace(/\D/g, '')
}

// 检查用户id是否重复
const repeatConfirm = async () => {
    const res = await axios.post('/adminapi/users/addconfirm', { userid: userForm.userid })
    if (res.data.success) {
        ElMessage.error("该ID已被占用，请勿重复添加！")
        userForm.repeat = true
    } else {
        userForm.repeat = false
    }
}

// 表单校验
const addUserRules = reactive({
    userid: [
        { required: true, message: '请输入用户ID', trigger: 'blur' },
        { min: 10, max: 10, message: 'ID长度为10位', trigger: 'blur' },
    ],
    username: [
        { required: true, message: '请输入用户姓名', trigger: 'blur' },
    ]
})
// 提交表单
const userFormRef = ref()
const submitForm = async (form) => {
    await form.validate(async (valid) => {
        if (valid) {
            if (!userForm.repeat) {
                const res = await upload('/adminapi/users/adduser', userForm)
                if (res.success) {
                    ElMessage({
                        message: "用户添加成功",
                        type: 'success'
                    })
                    resetForm()
                } else {
                    ElMessage.error("服务器错误，请稍后再试！")
                }
            } else {
                ElMessage.error("该ID已被占用，请勿重复添加！")
            }
        } else {
            ElMessage.error("请填写完整信息！")
        }
    })
}

function resetForm() {
    userForm.userid = ''
    userForm.username = ''
    userForm.gender = ''
    userForm.profile = ''
    userForm.avatar = ''
    userForm.file = null
    userForm.role = 0
    userForm.institute = ''
    userForm.major = ''
    userForm.classid = ''
}
</script>

<style scoped lang="scss">
.female {
    background: linear-gradient(45deg, #a58fff, #ff8fcd);
}

.male {
    background: linear-gradient(45deg, #6395ff, #8df0ff);
}

.admin {
    background: linear-gradient(to bottom, #ff6565, #ff2c2c);
}

.leader{
    background: linear-gradient(to bottom, gold, orange);
}

.warning {
    border: 2px solid red;
    color: red;
    border-radius: 5px;
}

.el-card {
    margin: 0;
}

.cardbody {
    display: flex;
    align-items: center;

    :deep(.el-card__body) {
        padding: 0 0;
    }

    .formcard {
        width: 40%;
        margin: 0 40px;
        border: none;
        box-shadow: none;
    }

    .card {
        width: 400px;
        height: 520px;
        box-sizing: border-box;
        margin-left: 100px;
        padding: 20px;
        border-radius: 20px;
        position: relative;
        overflow: hidden;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.18);
        color: white;

        .header {
            width: 100%;
            text-align: center;
            margin-top: 20px;

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

                span {
                    padding: 2px;
                    font-weight: 500;
                    font-size: 12px;
                    line-height: 20px;
                    background-color: white;
                    border-radius: 5px;
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
                    width: 90%;
                    text-align: center;
                    color: rgba(255, 255, 255, 0.7);
                    padding-bottom: 5px;
                    border-bottom: 1px solid white;
                }

                .content {
                    width: 90%;
                    height: 160px;
                    margin-top: 10px;
                    font-size: 14px;
                    color: rgba(255, 255, 255, 0.7);
                    text-indent: 2em;
                    overflow: auto;

                    scrollbar-width: thin;
                    scrollbar-color: rgba(255, 255, 255, 0.7) rgba(0, 0, 0, 0);
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
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
    position: absolute;
    z-index: 2;
}

:deep(.avatar-uploader .el-upload) {
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

:deep(.el-icon.avatar-uploader-icon) {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    text-align: center;
}
</style>