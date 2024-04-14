<template>
    <div>
        <div class="container">
            <div class="datashow">
                <div class="statistic">
                    <div class="border"></div>
                    <div class="content"></div>
                    <el-statistic title="社团总数" :value="clubsNumShow">
                        <template #prefix>
                            <i class="iconfont icon-hrcollegepeopleCardingRange"></i>
                        </template>
                    </el-statistic>
                </div>
                <div class="statistic">
                    <el-statistic title="社员总人数" :value="membersNumShow">
                        <template #prefix>
                            <i class="iconfont icon-shetuan"></i>
                        </template>
                    </el-statistic>
                    <div class="statistic-footer">
                        <div class="footer-item">
                            <span class="green">
                                <el-icon>
                                    <CaretTop />
                                </el-icon>
                                {{ membersRatio }}
                            </span>
                        </div>
                    </div>
                </div>
                <div class="statistic">
                    <el-statistic title="男女比例" :value="maleMemberNumShow" :group-separator="''">
                        <template #suffix>/ {{ femaleMembersNum }}</template>
                    </el-statistic>
                </div>
                <div class="statistic">
                    <el-statistic title="社团活动总次数" :value="actvtsNumShow">
                        <template #prefix>
                            <i class="iconfont icon-huodong1"></i>
                        </template>
                    </el-statistic>
                    <div class="statistic-footer">
                        <div class="footer-item">
                            <span class="green">
                                <el-icon>
                                    <CaretTop />
                                </el-icon>
                                {{ actvtRatio }}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="charts">
                <div class="column">
                    <e-charts class="chart" :option="option2" />
                </div>
                <div class="rose">
                    <e-charts class="chart" :option="option1" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useTransition } from '@vueuse/core'
import { CaretTop } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus';

const DATA = ref({})
const clubsNum = ref(0)
const membersNum = ref(0)
const actvtsNum = ref(0)
const maleMembersNum = ref(0)
const femaleMembersNum = ref(0)
const membersRatio = ref('7%')
const actvtRatio = ref('')

const instituteClub = ref([])
const instituteMember = ref([])


onMounted(async () => {
    await getClubsData()
    instituteClubsFilter()
    instituteMmbersFilter()
})
const getClubsData = async () => {
    let res = await axios.get("/adminapi/clubs/statistics")
    if (!res.data.success) {
        ElMessage.error(res.data.message)
        return
    }
    DATA.value = res.data.data
    clubsNum.value = DATA.value.clubsData.length
    membersNum.value = DATA.value.maleMembers.length + DATA.value.femaleMembers.length
    actvtsNum.value = DATA.value.actvtData.length
    maleMembersNum.value = DATA.value.maleMembers.length
    femaleMembersNum.value = DATA.value.femaleMembers.length

    actvtRatio.value = `${actvtsNum.value * 10}%`
}
const instituteClubsFilter = () => {
    let obj = {}
    for (var i in DATA.value.clubsData) {
        if (obj[DATA.value.clubsData[i].club_belong]) {
            obj[DATA.value.clubsData[i].club_belong]++
        } else {
            obj[DATA.value.clubsData[i].club_belong] = 1
        }
    }
    for (var i in obj) {
        instituteClub.value.push({
            name: i,
            value: obj[i]
        })
    }
    instituteClub.value.sort((a, b) => {
        return b.value - a.value;
    })
}
const instituteMmbersFilter = () => {
    let obj1 = {}
    for (var i in DATA.value.maleMembers) {
        if (obj1[DATA.value.maleMembers[i].institute]) {
            obj1[DATA.value.maleMembers[i].institute]++
        } else {
            obj1[DATA.value.maleMembers[i].institute] = 1
        }
    }
    let obj0 = {}
    for (var i in DATA.value.femaleMembers) {
        if (obj0[DATA.value.femaleMembers[i].institute]) {
            obj0[DATA.value.femaleMembers[i].institute]++
        } else {
            obj0[DATA.value.femaleMembers[i].institute] = 1
        }
    }
    instituteMember.value = Object.keys(obj1).map(key => ({
        name: key,
        male: obj1[key],
        female: obj0[key]
    }))

    // 构造学院名称数组
    const collegeNames = instituteMember.value.map(college => college.name);

    // 构造男女生数量数组
    const maleData = instituteMember.value.map(college => college.male);
    const femaleData = instituteMember.value.map(college => college.female);
    const totalData = maleData.map((value, index) => value + femaleData[index]);

    option2.value = {
        animationDuration: 1000,
        title: {
            text: '学院社团人数',
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
            },
            formatter: function (params) {
                const dataIndex = params[0].dataIndex;
                const collegeName = collegeNames[dataIndex];
                const maleNum = maleData[dataIndex];
                const femaleNum = femaleData[dataIndex];
                const totalNum = totalData[dataIndex];
                return `${collegeName}<br/>总人数：${totalNum}人<br/>男生人数：${maleNum}人<br/>女生人数：${femaleNum}人`;
            }
        },
        legend: {
            top: '30px',
            data: ['男生', '女生']
        },
        xAxis: {
            type: 'category',
            data: collegeNames,
            axisLabel: {
                rotate: -45 // 逆时针旋转45度
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
                itemStyle: {
                    color: 'rgb(72,164,254)', // 蓝色
                }
            },
            {
                name: '女生',
                type: 'bar',
                stack: '总人数',
                data: femaleData,
                itemStyle: {
                    color: '#ff9ec2', // 红色
                }
            }
        ]
    }
}

const clubsNumShow = useTransition(clubsNum, {
    duration: 1000,
})
const membersNumShow = useTransition(membersNum, {
    duration: 1000,
})
const actvtsNumShow = useTransition(actvtsNum, {
    duration: 1000,
})
const maleMemberNumShow = useTransition(maleMembersNum, {
    duration: 1000,
})

// 图表1，展示各学院社团数量
const option1 = ref({
    animationDuration: 1000,
    title: {
        text: '学院社团数量',
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
        trigger: 'item',
        formatter: '{b}<br>数量：{c} ({d}%)'
    },
    legend: {
        right: 'right',
        bottom: 'center'
    },
    series: [
        {
            name: '学院',
            type: 'pie',
            radius: ['40%', '80%'],
            avoidLabelOverlap: false,
            center: ['35%', '50%'],
            itemStyle: {
                borderRadius: 10,
                borderColor: '#fff',
                borderWidth: 2
            },
            label: {
                show: false,
                position: 'center'
            },
            emphasis: {
                label: {
                    show: true,
                    fontSize: 30,
                    fontWeight: 'bold'
                }
            },
            labelLine: {
                show: false
            },
            data: instituteClub.value
        }
    ]
})


// 图表2,展示各学院社员总人数
const option2 = ref()
</script>

<style lang="scss" scoped>
.container {
    width: 100%;
    height: 600px;

    .datashow {
        display: flex;
        align-items: center;
        justify-content: space-around;


        .statistic {
            width: 130px;
            height: 130px;
            border: 4px solid rgb(64, 158, 255);
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            border-radius: 70px;

            .el-statistic {
                text-align: center;
                width: 130px;
            }

            .statistic-footer {
                position: absolute;
                bottom: 20px;
                width: 100%;
                font-size: 12px;
                color: #6f6f6f;

                .footer-item {
                    text-align: center;

                    .green {
                        color: rgb(26, 200, 26);
                    }
                }
            }
        }
    }

    .charts {
        width: 100%;
        height: 480px;
        display: flex;
        justify-content: space-between;

        div {
            width: 50%;
        }
    }
}
</style>