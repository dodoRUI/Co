<template>
    <div>
        <el-page-header icon="" title="用户管理" content="用户列表"></el-page-header>
        <el-card class="userSearch">
            <el-button type="danger" @click="deleteDialog=true">批量删除</el-button>
            <el-button type="primary" plain @click="userFilter(filterUserForm)">筛选</el-button>
            <el-input v-model="filterUserForm.userid" style="width: 150px" placeholder="用户ID" />
            <el-input v-model="filterUserForm.username" style="width: 120px" placeholder="姓名" />
            <el-select v-model="filterUserForm.gender" placeholder="性别" size="middle" style="width: 80px;">
                <el-option v-for="item in genderOptions" :key="item.value" :label="item.label" :value="item.value" />
            </el-select>
            <el-select v-model="filterUserForm.institute" placeholder="学院" size="middle"
                @change="() => { filterUserForm.major = '' }">
                <el-option v-for="item in Object.keys(instituteMajor)" :key="item" :label="item" :value="item" />
            </el-select>
            <el-select v-model="filterUserForm.major" placeholder="专业" size="middle">
                <el-option v-for="item in instituteMajor[filterUserForm.institute]" :key="item" :label="item"
                    :value="item" />
            </el-select>
            <el-button type="danger" plain @click="filterRemove">重置</el-button>
        </el-card>
        <el-card class="userlist">
            <el-scrollbar height="500px">
                <el-table :data="tableData" 
                :default-sort="{ prop: 'date', order: 'descending' }"
                style="width: 100%"
                :cell-style="{ padding: '0px' }" 
                :row-style="{ height: '20px' }" 
                ref="multipleTableRef"
                @selection-change="handleSelectionChange">
                    <el-table-column type="selection" width="30" />
                    <el-table-column prop="userid" label="ID" sortable />
                    <el-table-column prop="avatar" label="头像">
                        <template #default="scope">
                            <div v-if="scope.row.avatar">
                                <el-avatar :size="40" :src="'http://localhost:3000' + scope.row.avatar" />
                            </div>
                            <div v-else>
                                <el-avatar :size="40"
                                    src="https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png" />
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="username" label="姓名" />
                    <el-table-column prop="gender" label="性别">
                        <template #default="scope">
                            <div v-if="scope.row.gender!==-1">{{ scope.row.gender == 1 ? '男' : '女' }}</div>
                            <div v-else>保密</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="institute" label="学院" />
                    <el-table-column prop="major" label="专业" />
                    <el-table-column prop="classid" label="班级" />
                    <el-table-column label="社团">
                        <template #default="scope">
                            <div class="showInfo" @click="showCommunities">查看社团</div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="role" label="权限">
                        <template #default="scope">
                            <div v-if="scope.row.role == 9">
                                <el-tag type="warning">管理员</el-tag>
                            </div>
                            <div v-else-if="scope.row.role == 1">
                                <el-tag type="primary">社长</el-tag>
                            </div>
                            <div v-if="scope.row.role == 0">
                                <el-tag type="info">用户</el-tag>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="130px">
                        <template #default="scope">
                            <el-button type="primary" round @click="userEdit(scope.row)">编辑</el-button>
                            <el-popconfirm title="确认删除" :icon="Warning" icon-color="#ff0000" confirm-button-text="删除"
                                cancel-button-text="取消" confirm-button-type="danger" @confirm="userDelete(scope.row)">
                                <template #reference>
                                    <el-button type="danger" circle :icon="Delete"></el-button>
                                </template>
                            </el-popconfirm>
                        </template>
                    </el-table-column>
                </el-table>
            </el-scrollbar>
            <el-pagination v-model:current-page="currentPage" layout="total,prev, pager, next,jumper" :total="total"
                @current-change="pageChange" />
        </el-card>

        <!-- 修改用户信息模态框 -->
        <el-dialog v-model="dialogVisible" title="编辑用户" width="500">
            <el-form style="max-width: 600px" :model="userForm" label-width="auto" class="demo-ruleForm" status-icon
                :rules="addUserRules">
                <el-form-item label="用户ID" prop="userid">
                    <el-input v-model="userForm.userid" disabled />
                </el-form-item>
                <el-form-item label="姓名" prop="username">
                    <el-input v-model="userForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="userForm.password" type="password" />
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
                <el-form-item label="权限" prop="role">
                    <el-radio-group v-model="userForm.role">
                        <el-radio-button label="管理员" value="9" />
                        <el-radio-button label="社长" value="1" />
                        <el-radio-button label="用户" value="0" />
                    </el-radio-group>
                </el-form-item>
            </el-form>

            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="userEditConfirm(userForm)">
                        确认修改
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="deleteDialog" title="警告！" width="500">
            <span>批量用户将被永久删除，是否继续？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="deleteDialog = false">取消</el-button>
                    <el-button type="danger" @click="multipleDelete">
                        继续删除
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, onMounted, reactive } from 'vue';
import axios from 'axios'
import { Delete, Warning } from '@element-plus/icons-vue'
import instituteMajor from '@/assets/instituteMajor.js'
import { ElMessage } from 'element-plus'

const tableData = ref([])
const dialogVisible = ref(false)
const userForm = ref({
    userid: '',
    username: '',
    password: '',
    gender: '',
    profile: '',
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
    },
    {
        label: "保密",
        value: -1
    },
]
// 分页查询
var total = ref(0)
var currentPage = ref(1)
const pageChange = () => {
    if (Object.values(filterUserForm).every(item => item == "")) {
        getUserList(currentPage.value)
    } else {
        userFilter(filterUserForm, currentPage.value)
    }
}

// 获取所有用户信息
onMounted(() => {
    getUserList(1)
})
const getUserList = async (page) => {
    await axios.get(`/adminapi/users/userlist/${page}`).then(res => {
        tableData.value = res.data.data
        total.value = res.data.total
    })
}

// 编辑用户弹出编辑模态框
const userEdit = async (user) => {
    dialogVisible.value = true
    await axios.post(`/adminapi/users/userlist`, {
        userid: user.userid
    }).then(res => {
        userForm.value = res.data.data[0]
    })
}
// 确认用户修改提交表单
const userEditConfirm = async (userForm) => {
    await axios.put(`/adminapi/users/userlist/${userForm.userid}`, userForm).then(res => {
        if (res.data.ActionType == 'NO') {
            ElMessage.error("修改失败！")
            return
        }
    })
    dialogVisible.value = false
    await getUserList(currentPage.value)
    ElMessage.success("修改成功！")
}
// 删除用户
const userDelete = (user) => {
    axios.delete(`/adminapi/users/userlist/${user.userid}`).then(res => {
        getUserList()
    })
}

// 用户列表筛选
const filterUserForm = reactive({
    userid: '',
    username: '',
    gender: '',
    institute: '',
    major: ''
})
const userFilter = async (userForm, value) => {
    var obj = {}
    if (!value) {                         // 如果是筛选，查询结果，第一次没有传页数
        value = 1                       // 给定页数为第一页
        currentPage.value = 1           // 将当前页改成第一页
    }
    for (var i in userForm) {
        if (userForm[i] !== "") {
            obj[i] = userForm[i]
        }
    }
    await axios.get('/adminapi/users/userlist', {params:{obj,page:value}}).then(res => {
        console.log(res)
        if (res.data.ActionType === 'OK') {
            tableData.value = res.data.data
            total.value = res.data.total
        } else {
            ElMessage.error("未找到符合条件的用户！")
        }
    })
}
// 清除筛选
const filterRemove = () => {
    for (var i in filterUserForm) {
        filterUserForm[i] = ''
    }
    currentPage.value = 1
    getUserList(1)
}

// 批量删除
const multipleTableRef = ref()
const deleteDialog = ref(false)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
  multipleSelection.value = val
}
const multipleDelete = async () => {
    axios.delete('/adminapi/users/userlist',{
        params:{users:multipleSelection.value}
    }).then(res=>{
        ElMessage({
            message: res.data.ActionType=='OK' ? '批量删除成功' : '删除失败',
            type: res.data.ActionType=='OK' ? 'success' : 'error'
        })
        deleteDialog.value = false
        currentPage.value = 1
        getUserList(currentPage.value)
    })
}
</script>

<style scoped lang="scss">
.showInfo {
    color: rgb(170, 170, 170);
    cursor: pointer;

    &:hover {
        color: rgb(65, 158, 255);
    }
}

.userSearch {
    display: flex;

    .el-input {
        margin: 0 10px;
    }

    .el-select {
        width: 180px;
        margin-right: 10px;
    }
}

.userlist {
    margin-top: 0;
    margin-bottom: 0;
    padding-bottom: 0 !important;
}

.el-pagination {
    height: 40px;
}
</style>