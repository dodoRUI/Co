<template>
    <div>
        <div class="container">
            <div class="rank">
                <div class="rankbar">
                    <i class="iconfont icon-paihangbang_paiming"></i>
                    <el-radio-group v-model="rankStandard">
                        <el-radio-button value="total">
                            <i class="iconfont icon-shetuan"></i>
                            总人数
                        </el-radio-button>
                        <el-radio-button value="male">
                            <el-icon>
                                <Male />
                            </el-icon>
                            男
                        </el-radio-button>
                        <el-radio-button value="female">
                            <el-icon>
                                <Female />
                            </el-icon>
                            女
                        </el-radio-button>
                    </el-radio-group>
                </div>

                <ul v-if="rankStandard === 'total'">
                    <li v-for="(item, index) in DATA.sort((a, b) => { return b.total - a.total })" :key="index" @click="gotoClubInfo(item.club_id)">
                        <img
                            :src="item.club_avatar ? 'http://localhost:3000' + item.club_avatar : 'https://cube.elemecdn.com/9/c2/f0ee8a3c7c9638a54940382568c9dpng.png'">
                        <div>
                            <h3>{{ item.club_name }}</h3>
                            <span>
                                <span class="index">{{ index + 1 }}</span>
                                总人数：{{ item.total }}
                            </span>
                        </div>
                    </li>
                </ul>
                <ul v-else-if="rankStandard === 'male'">
                    <li v-for="(item, index) in DATA.sort((a, b) => { return b.male - a.male })" :key="index">
                        <img
                            :src="item.club_avatar ? 'http://localhost:3000' + item.club_avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                        <div>
                            <h3>{{ item.club_name }}</h3>
                            <span>
                                <span class="index">{{ index + 1 }}</span>
                                成员：{{ item.male }}
                            </span>
                        </div>
                    </li>
                </ul>
                <ul v-else="rankStandard === 'female'">
                    <li v-for="(item, index) in DATA.sort((a, b) => { return b.female - a.female })" :key="index">
                        <img
                            :src="item.club_avatar ? 'http://localhost:3000' + item.club_avatar : 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png'">
                        <div>
                            <h3>{{ item.club_name }}</h3>
                            <span>
                                <span class="index">{{ index + 1 }}</span>
                                成员：{{ item.female }}
                            </span>
                        </div>
                    </li>
                </ul>
            </div>

            <div class="graph">
                <e-charts class="chart" :option="optionPie" v-if="rankStandard === 'total'" />
                <e-charts class="chart" :option="optionBar" v-else />
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import axios from 'axios'
import { Male, Female } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import { ElMessage } from 'element-plus';

const router = useRouter()
const rankStandard = ref('total')

onMounted(() => {
    getData()
})

// 获取数据
const DATA = ref([])
const optionBar = ref({})
const optionPie = ref({})
const getData = async () => {
    let res = await axios.get('/adminapi/clubs/statistics/members')
    if(!res.data.success){
        ElMessage.error(res.data.message)
        return
    }
    let data = res.data.data
    for (var i in data) {
        data[i].total = +data[i].male + +data[i].female
    }
    DATA.value = data

    // 构造学院名称数组
    const clubNames = DATA.value.map(club => club.club_name);
    // 构造男女生数量数组
    const maleData = DATA.value.map(club => club.male);
    const femaleData = DATA.value.map(club => club.female);
    const totalData = DATA.value.map(club => club.total);

    optionBar.value = {
        animationDuration: 1000,
        title: {
            text: '社团成员人数',
            left: 'center'
        },
        grid: {
            width: '90%',
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
            },
            formatter: function (params) {
                const dataIndex = params[0].dataIndex;
                const clubName = clubNames[dataIndex];
                const maleNum = maleData[dataIndex];
                const femaleNum = femaleData[dataIndex];
                const totalNum = totalData[dataIndex];
                return `${clubName}<br/>总人数：${totalNum}人<br/>男生人数：${maleNum}人<br/>女生人数：${femaleNum}人`;
            }
        },
        legend: {
            top: '30px',
            data: ['男生', '女生']
        },
        xAxis: {
            type: 'category',
            data: clubNames,
            axisLabel: {
                rotate: -45, // 逆时针旋转45度
                fontSize: 10 // 设置字体大小为10px
            }
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '男生',
                type: 'bar',
                stack: '总人数',
                data: maleData,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#55e7fc' }, // 替换成你的第一个颜色
                    { offset: 1, color: '#417dff' } // 替换成你的第二个颜色
                ])
            },
            {
                name: '女生',
                type: 'bar',
                stack: '总人数',
                data: femaleData,
                color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    { offset: 0, color: '#ff9ed3' }, // 替换成你的第一个颜色
                    { offset: 1, color: '#b19eff' } // 替换成你的第二个颜色
                ])
            }
        ]
    }
    optionPie.value = {
        title:{
            text: '社团成员人数',
            subtext: 'Club Members Total',
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: '{b}<br>总人数：{c} ({d}%)'
        },
        legend: {
            type: 'scroll',
            orient: 'vertical',
            right: 0,
            top: 'center',
            data: data.legendData
        },
        series: [
            {
                name: '社团人数',
                type: 'pie',
                radius: ['30%', '80%'],
                center: ['40%', '50%'],
                avoidLabelOverlap: false,
                itemStyle: {
                    borderRadius: 5,
                    borderColor: '#fff',
                    borderWidth: 1
                },
                label: {
                    show: false,
                    position: 'center'
                },
                emphasis: {
                    label: {
                        show: true,
                        fontSize: 40,
                        fontWeight: 'bold'
                    }
                },
                labelLine: {
                    show: false
                },
                data: DATA.value.map(item => {
                    return { name: item.club_name, value: item.total };
                })
            }
        ]
    }
}

// 点击跳转到对应社团详情页
const gotoClubInfo = (id)=>{
    router.push({path:'clubinfo',query:{club_id:id}})
}
</script>

<style lang="scss">
.container {
    width: 100%;
    height: 600px;
    position: relative;

    .rank {
        .rankbar {
            width: 350px;
            vertical-align: bottom;
            display: flex;
            justify-content: center;
            position: relative;

            .icon-paihangbang_paiming {
                font-size: 50px;
                position: absolute;
                top: -10px;
                left: 0;
                color: rgb(64, 158, 255);
            }

            .el-radio-group {
                .el-radio-button {
                    &:nth-child(1) {
                        .el-radio-button__inner {
                            border-radius: 20px 0 0 20px;
                        }
                    }

                    &:nth-child(3) {
                        .el-radio-button__inner {
                            border-radius: 0 20px 20px 0;
                        }
                    }
                }
            }
        }

        ul {
            list-style: none;
            width: 350px;
            height: 560px;
            overflow-y: scroll;
            padding-top: 10px;
            margin-top: 10px;
            border-top: 1px solid rgb(64, 158, 255);

            li {
                width: 90%;
                display: flex;
                align-items: center;
                margin-top: 10px;
                border-radius: 80px;
                user-select: none;
                cursor: pointer;

                img {
                    width: 70px;
                    height: 70px;
                    border: 3px solid transparent;
                    border-radius: 50%;
                }

                div {
                    margin-left: 20px;

                    h3 {
                        color: #68acff;
                        font-size: 16px;
                        margin-bottom: 5px
                    }

                    span {
                        font-size: 12px;
                        color: #5f5f5f;

                        .index {
                            display: inline-block;
                            width: 20px;
                            height: 20px;
                            margin-right: 10px;
                            border-radius: 10px;
                            background-color: #68acff;
                            line-height: 20px;
                            text-align: center;
                            color: white
                        }
                    }
                }

                &:nth-child(1) {
                    width: 100%;
                    background: linear-gradient(-90deg, transparent, rgb(255, 53, 53, 0.2));

                    img {
                        border: 3px solid rgb(255, 84, 84);
                        width: 80px;
                        height: 80px;
                    }

                    div {
                        h3 {
                            color: rgb(255, 53, 53);
                            font-size: 20px;
                        }

                        span {
                            font-size: 16px;

                            .index {
                                background-color: rgb(255, 53, 53);
                            }
                        }
                    }
                }

                &:nth-child(2) {
                    width: 95%;
                    background: linear-gradient(-90deg, transparent, rgba(255, 183, 0, 0.2));

                    img {
                        border: 3px solid rgb(255, 183, 0);
                        width: 75px;
                        height: 75px;
                    }

                    div {
                        h3 {
                            color: rgb(255, 183, 0);
                            font-size: 18px;
                        }

                        span {
                            font-size: 14px;

                            .index {
                                background-color: rgb(255, 183, 0);
                            }
                        }
                    }
                }

                &:nth-child(3) {
                    width: 90%;
                    background: linear-gradient(-90deg, transparent, rgba(181, 78, 255, 0.2));

                    img {
                        border: 3px solid rgb(181, 78, 255);
                    }

                    div {
                        h3 {
                            color: rgb(181, 78, 255);
                            font-size: 16px;
                        }

                        span {
                            font-size: 12px;

                            .index {
                                background-color: rgb(181, 78, 255);
                            }
                        }
                    }
                }
                &:nth-child(n+4):nth-child(-n+10){
                    width: 90%;
                    background: linear-gradient(-90deg, transparent, rgba(64,158,255, 0.2));

                    img {
                        border: 3px solid rgb(64,158,255);
                        width: 70px;
                    }

                    div {
                        h3 {
                            color: rgb(64,158,255);
                            font-size: 16px;
                        }

                        span {
                            font-size: 12px;

                            .index {
                                background-color: rgb(64,158,255);
                            }
                        }
                    }
                }
            }

            &::-webkit-scrollbar {
                width: 5px;
                background-color: transparent;
            }

            &::-webkit-scrollbar-thumb {
                width: 10px;
                background: rgb(124, 189, 255);
                border-radius: 5px;
            }
        }
    }

    .graph {
        position: absolute;
        right: 0;
        top: 0;
        width: 800px;
        height: 100%;
    }
}
</style>