<template>
    <div>
        <div class="container">
            <div class="rank">
                <div class="rankbar">
                    <i class="iconfont icon-paihangbang_paiming"></i>
                    <h3 style="color: rgb(64,158,255);">总活动次数</h3>
                </div>

                <ul>
                    <li v-for="(item, index) in DATA.sort((a, b) => { return b.actvtcount - a.actvtcount })"
                        :key="index" @click="gotoClub(item.club_id)">
                        <img
                            :src="item.club_avatar ? 'http://localhost:3000' + item.club_avatar : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
                        <div>
                            <h3>{{ item.club_name }}</h3>
                            <span>
                                <span class="index">{{ index + 1 }}</span>
                                开展数量：{{ item.actvtcount }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="graph">
                <e-charts class="chart" :option="optionBar" />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import axios from 'axios'
import * as echarts from 'echarts'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus';

const router = useRouter()

const rankStandard = ref('total')

onMounted(() => {
    getData()
})

// 获取数据
const DATA = ref([])
const optionBar = ref({})
const getData = async () => {
    let res = await axios.get('/adminapi/clubs/statistics/actvts')
    if(!res.data.success){
        ElMessage.error(res.data.message)
        return
    }
    let data = res.data.data
    DATA.value = data
    optionBar.value = {
        title: {
            text: '社团活动次数统计',
            subtext: 'Club Activities Statistics',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        xAxis: {
            type: 'category',
            data: data.map(item => item.club_name),
            axisLabel: {
                rotate: -45, // 逆时针旋转45度
                fontSize: 10 // 设置字体大小为10px
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [{
            data: data.map(item => item.actvtcount),
            type: 'bar',
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                { offset: 0, color: '#55e7fc' }, // 替换成你的第一个颜色
                { offset: 1, color: '#417dff' } // 替换成你的第二个颜色
            ])
        }]
    }
}

// 跳转社团详情页面
const gotoClub = (id) => {
    router.push({ path: 'clubinfo', query: { club_id: id } })
}
</script>

<style lang="scss"></style>