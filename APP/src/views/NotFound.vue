<template>
    <div>
        <el-empty image-size="300" description="No Data">
            <el-button type="primary" @click="()=>{router.push('/home')}">返回首页</el-button>
        </el-empty>
    </div>
</template>

<script setup>
    import {useRouter} from 'vue-router'
    const router = useRouter()
</script>

<style scoped>
    .el-empty {
        user-select: none;
    }
</style>