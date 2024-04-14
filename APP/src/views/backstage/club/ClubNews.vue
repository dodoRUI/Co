<template>
    <div>
        <el-page-header icon="" title="社团管理" content="社团资讯"></el-page-header>

        <el-card class="filtercard">
            <div class="search">
                <el-input v-model="news.keyword" style="width: 240px" placeholder="搜索关键字" :prefix-icon="Search" />
                <el-button type="primary" round @click="filterNews(news)">搜索</el-button>
                <el-button round @click="resetNews(news)">重置</el-button>
                <el-select v-model="news.club" filterable placeholder="只显示该社团新闻" v-if="store.userInfo.role == 9">
                    <el-option v-for="item in clubs" :key="item.club_name" :label="item.club_name"
                        :value="item.club_id" />
                </el-select>
            </div>
            <div style="margin-top: 10px;">
                <el-button type="primary" :icon="Plus" round @click="() => { addNewsDialog = true }">新增</el-button>
                <el-button round type="danger" @click="showDeleteDialog">批量删除</el-button>
            </div>
        </el-card>
        <el-card class="tablePannel">
            <el-table :data="newsData" style="width: 100%" :cell-style="{ padding: '0px' }"
                :row-style="{ height: '50px' }" ref="multipleTableRef" @selection-change="handleSelectionChange"
                class="newslist">
                <el-table-column type="selection" width="30" />
                <el-table-column prop="news_id" label="编号" sortable width="80">
                </el-table-column>
                <el-table-column prop="news_title" label="新闻标题" width="300">
                </el-table-column>
                <el-table-column prop="news_content" label="新闻内容">
                    <template #default="scope">
                        <el-button round type="no" size="small" @click="showContent(scope.row)">查看内容</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="club_name" label="社团名称">
                </el-table-column>
                <el-table-column prop="edit_time" label="编辑时间">
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" plain round @click="showEditDialog(scope.row)">编辑</el-button>
                        <el-popconfirm title="确认删除" :icon="Warning" icon-color="rgb(255, 89, 89)"
                            confirm-button-text="删除" cancel-button-text="取消" confirm-button-type="danger"
                            @confirm="newsDelete(scope.row.news_id)">
                            <template #reference>
                                <el-button type="danger" circle :icon="Delete"></el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" layout="total,prev, pager, next,jumper ,sizes"
                :total="total" @current-change="pageChange" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                @size-change="sizeChange" />
        </el-card>

        <!-- 添加社团资讯模态框 -->
        <el-dialog v-model="addNewsDialog" title="添加社团资讯" width="700" :before-close="handleClose" top="0">
            <el-form ref="addNewsFormRef" :model="addNewsForm" label-width="auto" style="max-width: 600px"
                :rules="addNewsRules" status-icon>
                <el-form-item label="发布社团" prop="club">
                    <el-select v-model="addNewsForm.club" filterable :disabled="store.userInfo.role == 1"
                        placeholder="请选择发布社团">
                        <el-option v-for="item in clubs" :key="item.club_name" :label="item.club_name"
                            :value="item.club_id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="新闻标题" prop="title">
                    <el-input v-model="addNewsForm.title" maxlength="30" placeholder="请输入新闻标题" show-word-limit clearable
                        :prefix-icon="Collection" />
                </el-form-item>
                <el-form-item label="新闻内容" prop="content">
                    <editor :height="380" @text="handleChange" :clear="clear" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="addNewsDialog = false">取消</el-button>
                    <el-button type="primary" @click="newsAdd(addNewsFormRef)">
                        添加
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 编辑新闻模态框 -->
        <el-dialog v-model="editNewsDialog" title="编辑社团资讯" width="700" :before-close="editDialogClose" top="0">
            <el-form ref="editNewsFormRef" :model="editNewsForm" label-width="auto" style="max-width: 600px"
                :rules="editNewsRules" status-icon>
                <el-form-item label="发布社团" prop="club">
                    <el-select v-model="editNewsForm.club_id" filterable disabled placeholder="请选择发布社团">
                        <el-option v-for="item in clubs" :key="item.club_name" :label="item.club_name"
                            :value="item.club_id" />
                    </el-select>
                </el-form-item>
                <el-form-item label="新闻标题" prop="title">
                    <el-input v-model="editNewsForm.news_title" maxlength="30" placeholder="请输入新闻标题" show-word-limit
                        clearable :prefix-icon="Collection" />
                </el-form-item>
                <el-form-item label="新闻内容" prop="content">
                    <editor :height="380" @text="handleChangeEdit" :clear="clear"
                        :message="editNewsForm.news_content" />
                </el-form-item>
            </el-form>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="editNewsDialog = false">取消</el-button>
                    <el-button type="primary" @click="newsUpdate(editNewsFormRef)">
                        确认修改
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <!-- 查看资讯内容 -->
        <el-drawer v-model="drawer" direction="ltr" class="showcontent" :with-header="false">
            <div class="newstitle">
                {{ newsDetail.news_title }}
            </div>
            <div class="newscontent">
                <div v-html="newsDetail.news_content"></div>
            </div>
        </el-drawer>

        <!-- 批量删除 -->
        <el-dialog v-model="multipleDeleteDialog" title="警告！" width="500">
            <span>批量资讯将被永久删除，是否继续？</span>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="multipleDeleteDialog = false">取消</el-button>
                    <el-button type="danger" @click="multipleNewsDelete">
                        继续删除
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Delete, Search, Plus } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import getDateTime from '@/utils/getDateTime'
import axios from 'axios'
import { useHomeStore } from '@/stores/home'
import editor from '@/components/editor/editor.vue'


const store = useHomeStore()
onMounted(() => {
    getClubNames()
    getClubNews()
})

// 分页查询
var total = ref(0)
var currentPage = ref(1)
var pageSize = ref(10)
const pageChange = () => {
    if (Object.values(news).every(item => item == "")) {
        getClubNews(currentPage.value, pageSize.value)
    } else {
        filterNews(news, currentPage.value, pageSize.value)
    }
}
const sizeChange = () => {
    if (Object.values(news).every(item => item == "")) {
        getClubNews(currentPage.value, pageSize.value)
    } else {
        filterNews(news, 1, pageSize.value)
    }
}

// 获取社团资讯列表
const newsData = ref([])
const getClubNews = async (page = 1, size = 10) => {
    const clubid = store.userInfo.role == 1 ? store.userInfo.club_id : ''
    const res = await axios.get('/adminapi/clubs/clubnews/get', { params: { clubid, page, size } })
    newsData.value = res.data.data.list
    total.value = res.data.data.total
}
// 资讯筛选
const news = reactive({
    keyword: '',
    club: ''
})
const filterNews = async (news, page = 1, size = pageSize.value) => {
    if (!news.keyword && !news.club) {
        return
    }
    news.club = store.userInfo.role == 1 ? store.userInfo.club_id : news.club
    const res = await axios.get('/adminapi/clubs/clubnews/filter', { params: { ...news, page, size } })
    newsData.value = res.data.data.list
    total.value = res.data.data.total
}
// 清除筛选
const resetNews = (news) => {
    news.keyword = '',
        news.club = ''
    getClubNews()
}

// 获取社团名称
const clubs = ref([])
const getClubNames = async () => {
    let res = await axios.get('/adminapi/activities/clubnames')
    clubs.value = res.data.data
}

// 新增社团资讯
const addNewsDialog = ref(false)
const addNewsFormRef = ref()
const addNewsForm = reactive({
    title: '',
    content: '',
    time: '',
    club: store.userInfo.club_id ? +store.userInfo.club_id : '',
})
const addNewsRules = reactive({
    title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ]
})

// 获取富文本编辑器内容改变
const clear = ref(false)
const handleChange = (html) => {
    addNewsForm.content = html
    clear.value = false
}
const newsAdd = async (form) => {
    await form.validate(async (valid) => {
        if (valid) {
            addNewsForm.time = getDateTime.dateTime()
            const res = await axios.post('/adminapi/clubs/clubnews/add', addNewsForm)
            ElMessage({
                message: res.data.message,
                type: res.data.success ? 'success' : 'error'
            })
            addNewsDialog.value = false
            for (var i in addNewsForm) {
                addNewsForm[i] = ''
            }
            addNewsForm.club = +store.userInfo.club_id
            clear.value = true
        } else {
            ElMessage.error("必填项不能为空")
        }
    })
    getClubNews()
}

// 显示资讯内容
const drawer = ref(false)
const newsDetail = ref({})
const showContent = (news) => {
    drawer.value = true
    newsDetail.value = news
}


// 资讯编辑
const editNewsForm = reactive({
    news_id: '',
    news_title: '',
    news_content: '',
    edit_time: ''
})
const editNewsRules = reactive({
    news_title: [
        { required: true, message: '请输入标题', trigger: 'blur' }
    ],
    news_content: [
        { required: true, message: '请输入内容', trigger: 'blur' },
    ]
})
const handleChangeEdit = (html) => {
    editNewsForm.news_content = html
    clear.value = false
}
const editNewsDialog = ref(false)
const editNewsFormRef = ref()
const showEditDialog = (newsForm) => {
    for (var i in newsForm) {
        editNewsForm[i] = newsForm[i]
    }
    editNewsDialog.value = true
}
// 提交编辑新闻
const newsUpdate = async (form) => {
    await form.validate(async (valid) => {
        if (valid) {
            editNewsForm.time = getDateTime.dateTime()
            const res = await axios.put('/adminapi/clubs/clubnews/update', editNewsForm)
            ElNotification({
                title: res.data.success ? '操作成功' : '操作失败',
                message: res.data.message,
                type: res.data.success ? 'success' : 'error'
            })
            editNewsDialog.value = false
            for (var i in editNewsForm) {
                editNewsForm[i] = ''
            }
            clear.value = true
        } else {
            ElMessage.error("必填项不能为空")
        }
    })
    getClubNews()
}

// 删除新闻
const newsDelete = async (id) => {
    const res = await axios.delete(`/adminapi/clubs/clubnews/delete/${id}`)
    ElNotification({
        title: res.data.success ? '操作成功' : '操作失败',
        message: res.data.message,
        type: res.data.success ? 'success' : 'error'
    })
    getClubNews()
}

// 批量删除
const multipleTableRef = ref()
const multipleDeleteDialog = ref(false)
const multipleSelection = ref([])
const handleSelectionChange = (val) => {
    multipleSelection.value = val
}
const showDeleteDialog = () => {
    if (multipleSelection.value.length == 0) {
        ElMessage.error("您并未选择任何新闻！")
        return
    } else {
        multipleDeleteDialog.value = true
    }
}
const multipleNewsDelete = async () => {
    axios.delete('/adminapi/clubs/clubnews/delete', {
        params: { newslist: multipleSelection.value }
    }).then(res => {
        ElMessage({
            message: res.data.message,
            type: res.data.success ? 'success' : 'error'
        })
        multipleDeleteDialog.value = false
        currentPage.value = 1
        getClubNews(currentPage.value)
    })
}
</script>

<style lang="scss" scoped>
.el-dialog {
    margin-bottom: 0;
}

.filtercard {
    margin-top: 10px;

    :deep(.el-card__body) {
        padding-bottom: 10px;
        background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));
    }

    .search {
        .el-input {
            width: 200px;

            :deep(.el-input__wrapper) {
                border-radius: 30px;
            }
        }
        .el-button{
            margin-left: 10px;
        }

        .el-select{
            width: 200px;
            margin-left: 10px;
            :deep(.el-select__wrapper){
                border-radius: 30px;
            }
        }

    }
}

.tablePannel {
    margin-top: 0;
    :deep(.el-card__body) {
        padding-bottom: 5px;
    }

    .newslist {
        height: 480px;
        overflow-y: scroll;
        overflow-x: hidden;

        :deep(thead tr th) {
            text-align: center;
        }

        :deep(tbody tr td) {
            text-align: center;
        }
    }
}

:deep(.showcontent) {
    width: 500px !important;
    padding: 20px;
    background-color: transparent !important;
    box-shadow: none !important;

    ol,
    ul {
        li {
            margin-left: 20px;
        }
    }

    .el-drawer__body {
        overflow-y: auto;
        background: linear-gradient(-45deg, rgb(188, 221, 255), rgb(190, 252, 255));
        border-radius: 20px;

        &::-webkit-scrollbar {
            width: 0px;
            background-color: transparent;
        }
    }

    .newstitle {
        font-size: 20px;
        font-weight: bold;
        text-align: center;
        margin-bottom: 10px;
    }
}
</style>