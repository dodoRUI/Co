<template>
    <div>
        <el-page-header icon="" title="社团管理" content="申请审批"></el-page-header>
        <el-card class="filterPannel">
            <div class="search">
                <el-input v-model="applyUser" style="width: 240px" placeholder="申请人" :prefix-icon="Search" />
                <el-select v-model="applyClub" filterable placeholder="只显示该社团申请" v-if="store.userInfo.role == 9">
                    <el-option label="全部" value="">全部</el-option>
                    <el-option v-for="item in clubs" :key="item.club_name" :label="item.club_name"
                        :value="item.club_name" />
                </el-select>
            </div>
        </el-card>
        <el-card class="tablePannel">
            <el-table :data="tableDataBck" style="width: 100%" ref="multipleTableRef" stripe
                class="applylist custom-loading-svg">
                <el-table-column prop="apply_user" label="申请人学号" width="120">
                </el-table-column>
                <el-table-column prop="username" label="申请人" width="120">
                    <template #default="scope">
                        <div class="username">{{ scope.row.username }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="club_name" label="社团" width="200">
                    <template #default="scope">
                        <div class="clubname">{{ scope.row.club_name }}</div>
                    </template>
                </el-table-column>
                <el-table-column prop="apply_text" label="申请说明" width="200">
                    <template #default="scope">
                        <div class="applytext">
                            <el-popover placement="left" title="申请说明" :width="250" trigger="hover"
                                :content="scope.row.apply_text">
                                <template #reference>
                                    <div class="shortcut">
                                        {{ scope.row.apply_text }}
                                    </div>
                                </template>
                            </el-popover>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column prop="apply_time" label="申请时间" width="120">
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" plain round @click="acceptMember(scope.row)"
                            :icon="Select">同意</el-button>
                        <el-popconfirm title="拒绝加入社团？" icon-color="red" confirm-button-type="danger"
                            confirm-button-text="拒绝" cancel-button-text="取消" :hide-after="0"
                            @confirm="refuseMember(scope.row)">
                            <template #reference>
                                <el-button type="danger" plain round :icon="CloseBold">拒绝</el-button>
                            </template>
                        </el-popconfirm>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { Delete, Check, Search, Select, CloseBold } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import getDateTime from '@/utils/getDateTime'
import axios from 'axios'
import { useHomeStore } from '@/stores/home'
import { useRouter } from 'vue-router'

const store = useHomeStore()

onMounted(async () => {
    getApplyData()
    getClubNames()
})
// 获取社团名称
const clubs = ref([])
const getClubNames = async () => {
    let res = await axios.get('/adminapi/activities/clubnames')
    clubs.value = res.data.data
}

// 获取申请信息
const tableData = ref([])
const getApplyData = async () => {
    const res = await axios.get('/adminapi/clubs/applications', { params: store.userInfo })
    if (res.data.success) {
        tableData.value = res.data.data
    } else {
        ElMessage.error(res.data.message)
    }
}

// 申请筛选
const applyUser = ref('')
const applyClub = ref('')
const tableDataBck = computed(() => {
    return tableData.value.filter(item => item.club_name.includes(applyClub.value) && (item.apply_user.includes(applyUser.value) || item.username.includes(applyUser.value)))
})


// 同意申请
const acceptMember = async (apply) => {
    apply.join_time = getDateTime.date()
    const res = await axios.post('/adminapi/clubs/applications/accept', apply)
    ElNotification({
        title: res.data.success ? '成功' : '失败',
        message: res.data.success ? `${apply.username} 成功加入${apply.club_name}` : res.data.message,
        type: res.data.success ? 'success' : 'error'
    })
    getApplyData()
}

// 拒绝申请
const refuseMember = async (apply) => {
    const res = await axios.post('/adminapi/clubs/applications/refuse', apply)
    ElNotification({
        title: res.data.success ? '成功' : '失败',
        message: res.data.success ? `已拒绝 ${apply.username} 加入 ${apply.club_name}` : res.data.message,
        type: res.data.success ? 'success' : 'error'
    })
    getApplyData()

}
</script>

<style lang="scss" scoped>
.filterPannel {
    margin-top: 10px;

    :deep(.el-card__body) {
        background: linear-gradient(-45deg, rgba(64, 158, 255, 0.2), rgba(85, 231, 252, 0.2));
    }

    .el-input {
        width: 200px;

        :deep(.el-input__wrapper) {
            border-radius: 30px;
        }
    }

    .el-select {
        width: 200px;
        margin-left: 10px;

        :deep(.el-select__wrapper) {
            border-radius: 30px;
        }
    }
}

.tablePannel {
    margin-top: 0px;

    :deep(.el-card__body) {
        padding-bottom: 5px;
    }

    .applylist {
        height: 540px;
        overflow-y: scroll;

        :deep(thead tr th) {
            text-align: center;
        }

        :deep(tbody tr td) {
            text-align: center;
        }

        .username {
            font-weight: bold;
        }

        .clubname {
            color: rgb(64, 158, 255);
            font-weight: bold;
        }

        .applytext {
            height: 32px;
            width: 200px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;

            .shortcut {
                cursor: pointer;

                &:hover {
                    color: rgb(64, 158, 255);
                }
            }
        }
    }
}
</style>