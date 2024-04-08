<template>
    <div>
        <el-page-header icon="" title="社团管理系统" content="公告通知"></el-page-header>
        <el-card class="noticePannel">
            <div class="search">
                <el-input v-model="keyWord" style="width: 240px" placeholder="输入关键字查询" :prefix-icon="Search" />
                <el-button type="primary" round :icon="Search" @click="handleSearch(1)">查询</el-button>
                <el-button type="default" plain round @click="() => { keyWord = ''; getNoticeList(1) }">重置</el-button>
            </div>
            <div class="add">
                <el-button type="primary" @click="addDialog = true">
                    <el-icon>
                        <Plus />
                    </el-icon>
                    <span>新增</span>
                </el-button>
                <el-button type="danger" plain @click="showDeleteDialog">批量删除</el-button>
            </div>
        </el-card>
        <el-card class="noticeList">
            <el-table :data="tableData" style="width: 100%" ref="multipleTableRef"
                @selection-change="handleSelectionChange">
                <el-table-column type="selection" width="30" />
                <el-table-column prop="notice_id" label="序号" width="80" sortable>
                </el-table-column>
                <el-table-column prop="notice_title" label="标题">
                    <template #default="scope">
                        <div v-html="highLightKeyWords(scope.row.notice_title)"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="notice_content" label="内容">
                    <template #default="scope">
                        <div v-html="highLightKeyWords(scope.row.notice_content)"></div>
                    </template>
                </el-table-column>
                <el-table-column prop="notice_time" label="编辑时间">
                </el-table-column>
                <el-table-column prop="username" label="创建人">
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" round plain :icon="Edit" @click="editNotice(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除?" :icon="Warning" icon-color="#ff0000" confirm-button-text="删除"
                            cancel-button-text="取消" confirm-button-type="danger" @confirm="noticeDelete(scope.row)">
                            <template #reference>
                                <el-button type="danger" round :icon="Delete">删除</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" layout="total,prev, pager, next" :total="total"
                @current-change="pageChange" />
        </el-card>

        <!-- 删除模态框 -->
        <el-dialog v-model="deleteDialog" title="警告！" width="500">
            <span>您选中的信息将被永久删除，是否继续？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="deleteDialog = false">取消</el-button>
                    <el-button type="danger" @click="multipleDelete">
                        继续删除
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 添加模态框 -->
        <el-dialog v-model="addDialog" title="新增通知" width="500" :before-close="handleClose">
            <el-form :model="noticeForm" label-width="auto" style="max-width: 600px" :rules="noticeRules" status-icon>
                <el-form-item label="创建人" prop="creator">
                    <el-input :value="noticeForm.creator" :prefix-icon="UserFilled" disabled />
                </el-form-item>
                <el-form-item label="标题" prop="notice_title">
                    <el-input v-model="noticeForm.notice_title" maxlength="20" placeholder="请输入标题" show-word-limit
                        clearable :prefix-icon="Collection" />
                </el-form-item>
                <el-form-item label="内容" prop="notice_content">
                    <el-input v-model="noticeForm.notice_content" type="textarea" placeholder="请输入内容" maxlength="100"
                        show-word-limit :rows="10" class="content" resize="none" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addDialog = false">取消</el-button>
                    <el-button type="primary" @click="noticeAdd(noticeForm)">
                        添加
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑模态框 -->
        <el-dialog v-model="editDialog" title="修改通知" width="500">
            <el-form :model="editNoticeForm" label-width="auto" style="max-width: 600px" :rules="noticeRules"
                status-icon>
                <el-form-item label="创建人" prop="creator">
                    <el-input :value="editNoticeForm.creator" :prefix-icon="UserFilled" disabled />
                </el-form-item>
                <el-form-item label="标题" prop="notice_title">
                    <el-input v-model="editNoticeForm.notice_title" maxlength="20" placeholder="请输入标题" show-word-limit
                        clearable :prefix-icon="Collection" />
                </el-form-item>
                <el-form-item label="内容" prop="notice_content">
                    <el-input v-model="editNoticeForm.notice_content" type="textarea" placeholder="请输入内容"
                        maxlength="100" show-word-limit :rows="10" class="content" resize="none" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addDialog = false">取消</el-button>
                    <el-button type="primary" @click="noticeUpdate(editNoticeForm)">
                        修改
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import axios from 'axios'
import { Delete, Warning, Search, Plus, Collection, UserFilled, Edit } from '@element-plus/icons-vue'
import { onMounted, ref, reactive } from 'vue'
import { ElMessage, ElNotification } from 'element-plus'
import getDateTime from '@/utils/getDateTime'
import { useHomeStore } from '@/stores/home'
const store = useHomeStore()

// 分页查询
const tableData = ref([])
var total = ref(0)
var currentPage = ref(1)
const pageChange = () => {
    if (keyWord.value) {
        noticeSearch(currentPage.value)
    } else {
        getNoticeList(currentPage.value)
    }
}

// 获取所有公告信息
onMounted(() => {
    getNoticeList(1)
})
const getNoticeList = async (page) => {
    await axios.get(`/adminapi/notices/noticelist/page/${page}`).then(res => {
        tableData.value = res.data.data
        total.value = res.data.total
    })
}

// 删除公告
const noticeDelete = (notice) => {
    axios.delete(`/adminapi/notices/deletenotice/${notice.notice_id}`).then(res => {
        if (res.data.ActionType == "OK") {
            ElMessage.success("删除成功！")
        } else {
            ElMessage.error("删除失败，服务器出错！")
        }
        getNoticeList(currentPage.value)
    })
}

// 批量删除
const multipleTableRef = ref()
const deleteDialog = ref(false)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}
const showDeleteDialog = () => {
    if (multipleSelection.value.length == 0) {
        ElMessage.error("您并未选择任何用户！")
        return
    } else {
        deleteDialog.value = true
    }
}
const multipleDelete = async () => {
    axios.delete('/adminapi/notices/deletenotices', {
        params: { notices: multipleSelection.value }
    }).then(res => {
        ElMessage({
            message: res.data.ActionType == 'OK' ? '批量删除成功' : '删除失败',
            type: res.data.ActionType == 'OK' ? 'success' : 'error'
        })
        deleteDialog.value = false
        currentPage.value = 1
        getNoticeList(1)
    })
}

// 关键字查询
const keyWord = ref('')
const handleSearch = (page) => {
    axios.get(`/adminapi/notices/noticelist/search`, { params: { keyWord: keyWord.value, page: page } }).then(res => {
        if (res.data.data) {
            tableData.value = res.data.data
            total.value = res.data.total
        } else {
            tableData.value = []
        }
    })
}
// 将搜索结果包含的关键词高亮显示
function highLightKeyWords(text) {
    const reg = new RegExp(keyWord.value, 'gi')
    text = text.replace(reg, match => `<span class="highLight">${match}</span>`)
    return text
}

// 添加通知
const addDialog = ref(false)
const noticeForm = reactive({
    notice_title: '',
    notice_content: '',
    creator: store.userInfo.userid,
    notice_time: ''
})
const noticeRules = reactive({
    notice_title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    notice_content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ]
})

const noticeAdd = (noticeForm) => {
    if (noticeForm.notice_title && noticeForm.notice_content) {
        noticeForm.notice_time = getDateTime.dateTime()
        axios.post('/adminapi/notices/addnotice', noticeForm).then(res => {
            if (res.data.ActionType == "OK") {
                ElMessage.success("添加成功！")
            } else {
                ElMessage.error("添加失败，服务器出错！")
            }
            addDialog.value = false
            currentPage.value = 1
            getNoticeList(1)
        })
    }
}

// 修改通知
const editDialog = ref(false)
const editNoticeForm = reactive({})
const editNotice = (form) => {
    editDialog.value = true
    for (var i in form) {
        editNoticeForm[i] = form[i]
    }
}
const noticeUpdate = async () => {
    editNoticeForm.notice_time = getDateTime.dateTime()
    let res = await axios.put('/adminapi/notices/updatenotice', editNoticeForm)
    ElNotification({
        title: res.data.ActionType == 'OK' ? '修改成功！' : '修改失败！',
        message: res.data.ActionType == 'OK' ? '公告通知修改成功' : '服务器出错，修改失败',
        type: res.data.ActionType == 'OK' ? 'success' : 'error'
    })
    editDialog.value = false
    getNoticeList(currentPage.value)
}
</script>

<style lang='scss' scoped>
:deep(.highLight) {
    color: rgb(64, 158, 255);
    font-weight: bold;
}

.noticeList {
    margin: 0;

    .el-card__body {
        padding: 20px 0 0 20px;
    }

    .el-table {
        height: 440px;
        overflow-y: scroll;

        thead tr th {
            text-align: center;
        }

        tbody tr td {
            text-align: center;
        }
    }
}

.noticePannel {
    margin-bottom: 0;
    margin-top: 10px;
    background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));

    .search {
        .el-button {
            margin-left: 10px
        }
    }

    .add {
        margin-top: 10px;
    }
}
</style>