<template>
    <div>
        <el-page-header icon="" title="社团管理" content="社团列表"></el-page-header>

        <el-card class="filterPannel">
            <div class="search">
                <el-button type="primary" @click="addDialog = true" :icon="Plus" round>新增</el-button>
                <el-input v-model="clubsearch.club_name" style="width: 240px" placeholder="社团名称"
                    :prefix-icon="Search" />
                <el-button type="primary" round :icon="Search" @click="clubSearch(clubsearch)">查询</el-button>
                <el-button type="default" plain round @click="reset">清除</el-button>
                <el-select v-model="clubsearch.club_belong" placeholder="按学院显示" style="width: 200px">
                    <el-option v-for="item in belongs" :key="item" :label="item" :value="item" />
                </el-select>
                <el-select v-model="clubsearch.club_type" placeholder="分类" style="width: 150px">
                    <el-option v-for="(item, index) in clubType" :key="item" :label="item" :value="index + 1" />
                </el-select>
            </div>
        </el-card>
        <el-card class="clublist">
            <el-table :data="showTableData" style="width: 100%" ref="multipleTableRef" stripe v-loading="loading">
                <el-table-column prop="club_id" label="社团ID" sortable width="100">
                </el-table-column>
                <el-table-column prop="club_avatar" label="社团头像">
                    <template #default="scope">
                        <el-avatar :size="50"
                            :src="scope.row.club_avatar ? 'http://localhost:3000' + scope.row.club_avatar : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'" />
                    </template>
                </el-table-column>
                <el-table-column prop="club_name" label="社团名称" width="180">
                    <template #default="scope">
                        <span class="clubname" @click="gotoClub(scope.row.club_id)">{{ scope.row.club_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="club_type" label="社团类型" width="110">
                    <template #default="scope">
                        <span class="clubtype" :style="{ 'border-color': typeColor(scope.row.club_type-1),'color': typeColor(scope.row.club_type-1)}">
                        {{ clubType[scope.row.club_type - 1] }}
                            </span>
                    </template>
                </el-table-column>
                <el-table-column prop="club_birth" label="成立时间" width="120">
                </el-table-column>
                <el-table-column prop="club_belong" label="所属学院" width="200">
                </el-table-column>
                <el-table-column prop="members" label="总人数">
                    <template #default="scope">
                        <span style="color: rgb(64,158,255);font-weight: bold;">{{ scope.row.members }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="club_minister" label="社长/会长">
                    <template #default="scope">
                        <el-tag effect="plain" round checked @click="showMinister(scope.row.club_minister)"
                            style="cursor: pointer;user-select: none;">
                            {{ scope.row.username }}
                        </el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button type="primary" plain round @click="gotoClub(scope.row.club_id)"
                            :icon="List">详情</el-button>
                        <el-popconfirm title="确认删除?" :icon="Warning" icon-color="#ff0000" confirm-button-text="删除"
                            cancel-button-text="取消" confirm-button-type="danger" @confirm="clubDelete(scope.row)">
                            <template #reference>
                                <el-button type="danger" round :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 社团添加模态框 -->
        <el-dialog v-model="addDialog" title="成立社团" width="500" :before-close="handleClose">
            <el-form ref="clubFormRef" style="max-width: 600px" :model="clubForm" label-width="auto"
                class="demo-ruleForm" status-icon :rules="clubFormRules">
                <el-form-item label="社团名称" prop="club_name">
                    <el-input v-model="clubForm.club_name" />
                </el-form-item>
                <el-form-item label="社团类型" prop="club_type">
                    <el-select v-model="clubForm.club_type" placeholder="选择社团类型" size="middle" style="width: 100%">
                        <el-option v-for="(item, index) in clubType" :key="item" :label="item" :value="index + 1" />
                    </el-select>
                </el-form-item>
                <el-form-item label="所属学院" prop="club_belong">
                    <el-select v-model="clubForm.club_belong" placeholder="选择所属学院" size="middle" style="width: 100%">
                        <el-option v-for="item in belongs" :key="item" :label="item" :value="item" />
                    </el-select>
                </el-form-item>
                <el-form-item label="社团介绍" prop="club_profile">
                    <el-input v-model="clubForm.club_profile" type="textarea" resize="none" show-word-limit
                        maxlength="200" rows="5" />
                </el-form-item>
                <el-form-item label="社长分配" prop="club_minister">
                    <el-input v-model="clubForm.club_minister" @change="checkMinister(clubForm.club_minister)"
                        placeholder="请输入社长ID" />
                </el-form-item>
                <el-form-item label="社团头像" prop="club_avatar">
                    <el-upload class="avatar-uploader" action="" :show-file-list="false"
                        :on-success="handleAvatarSuccess" :before-upload="beforeAvatarUpload" :auto-upload="false"
                        :on-change="handleChange">
                        <img v-show="clubForm.club_avatar" :src="clubForm.club_avatar" class="avatar" />
                        <el-icon class="avatar-uploader-icon">
                            <Plus />
                        </el-icon>
                    </el-upload>
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addDialog = false" round>取消</el-button>
                    <el-button type="primary" round @click="clubAdd(clubFormRef)">
                        添加
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 显示社长信息 -->
        <el-drawer v-model="drawer" title="I am the title" direction="ltr" :with-header="false" class="cardDrawer"
            :size="540" :destroy-on-close="true">
            <div :class="ministerForm.gender == 0 ? ['card', 'female'] : ['card', 'male']">
                <div class="header">
                    <img
                        :src="ministerForm.avatar ? 'http://localhost:3000' + ministerForm.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                </div>
                <div class="center">
                    <div class="id">ID：{{ ministerForm.userid }}</div>
                    <div class="name">
                        <span>
                            <i v-if="ministerForm.gender === 1" class="iconfont icon-xingbie_nan"
                                style="color: rgb(0, 145, 255);"></i>
                            <i v-if="ministerForm.gender === 0" class="iconfont icon-xingbie_nv"
                                style="color: rgb(255, 77, 148);"></i>
                            {{ ministerForm.username }}
                        </span>
                    </div>
                    <div class="major">
                        <span
                            :style="ministerForm.gender == 0 ? { color: 'rgb(212,143,229)' } : { color: 'rgb(118,189,255)' }">{{
                                ministerForm.institute }}</span>
                        <div>{{ ministerForm.major }} 丨 {{ ministerForm.classid }}</div>
                    </div>
                    <div class="profile">
                        <div class="title">个人简介</div>
                        <div class="content">
                            {{ ministerForm.profile }}
                        </div>
                    </div>
                </div>
                <div class="footer">
                    SWUST COMMUNITY
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Delete, List, Plus, Search } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import axios from 'axios'
import upload from '@/utils/upload.js'
import getDateTime from '@/utils/getDateTime.js'
import { useRouter } from 'vue-router'

const router = useRouter()

const belongs = ref(['材料科学与工程学院', '法学院', '国防科技学院', '环境与资源学院', '计算机科学与技术学院', '经济管理学院',
    '理学院', '马克思主义学院', '生命科学与工程学院', '体育学科部', '土木工程与建筑学院', '外国语学院', '文学与艺术学院', '信息工程学院', '制造科学与工程学院'])
const clubType = ref(['学科学术类', '文化艺术类', '体育健身类', '志愿服务类', '科技创新类', '兴趣爱好类', '国际交流类', '创业就业类'])
const typeColor = (type) => {
    return ['#FF6347', '#1E90FF', '#32CD32', '#FFD700', '#9370DB', '#FFA500', '#FF69B4', '#00CED1'][type]
}

// 获取数据
const loading = ref(false)
const tableDataBak = ref([])
const showTableData = ref([])
onMounted(() => {
    getClubList()
})
const getClubList = async () => {
    loading.value = true
    const res = await axios.get('/adminapi/clubs/clublist')
    tableDataBak.value = res.data.data
    clubSearch()
    loading.value = false
}

// 筛选
const clubsearch = reactive({
    club_belong: '',
    club_name: '',
    club_type: ''
})
const clubSearch = (clubsearch) => {
    showTableData.value = tableDataBak.value.filter(item => {
        for (let key in clubsearch) {
            if (clubsearch[key] !== '') {
                if(key==='club_name'&&item[key].includes(clubsearch[key])) continue
                if (item[key] !== clubsearch[key]) {
                    return false
                }
            }
        }
        return true
    })
}
const reset = () => {
    clubsearch.club_belong = ''
    clubsearch.club_name = ''
    clubsearch.club_type = ''
    clubSearch()
}

// 成立社团
const addDialog = ref(false)
const clubFormRef = ref()
const clubForm = reactive({
    club_name: '',
    club_avatar: '',
    club_profile: '',
    club_birth: '',
    club_belong: '',
    club_minister: '',
    club_type: '',
    file: null
})
const handleChange = (file) => {
    clubForm.club_avatar = URL.createObjectURL(file.raw)
    clubForm.file = file.raw
}
// 表单校验
const clubFormRules = reactive({
    club_name: [
        { required: true, message: '请输入社团名称', trigger: 'blur' },
    ],
    club_type: [
        { required: true, message: '请选择社团类型', trigger: 'blur' }
    ],
    club_belong: [
        { required: true, message: '请选择所属学院', trigger: 'blur' },
    ],
    club_minister: [
        { required: true, message: '请分配社长', trigger: 'blur' },
    ]
})
// 检查社长分配合法性
function checkMinister(userid) {
    if (userid.length != 10) {
        ElMessage.error("社长ID应为10位")
        clubForm.club_minister = ''
    } else {
        axios.get(`/adminapi/clubs/addclub/${userid}`).then(res => {
            let result = res.data.data
            if (result.club.length !== 0) {
                ElMessage.error(`该用户为 ${result.club[0].club_name} 的社长，请勿重复分配！`)
                clubForm.club_minister = ''
            } else if (result.user.length === 0) {
                ElMessage.error("用户不存在！请确保用户ID正确！")
                clubForm.club_minister = ''
            } else {
                clubForm.club_minister = userid
            }
        })
    }
}
const clubAdd = async (form) => {
    await form.validate((valid) => {
        if (valid) {
            clubForm.club_birth = getDateTime.date()
            upload('/adminapi/clubs/addclub', clubForm).then(res => {
                if (!res.success) {
                    ElMessage.error(res.message)
                    return
                }
                ElMessage.success('添加成功！')
                for (var i in clubForm) {
                    clubForm[i] = ''
                }
                clubForm.file = null
                addDialog.value = false
                getClubList()
            })
        } else {
            ElMessage.error("请完善表单信息！")
        }
    })
}

// 删除社团
const clubDelete = (club) => {
    const { username, club_name, club_minister, club_id, club_avatar } = club
    axios.delete('/adminapi/clubs/deleteclub', { params: { club_id, club_minister, club_avatar } }).then(res => {
        if (res.data.success) {
            ElNotification.success({
                title: `${club_name} 已被解散`,
                dangerouslyUseHTMLString: true,
                message: `<strong><span style="color:rgb(64,158,255)">${username}(${club_minister})</span>已被解除社长身份！</strong>`,
            })
            getClubList()
        } else {
            ElNotification.error({
                title: `删除失败`,
                message: res.data.message
            })
        }
    })
}

// 查看社长信息
const drawer = ref(false)
let ministerForm = reactive({})
const showMinister = async (userid) => {
    await axios.post('/adminapi/users/userlist', { userid }).then(res => {
        drawer.value = true
        ministerForm = { ...res.data.data[0] }
    })
}

// 跳转社团详情页面
const gotoClub = (id) => {
    router.push({ path: 'clubinfo', query: { club_id: id } })
}
</script>

<style lang="scss" scoped>
:deep(.el-dialog) {
    margin: 50px auto;
}

.filterPannel {
    margin-top: 10px;
    background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));
}

.search {
    .el-input {
        margin: 0 20px;

        :deep(.el-input__wrapper) {
            border-radius: 30px;
        }
    }

    .el-select {
        margin-left: 10px;

        :deep(.el-select__wrapper) {
            border-radius: 30px
        }
    }
}

.clublist {
    margin: 0 0;

    .clubname {
        font-weight: bold;
        cursor: pointer;

        &:hover {
            color: rgb(64, 158, 255);
            border-bottom: 2px solid rgb(64, 158, 255);
        }
    }
    .clubtype{
        display: inline-block;
        font-size: 12px;
        height: 20px;
        line-height: 20px;
        padding: 5px;
        font-weight: 100;
        border: 1px solid;
        border-radius: 20px;
    }

    .el-table {
        height: 540px;
        overflow-y: scroll;

        :deep(thead tr th) {
            text-align: center;
        }

        :deep(tbody tr td) {
            text-align: center;
        }
    }

    :deep(.el-card__body) {
        padding: 20px 0 5px 20px;
    }
}

.el-form-item {
    margin-bottom: 20px;
}

.avatar-uploader .avatar {
    width: 178px;
    height: 178px;
    display: block;
    position: absolute;
    z-index: 2;
    object-fit: cover;
    object-position: center;
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

.female {
    background: linear-gradient(45deg, #a58fff, #ff8fcd);
}

.male {
    background: linear-gradient(45deg, #6395ff, #8df0ff);
}

:deep(.cardDrawer) {
    background-color: transparent !important;
    box-shadow: none !important;

    .el-drawer__body {
        background: transparent;
        padding: 45px 20px;

        .card {
            user-select: none;
            width: 500px;
            height: 650px;
            box-sizing: border-box;
            padding: 20px;
            border-radius: 20px;
            position: relative;
            overflow: hidden;
            box-shadow: 0 14px 28px rgba(0, 0, 0, 0.2), 0 10px 10px rgba(0, 0, 0, 0.18);
            // background: linear-gradient(to bottom, #94c6ff, #4583ff);
            // background: linear-gradient(45deg, #6395ff, #8df0ff);
            color: white;

            .header {
                width: 100%;
                text-align: center;

                /* background-color: red; */
                img {
                    width: 200px;
                    height: 200px;
                    border: 2px solid white;
                    border-radius: 100px;
                }
            }

            .center {

                /* background-color: red; */
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
                    font-size: 20px;
                    line-height: 20px;

                    /* background-color: red; */
                    span {
                        padding: 2px;
                        font-weight: 500;
                        font-size: 14px;
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
                    margin-top: 40px;
                    display: flex;
                    flex-direction: column;
                    align-items: center;

                    .title {
                        width: 80%;
                        text-align: center;
                        color: rgba(255, 255, 255, 0.7);
                        padding-bottom: 5px;
                        border-bottom: 1px solid white;
                    }

                    .content {
                        /* background-color: red; */
                        width: 80%;
                        height: 160px;
                        margin-top: 10px;
                        color: rgba(255, 255, 255, 0.7);
                        text-indent: 2rem;
                        overflow: auto;

                        /* 自定义滚动条样式 */
                        scrollbar-width: thin;
                        scrollbar-color: rgba(255, 255, 255, 0.7) rgba(0, 0, 0, 0);
                    }
                }
            }

            .footer {
                /* background-color: red; */
                padding: 0;
                margin: 0;
                text-align: center;
                font-size: 42px;
                font-weight: 600;
                color: rgba(255, 255, 255, 0.1);
                position: absolute;
                bottom: 0;
            }

        }
    }
}
</style>