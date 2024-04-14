<template>
    <div>
        <div class="container">
            <div class="rank">
                <div class="rankbar">
                    <i class="iconfont icon-paihangbang_paiming"></i>
                    <h3 style="color: rgb(64,158,255);">社团得票数</h3>
                </div>

                <ul>
                    <li v-for="(item, index) in DATA.sort((a, b) => { return b.vote_count - a.vote_count })"
                        :key="index" @click="gotoClub(item.club_id)">
                        <img
                            :src="item.club_avatar ? 'http://localhost:3000' + item.club_avatar : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
                        <div>
                            <h3>{{ item.club_name }}</h3>
                            <span>
                                <span class="index">{{ index + 1 }}</span>
                                总票数：{{ item.vote_count }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="graph">
                <e-charts class="chart" :option="option" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';

const router = useRouter()

const DATA = ref([])
const option = ref({})
onMounted(() => {
    getData()
})
const getData = async () => {
    let res = await axios.get('/adminapi/clubs/statistics/stars')
    if(!res.data.success){
        ElMessage.error(res.data.message)
        return
    }
    DATA.value = res.data.data.sort((a, b) => a.vote_count - b.vote_count)
    console.log(DATA.value)

    option.value = {
        title: {
            text: '社团得票数量排名',
            subtext: 'Club Votes Rank',
            left: 'center'
        },
        toolbox: {
            show: true,
            feature: {
                mark: { show: true },
                dataView: { show: true, readOnly: false },
                restore: { show: true },
                saveAsImage: { show: true }
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            width: 780,
            height: 542,
            left: 0,
            containLabel: true
        },
        xAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 16
            }
        },
        yAxis: {
            type: 'category',
            axisLabel: {
                fontSize: 10
            },
            data: DATA.value.map(item => item.club_name)
        },
        series: [
            {
                name: '得票数量',
                type: 'bar',
                color: new echarts.graphic.LinearGradient(1, 0, 0, 0, [
                    { offset: 0, color: '#55e7fc' }, // 替换成你的第一个颜色
                    { offset: 1, color: '#417dff' } // 替换成你的第二个颜色
                ]),
                data: DATA.value.map(item => item.vote_count),
                label: {
                    show: true,
                    position: 'right',
                    formatter: '{c}' // 显示每个柱形图的数值
                }
            }
        ]
    }
}

// 跳转社团详情页面
const gotoClub = (id)=>{
    router.push({path:'clubinfo',query:{club_id:id}})
}
</script>

<style lang="scss">
</style>