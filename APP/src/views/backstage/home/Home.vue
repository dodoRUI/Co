<template>
    <div>
        <el-page-header icon="" title="社团管理系统" content="首页"></el-page-header>

        <el-card shadow="always" class="box-card">
            <el-avatar :size="140" :src="avatarUrl" />
            <h3 style="line-height: 178px;">
                欢迎回来，{{ store.userInfo.username }} |
                您有 <span class="applyNum" @click="gotoApply">{{ applyNum }}</span> 条申请待处理
                <el-button type="" plain round @click="gotoApply">点击处理</el-button>
            </h3>
        </el-card>
        <el-card class="timelinecard">
            <div class="timeline">
                <el-timeline>
                    <el-timeline-item v-for="(notice, index) in notices" :key="index" :timestamp="notice.notice_time"
                        :color="'rgb(64,158,255)'">
                        <div>
                            <div class="title">{{ notice.notice_title }}</div>
                            <div class="content">{{ notice.notice_content }}</div>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </div>

        </el-card>
    </div>
</template>

<script setup>
import { useHomeStore } from '@/stores/home';
import { computed, onMounted, ref } from 'vue';
import { MoreFilled } from '@element-plus/icons-vue'
import axios from "axios"
import { useRouter } from 'vue-router'

const router = useRouter()
const store = useHomeStore()
const avatarUrl = computed(() => store.userInfo.avatar ? 'http://localhost:3000' + store.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')


const notices = ref([])
const applyNum = ref(0)
onMounted(() => {
    getNoticeList()
    getApplyNum()
})

// 获取系统公告
const getNoticeList = () => {
    axios.get('/adminapi/notices/noticelist').then(res => {
        notices.value = res.data.data
    })
}
// 获取申请数量
const getApplyNum = () => {
    axios.get('/adminapi/clubs/applications/applynum', { params: store.userInfo }).then(res => {
        applyNum.value = res.data.data.num
    })
}

// 跳转到申请审批页面
const gotoApply = () => {
    router.push('/backstage/club/applyconfirm')
}
</script>

<style lang="scss">
.el-card {
    margin-top: 20px;
}

.box-card {
    margin-top: 10px;
    border-radius: 20px !important;

    .el-button {
        background-color: rgba(255, 255, 255, 0.1);
        border-color: white;
        color: white;

        &:hover {
            background-color: rgba(255, 255, 255, 0);
            border-color: rgb(64, 158, 255);
            color: rgb(64, 158, 255);
        }
    }

    .el-card__body {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        padding: 20px;
        user-select: none;
        background-image: linear-gradient(30deg, rgba(64, 158, 255, 0.3), rgba(85, 231, 252, 0.3), rgba(123, 90, 255, 0.2), rgba(255, 91, 181, 0.2));
        background-size: 200%;
        animation: bgMove 10s infinite;

        @keyframes bgMove {
            0% {
                background-position: left top
            }

            25% {
                background-position: right bottom
            }

            50% {
                background-position: right top
            }

            75% {
                background-position: left bottom
            }

            100% {
                background-position: left top
            }
        }

        .el-avatar {
            margin-left: 20px;
            box-sizing: content-box;
            border: 2px solid white;
        }

        h3 {
            margin-left: 40px;

            .el-button {
                margin-left: 20px;
            }

            .applyNum {
                color: rgb(64, 158, 255);

                &:hover {
                    color: rgb(138, 196, 255);
                    cursor: pointer;
                    border-bottom: 2px solid rgb(138, 196, 255);
                }
            }
        }
    }
}

.timelinecard {
    border-radius: 20px !important;

    .el-card__body {
        padding: 20px 0 0 20px;
        border-radius: 20px;
    }

    .timeline {
        height: 380px;
        overflow: scroll;

        &::-webkit-scrollbar {
            width: 5px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            width: 10px;
            background: linear-gradient(15deg, rgba(64, 158, 255, 0.5), rgba(85, 231, 252, 0.5));
            border-radius: 5px;
        }

        .el-timeline {
            margin-left: 10px;

            .el-timeline-item {
                div {
                    .title {
                        font-size: 16px;
                        font-weight: bold;
                    }

                    .content {
                        margin-top: 5px;
                        font-size: 14px;
                    }

                    &:hover {
                        color: rgb(64, 158, 255);
                    }
                }
            }
        }
    }
}
</style>