<template>
    <div>
        <el-page-header icon="" title="社团管理系统" content="首页"></el-page-header>

        <el-card shadow="always" class="box-card">
            <el-avatar :size="140" :src="avatarUrl" />
            <h3 style="line-height: 178px;">
                欢迎回来，{{ store.userInfo.username }} |
                您有 <span>12</span> 条申请待处理
                <el-button type="primary" plain round>点击处理</el-button>
            </h3>
        </el-card>
        <el-card>
            <el-scrollbar height="350px">
                <el-timeline>
                    <el-timeline-item v-for="(notice, index) in notices" :key="index" :timestamp="notice.notice_time"
                        :color="'rgb(64,158,255)'">
                        <div>
                            <div class="title">{{ notice.notice_title }}</div>
                            <div class="content">{{ notice.notice_content }}</div>
                        </div>
                    </el-timeline-item>
                </el-timeline>
            </el-scrollbar>
        </el-card>
    </div>
</template>

<script setup>
import { useHomeStore } from '@/stores/home';
import { computed, onMounted, ref } from 'vue';
import { MoreFilled } from '@element-plus/icons-vue'
import axios from "axios"

const store = useHomeStore()
const avatarUrl = computed(() => store.userInfo.avatar ? 'http://localhost:3000' + store.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

// 获取系统公告
const notices = ref([])
onMounted(() => {
    axios.get('/adminapi/noticelist').then(res => {
        notices.value = res.data.data
    })
})

</script>

<style lang="scss">
.el-card {
    margin-top: 20px;
}

.box-card .el-card__body {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 20px;
    background: linear-gradient(-45deg, rgba(64,158,255,0.2), rgba(85,231,252,0.2));
    user-select: none;

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
    }
}

.el-timeline {
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
</style>