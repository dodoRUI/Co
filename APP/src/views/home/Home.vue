<template>
    <div>
        <el-page-header icon="" title="社团管理系统" content="首页"></el-page-header>

        <el-card shadow="always" class="box-card">
            <el-row>
                <el-col :span="4">
                    <el-avatar :size="140" :src="avatarUrl" />
                </el-col>
                <el-col :span="20">
                    <h3 style="line-height: 178px;">欢迎回来，{{ store.userInfo.username }}</h3>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<script setup>
import { useHomeStore } from '@/stores/home';
import { computed } from 'vue';

const store = useHomeStore()
const avatarUrl = computed(()=>store.userInfo.avatar ? 'http://localhost:3000'+store.userInfo.avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png')

</script>

<style lang="scss">

.el-card{
    margin-top: 20px;
    .el-avatar{
        margin-left: 20px;
    }
}
</style>