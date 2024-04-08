<template>
    <div>
        <el-page-header icon="" title="社团管理" content="社团数据"></el-page-header>
        <el-card>
            <div class="headbar">
                <el-button round class="institute" @click="()=>{showData='allclubs'}">学院总体</el-button>
                <el-button-group class="ml-4">
                    <el-button type="primary" round plain @click="()=>{showData='members'}">
                        <i class="iconfont icon-hrcollegepeopleCardingRange"></i>成员数量
                    </el-button>
                    <el-button type="primary" plain @click="()=>{showData='popularclub'}">
                        <i class="iconfont icon-renqi"></i>点赞人气
                    </el-button>
                    <el-button type="primary" round plain @click="()=>{showData='actvts'}">
                        <i class="iconfont icon-huodong1"></i>活动次数
                    </el-button>
                </el-button-group>
            </div>
            <div class="data">
                <members v-if="showData == 'members'"/>
                <popularclub v-else-if="showData == 'popularclub'"/>
                <actvts v-else-if="showData == 'actvts'"/>
                <allclubs v-else/>
            </div>
        </el-card>
    </div>
</template>

<script setup>
import { Star, Share, Delete } from '@element-plus/icons-vue'
import {ref} from 'vue'
import  members from '@/components/clubstatistics/Members.vue'
import  allclubs from '@/components/clubstatistics/AllClubs.vue'
import  popularclub from '@/components/clubstatistics/PopularClub.vue'
import  actvts from '@/components/clubstatistics/Actvts.vue'

// 初始默认展示allclubs组件
const showData = ref('allclubs')
</script>

<style lang="scss" scoped>
.el-card {
    margin-top: 10px;

    .headbar{
        text-align: center;
        position: relative;
        i{
            margin-right: 10px;
        }

        .institute{
            position: absolute;
            left: 0;
        }
    }

    .data{
        height: 600px;
        margin-top: 10px;
    }
}
</style>