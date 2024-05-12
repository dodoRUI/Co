<template>
    <div>
        <el-page-header icon="" title="活动中心" content="活动审核"></el-page-header>
        <el-card class="filterPannel">
            <div class="search">
                <el-input v-model="actvtFilterForm.activity_name" style="width: 240px" placeholder="活动名称"
                    :prefix-icon="Search" />
                <el-button type="primary" round :icon="Search" @click="actvtFilter(actvtFilterForm)">查询</el-button>
                <el-button type="default" plain round @click="reset">清除</el-button>
                <el-select v-model="actvtFilterForm.activity_club" filterable placeholder="只显示该社团活动"
                    v-if="store.userInfo.role == 9">
                    <el-option v-for="item in clubs" :key="item.club_name" :label="item.club_name"
                        :value="item.club_id" />
                </el-select>
                <el-date-picker v-model="actvtFilterForm.activity_start" type="date" placeholder="只显示该日期以内的活动"
                    :disabled-date="disabledDate" :shortcuts="shortcuts" :size="size" />
            </div>
        </el-card>
        <el-card class="actvtList">
            <el-table :data="tableData" style="width: 100%" ref="multipleTableRef" stripe>
                <el-table-column prop="activity_id" label="活动编号" sortable width="120">
                </el-table-column>
                <el-table-column prop="activity_name" label="活动名称">
                    <template #default="scope">
                        <span class="activityName" @click="showDetail(scope.row)">{{ scope.row.activity_name }}</span>
                    </template>
                </el-table-column>
                <el-table-column prop="club_name" label="社团名称" width="200">
                    <template #default="scope">
                        <el-button size="small" round @click="gotoClub(scope.row.club_id)">{{ scope.row.club_name
                            }}</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="activity_start" label="开始时间">
                    <template #default="scope">
                        <div>{{ scope.row.activity_start.split(' ')[0] }}</div>
                        <div>{{ scope.row.activity_start.split(' ')[1] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="activity_end" label="结束时间">
                    <template #default="scope">
                        <div>{{ scope.row.activity_end.split(' ')[0] }}</div>
                        <div>{{ scope.row.activity_end.split(' ')[1] }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="activity_place" label="活动地点">
                </el-table-column>
                <el-table-column label="操作" width="300px">
                    <template #default="scope">
                        <div v-if="scope.row.permission===0">
                            <el-button type="success" plain round @click="actvtCheck(scope.row.activity_id,true)"
                                :icon="Check">通过</el-button>
                            <el-popconfirm title="确认驳回申请?" :icon="Warning" icon-color="#ff0000" confirm-button-text="确认"
                                cancel-button-text="取消" confirm-button-type="danger" @confirm="actvtCheck(scope.row.activity_id,false)">
                                <template #reference>
                                    <el-button type="danger" round plain :icon="Close">驳回</el-button>
                                </template>
                            </el-popconfirm>
                        </div>
                        <div v-else>
                            <el-tag :type="scope.row.permission===1?'primary':'danger'">{{ scope.row.permission===1?'已通过':'已驳回' }}</el-tag>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination v-model:current-page="currentPage" layout="total,prev, pager, next,jumper ,sizes"
                :total="total" @current-change="pageChange" v-model:page-size="pageSize" :page-sizes="[5, 10, 15, 20]"
                @size-change="sizeChange" />
        </el-card>

        <el-drawer v-model="actvtDetail" :with-header="false" direction="rtl" class="actvtDetail">
            <div class="container">
                <div class="poster">
                    <img
                        :src="actvtDetailForm.activity_poster ? 'http://localhost:3000' + actvtDetailForm.activity_poster : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                </div>
                <div class="detail">
                    <div v-html="actvtDetailForm.activity_content"></div>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { Delete, List, Search, Check, Close } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import axios from 'axios'
import { useHomeStore } from '@/stores/home'
import { useRouter } from 'vue-router'

const router = useRouter()

const store = useHomeStore()
onMounted(async () => {
    getActvtList(currentPage.value, pageSize.value)
    getClubNames()
})

// 分页查询
var total = ref(0)
var currentPage = ref(1)
var pageSize = ref(10)
const tableData = ref([])
const pageChange = () => {
    if (Object.values(actvtFilterForm).every(item => item == "")) {
        getActvtList(currentPage.value, pageSize.value)
    } else {
        actvtFilter(actvtFilterForm, currentPage.value, pageSize.value)
    }
}
const sizeChange = () => {
    if (Object.values(actvtFilterForm).every(item => item == "")) {
        getActvtList(currentPage.value, pageSize.value)
    } else {
        actvtFilter(actvtFilterForm, 1, pageSize.value)
    }
}

// 获取所有审核活动
const getActvtList = async (page, size) => {
    const club_id = store.userInfo.role == 9 ? '' : store.userInfo.club_id
    let res = await axios.get(`/adminapi/activities/list`, { params: { club_id, page, size, permit: false } })
    tableData.value = res.data.data
    total.value = res.data.total
}

// 筛选
const actvtFilterForm = reactive({
    activity_name: '',
    activity_club: '',
    activity_start: ''
})
const actvtFilter = async (form, page, size) => {
    if (!page && !size) {
        currentPage.value = page = 1
        size = pageSize.value
    }
    const club_id = store.userInfo.role == 1 ? store.userInfo.club_id : ''
    let res = await axios.get(`/adminapi/activities/filter`, { params: { form, page, size, club_id, permit: false } })
    tableData.value = res.data.data
    total.value = res.data.total
    if (!total.value) {
        ElMessage.error('未找到相关活动')
    }
}

// 清除筛选
const reset = () => {
    actvtFilterForm.activity_name = actvtFilterForm.activity_club = actvtFilterForm.activity_start = ''
    getActvtList(1, pageSize.value)
}

// 获取社团名称
const clubs = ref([])
const getClubNames = async () => {
    let res = await axios.get('/adminapi/activities/clubnames')
    clubs.value = res.data.data
}
const shortcuts = [
    { text: '今天', value: new Date() },
    {
        text: '未来一周', value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 7)
            return date
        }
    },
    {
        text: '未来一月', value: () => {
            const date = new Date()
            date.setTime(date.getTime() + 3600 * 1000 * 24 * 30)
            return date
        }
    }
]

// 活动审核
const actvtCheck = async (id,permission) => {
    const res = await axios.put('/adminapi/activities/check', {id,permission})
    if(res.data.success){
        ElNotification({
            title: '操作成功',
            message: res.data.message,
            type: 'success'
        })
    }else{
        ElNotification({
            title: '失败',
            message: '服务器出错，请稍后再试',
            type: 'error'
        })
    }
    getActvtList(currentPage.value, pageSize.value)
}

// 显示活动详情
const actvtDetail = ref(false)
const actvtDetailForm = reactive({})
const showDetail = (actvt) => {
    actvtDetail.value = true
    for (var i in actvt) {
        actvtDetailForm[i] = actvt[i]
    }
}

const gotoClub = (id) => {
    router.push({ path: '/backstage/club/clubinfo', query: { club_id: id } })
}
</script>

<style lang="scss" scoped>
.filterPannel {
    margin-top: 10px;
    background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));
}

.search {
    .el-input {
        margin-right: 10px;

        :deep(.el-input__wrapper) {
            border-radius: 40px;
        }
    }

    .el-select {
        width: 200px;
        margin: 0 20px;
        border-radius: 20px;

        :deep(.el-select__wrapper) {
            border-radius: 20px;
        }
    }
}

.actvtList {
    margin-top: 0;

    :deep(.el-card__body) {
        padding-bottom: 5px;
    }

    .el-table {
        height: 510px;
        overflow-y: scroll;

        :deep(thead tr th) {
            text-align: center;
        }

        :deep(tbody tr td) {
            text-align: center;
        }

        .activityName {
            cursor: pointer;
            font-weight: bold;

            &:hover {
                color: rgb(64, 158, 255);
            }
        }
    }
}

:deep(.actvtDetail) {
    box-shadow: none !important;
    position: absolute;
    width: 840px !important;
    background: transparent !important;

    .container {
        width: 800px;
        height: 600px;
        background-color: white;
        display: flex;
        margin-top: 50px;
        border-radius: 20px;
        overflow: hidden;

        .poster {
            height: 600px;
            width: 400px;
            position: relative;

            img {
                width: 100%;
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                object-fit: cover;
            }
        }

        .detail {
            width: 400px;
            height: 600px;
            overflow-y: scroll;
            overflow-x: hidden;

            ol,
            ul {
                li {
                    margin-left: 20px;
                }
            }

            div {
                box-sizing: border-box;
                width: 400px;
                padding: 20px;
                word-wrap: break-word;
                font-size: 14px;
            }

            &::-webkit-scrollbar {
                width: 0px;
            }
        }
    }

}
</style>