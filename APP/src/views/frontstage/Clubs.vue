<template>
    <div style="overflow: hidden;">
        <Transition name="swiper">
            <el-carousel :interval="4000" type="card" height="350px" trigger="click" class="swiper"
                :pause-on-hover="false" v-show="isMounted">
                <el-carousel-item v-for="item in annualTop" :key="item.id">
                    <div class="container" :style="{ backgroundImage: 'url(' + item.image + ')' }">
                        <div class="info">
                            <div class="name"
                                @click="router.push({ path: '/front/clubs/clubinfo', query: { id: item.id } })">{{
                                    item.club }}</div>
                            <div class="slogan">
                                <div class="cn">
                                    <div class="cn-content">{{ item.slogan.cn }}</div>
                                    <div class="divide"></div>
                                </div>
                                <div class="en">{{ item.slogan.en }}</div>
                            </div>
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </Transition>

        <Transition name="leftin">
            <div class="allcharts">
                <div class="top10">
                    <div class="title">
                        <div class="title-text">2024年度十佳社团</div>
                        <div class="toggle-button" @click="() => { showTop10List = !showTop10List }">
                            <span v-if="showTop10List">全部排名</span>
                            <span v-else>TOP 10</span>
                        </div>
                    </div>
                    <Transition>
                        <div class="top10list" v-show="showTop10List">
                            <ul class="top10list-ul">
                                <li v-for="item in top10List" :key="item.club_id">
                                    <div class="bgimg"
                                        :style="{ backgroundImage: 'url(' + 'http://localhost:3000/' + item.club_background + ')' }">
                                        <div class="mask"></div>
                                        <div class="name"
                                            @click="router.push({ path: '/front/clubs/clubinfo', query: { id: item.club_id } })">
                                            {{ item.club_name }}</div>
                                        <div class="slogan">
                                            <div class="cn">
                                                <div class="cn-content">{{ item.club_slogan.split('\\')[0] }}</div>
                                                <div class="divide"></div>
                                            </div>
                                            <div class="en">{{ item.club_slogan.split('\\')[1] }}</div>
                                        </div>
                                        <div class="avatar">
                                            <img :src="'http://localhost:3000/' + item.club_avatar">
                                        </div>
                                        <div class="profile">
                                            {{ item.club_profile }}
                                        </div>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </Transition>
                    <div class="graph" :style="{ 'opacity': showTop10List ? 0 : 1 }">
                        <e-charts class="chart" :option="optionVoteRank" />
                    </div>
                </div>
                <div class="members">
                    <div class="title">2024社团总人数统计</div>
                    <div class="graph">
                        <e-charts class="chart" :option="optionMembers" />
                    </div>
                </div>
            </div>
        </Transition>
        <div class="allclubslist">
            <div class="title">
                <div class="text">社团列表</div>
                <div class="filter">
                    <el-input v-model="keyword" placeholder="社团名称" :prefix-icon="Search" />
                    <el-select v-model="club_type" placeholder="社团分类" clearable :popper-class="'clubtype-option'"
                        :popper-append-to-body="false">
                        <el-option v-for="(item, index) in clubType" :key="item" :label="item" :value="index + 1">
                            <div :style="{ 'padding-left': '10px', 'color': typeColor(index) }">{{ item }}</div>
                        </el-option>
                    </el-select>
                </div>

            </div>
            <div class="clubslist">
                <ul class="clublist-ul">
                    <li v-show="!showAllClubList.length" class="no-data">
                        <div>
                            <div class="en">NO DATA</div>
                            <div class="cn">未找到名为 <span>{{ keyword }}</span> 的社团</div>
                        </div>
                    </li>
                    <li v-for="item in showAllClubList" :key="item.club_id"
                        :style="{ 'background-image': 'url(' + 'http://localhost:3000/' + item.club_background + ')' }">
                        <div class="card">
                            <div class="shortcut">
                                <div class="name"
                                    @click="router.push({ path: '/front/clubs/clubinfo', query: { id: item.club_id } })">
                                    {{
                                        item.club_name }}</div>
                                <div class="slogan">
                                    <div class="cn">
                                        <div class="cn-content">{{ item.club_slogan?.split('\\')[0] }}</div>
                                        <div class="divide"></div>
                                    </div>
                                    <div class="en">{{ item.club_slogan?.split('\\')[1] }}</div>
                                </div>
                                <div class="avatar">
                                    <img :src="'http://localhost:3000/' + item.club_avatar">
                                </div>
                                <div class="type">
                                    {{ clubType[item.club_type - 1] }}
                                </div>
                                <div class="time">
                                    创立时间：{{ item.club_birth }}
                                </div>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { Search } from '@element-plus/icons-vue'
import * as echarts from 'echarts'
import axios from 'axios'
import { useHomeStore } from '@/stores/home'

const annualTop = ref([
    { image: '/src/assets/top10/乒乓球.jpg', id: 42, club: '乒乓球协会', slogan: { cn: '挥动乒乓激情，共创球场传奇!', en: 'Swing with table-tennis passion, create legends on the court together!' } },
    { image: '/src/assets/top10/摄影.jpg', id: 2, club: '镜观天下摄影协会', slogan: { cn: '聚焦美好，定格时光!', en: 'Focus on beauty, capture moments!' } },
    { image: '/src/assets/top10/滑板.jpg', id: 33, club: 'New Board滑板协会', slogan: { cn: '燃烧激情，飞驰青春!', en: 'Ignite passion, ride into youth!' } },
    { image: '/src/assets/top10/吉他.jpg', id: 14, club: '吉他协会', slogan: { cn: '弦动心弦，和音共鸣!', en: 'Strings resonate, harmony together!' } },
    { image: '/src/assets/top10/英语.jpg', id: 18, club: '英语协会', slogan: { cn: '畅游语海，开启国际之门!', en: 'Explore the seas of language, open the door to the world!' } },
    { image: '/src/assets/top10/人工智能.jpg', id: 66, club: '计算机与人工智能协会', slogan: { cn: '智能引领，科技未来!', en: 'Leading with intelligence, shaping the future of technology!' } },
    { image: '/src/assets/top10/围棋.jpg', id: 55, club: '大众棋社', slogan: { cn: '棋逢对手，智慧碰撞!', en: 'Encountering opponents, wisdom collides!' } },
    { image: '/src/assets/top10/电子竞技.jpg', id: 7, club: '电子竞技协会', slogan: { cn: '电竞狂潮，共赴胜利之路!', en: 'Riding the esports wave, together towards victory!' } },
    { image: '/src/assets/top10/建筑.jpg', id: 24, club: '建筑协会', slogan: { cn: '筑梦未来，共铸城市之美!', en: 'Building dreams, shaping the beauty of cities together!' } },
    { image: '/src/assets/top10/动漫.jpg', id: 65, club: 'K·ing动漫协会', slogan: { cn: '梦境漫游，创造无限奇迹!', en: 'Roaming through dreams, creating infinite wonders!' } }
])

const store = useHomeStore()
const router = useRouter()
const showTop10List = ref(true)
const isMounted = ref(false)
const clubType = ref(['学科学术类', '文化艺术类', '体育健身类', '志愿服务类', '科技创新类', '兴趣爱好类', '国际交流类', '创业就业类'])
const typeColor = (type) => {
    return ['#FF6347', '#1E90FF', '#32CD32', '#FFD700', '#9370DB', '#FFA500', '#FF69B4', '#00CED1'][type]
}
onMounted(async () => {
    isMounted.value = true
    await getData()
})

const optionVoteRank = ref({})
const optionMembers = ref({})
const top10List = ref([])
const allClubsList = ref([])
const getData = async () => {
    const res = await axios.get('/frontapi/show/votesrank')
    allClubsList.value = [...res.data.data]
    console.log(allClubsList.value)
    const data = res.data.data.sort((a, b) => b.club_star - a.club_star)
    top10List.value = data.slice(0, 10)

    optionVoteRank.value = {
        title: {
            subtext: '2024 Annual Votes Rank Of All Clubs',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
        },
        grid: {
            left: 0,
            width: '98%',
            height: '85%',
            containLabel: true
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 16
            }
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                fontSize: 8,
                rotate: -45
            },
            data: data.map(item => item.club_name)
        },
        series: [
            {
                name: '得票数',
                type: 'bar',
                color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                    { offset: 0, color: '#9378ff' },
                    { offset: 1, color: '#ff77c2' }
                ]),
                data: data.map(item => item.club_star),
                label: {
                    show: true,
                    position: 'top',
                    formatter: '{c}',
                    fontSize: 10,
                    fontWeight: 'thin',
                    color: 'white'

                }
            }
        ]
    }
    for (var i in data) {
        data[i].total = +data[i].male_count + +data[i].female_count
    }
    // 构造学院名称数组
    const clubNames = data.map(club => club.club_name);
    // 构造男女生数量数组
    const maleData = data.map(club => club.male_count);
    const femaleData = data.map(club => club.female_count);
    const totalData = data.map(club => club.total);

    optionMembers.value = {
        animationDuration: 1000,
        title: {
            subtext: '2024 Annual Clubs Members Counts Statistics',
            left: 'center'
        },
        grid: {
            left: 45,
            width: '95%',
            height: '72%',
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
                fontSize: 8 // 设置字体大小为10px
            }
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                fontSize: 16 // 设置字体大小为10px
            }
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
                ]),
            }
        ]
    }
}

// 所有社团列表
const keyword = ref('')
const club_type = ref(null)
const showAllClubList = computed(() => {
    return allClubsList.value.filter(item => {
        return item.club_name.toLowerCase().includes(keyword.value.toLowerCase()) && (club_type.value == null || club_type.value == item.club_type)
    })
})
</script>

<style lang="scss" scoped>
.swiper-enter-active,
.swiper-leave-active {
    transition: all 0.5s ease;
}

.swiper-enter-from,
.swiper-leave-to {
    transform: translateX(2000px);
}

.leftin-enter-active,
.leftin-leave-active {
    transition: all 0.5s ease;
}

.leftin-enter-from,
.leftin-leave-to {
    transform: translateX(-2000px);
}

.v-enter-active {
    transition: all 0.2s ease;
}

.v-enter-from,
.v-leave-to {
    opacity: 0;
}

.toptitle {
    width: 100%;
    display: flex;
    justify-content: center;
    font-size: 25px;
    margin: 20px 0;
    font-weight: bold;

    .toptext {
        background-image: linear-gradient(-15deg, #9378ff, #ff77c2);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

}

.swiper {
    height: 350px;

    .el-carousel__item--card.is-active {
        .container .info {
            opacity: 1;

            .name {
                opacity: 1;
            }

            .slogan {
                .cn .cn-content {
                    transform: translateX(0);
                }

                .en {
                    transform: translateX(0);
                }
            }
        }
    }

    .container {
        width: 100%;
        height: 100%;
        position: relative;
        background-repeat: no-repeat;
        background-size: cover;
        background-position: center;
        user-select: none;

        .info {
            width: 100%;
            height: 100%;
            position: absolute;
            top: 0;
            left: 0;
            color: white;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-direction: column;
            opacity: 0;
            transition: all 0.5s ease;

            .name {
                font-size: 40px;
                padding: 5px 10px;
                font-weight: 100;
                border: 2px solid white;
                margin-bottom: 30px;
                transition: all 0.2s ease;
                opacity: 0;
                transition: opacity 0.5s 0.2s ease, background 0.2s ease;

                &:hover {
                    background-color: rgba($color: #fff, $alpha: 0.2);
                }
            }

            .slogan {
                font-weight: 100;
                display: flex;
                flex-direction: column;
                align-items: center;

                .cn {
                    .cn-content {
                        padding: 0 20px;
                        margin-bottom: 5px;
                        transition: all 0.5s 0.2s ease;
                        transform: translateX(-900px);
                    }

                    .divide {
                        width: 100%;
                        border-bottom: 1px solid white;
                    }
                }

                .en {
                    transition: all 0.5s 0.2s ease;
                    transform: translateX(900px);
                }
            }
        }
    }
}

.allcharts {
    width: 100%;
    margin-top: 40px;
    box-sizing: border-box;
    padding: 10px 10px;
    position: relative;


    .title {
        font-size: 25px;
        font-weight: bold;
        text-align: center;
    }

    .top10 {
        width: 100%;
        height: 600px;

        .title {
            display: flex;
            align-items: center;
            justify-content: center;

            .title-text {
                background-image: linear-gradient(45deg, #9378ff, #ff77c2);
                background-clip: text;
                -webkit-text-fill-color: transparent;
            }


            .toggle-button {
                margin-left: 20px;
                font-size: 14px;
                font-weight: 100;
                border: 1px solid rgb(206, 119, 221);
                display: flex;
                align-items: center;
                justify-content: center;
                width: 70px;
                height: 25px;
                color: rgb(206, 119, 221);
                border-radius: 15px;
                cursor: pointer;
                user-select: none;
                transition: all 0.2s ease;

                &:hover {
                    background-color: rgb(206, 119, 221);
                    color: white !important;
                }

                &:active {
                    transform: scale(0.95);
                }
            }
        }

        .top10list {
            transition: all 0.5s ease;

            .top10list-ul {
                width: 100%;
                height: 565px;
                list-style: none;
                display: flex;
                flex-wrap: wrap;
                justify-content: center;
                box-sizing: border-box;
                overflow-y: scroll;
                padding: 20px;
                gap: 20px;

                &::-webkit-scrollbar {
                    width: 0px;
                    background-color: transparent;
                }

                li {
                    background-color: white;
                    box-sizing: border-box;
                    width: 32%;
                    height: 49%;
                    border-radius: 15px;
                    box-shadow: 0 0 10px 0 #ccc;
                    transition: all 0.3s ease;

                    &:hover {
                        transform: scale(1.05);
                        box-shadow: 0 0 10px 0 rgba($color: #000, $alpha: 0.8);

                        .bgimg {
                            .mask {
                                opacity: 0.8;
                            }

                            .name {
                                transform: translateX(50px) translateY(-20px);
                                background-color: transparent;
                                border-color: #888888;
                                color: #888888;
                            }

                            .avatar {
                                transform: translateY(0);
                            }

                            .slogan {
                                .cn {
                                    .cn-content {
                                        transform: translateX(-500px);
                                    }

                                    .divide {
                                        opacity: 0;
                                    }
                                }

                                .en {
                                    transform: translateX(500px);
                                }
                            }

                            .profile {
                                transform: translateY(0);
                            }
                        }
                    }

                    .bgimg {
                        width: 100%;
                        height: 100%;
                        background-position: center;
                        background-size: cover;
                        border-radius: 15px;
                        position: relative;
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        color: white;
                        font-weight: 100;
                        overflow: hidden;
                        user-select: none;

                        .avatar {
                            width: 100px;
                            height: 100px;
                            position: absolute;
                            top: 20px;
                            left: 20px;
                            border-radius: 50%;
                            border: 2px solid white;
                            z-index: 2;
                            transform: translateY(-200px);
                            transition: all 0.5s ease;

                            img {
                                position: absolute;
                                width: 100px;
                                height: 100px;
                                object-fit: cover;
                                object-position: center;
                                position: absolute;
                                top: 0;
                                left: 0;
                                border-radius: 50%;
                            }
                        }

                        .profile {
                            position: absolute;
                            box-sizing: border-box;
                            padding: 10px;
                            text-indent: 2em;
                            bottom: 0;
                            font-size: 14px;
                            width: 100%;
                            color: #5c5c5c;
                            transform: translateY(500px);
                            transition: all 0.5s 0.1s ease;
                        }

                        .mask {
                            width: 100%;
                            height: 100%;
                            position: absolute;
                            border-radius: 15px;
                            top: 0;
                            left: 0;
                            background: white;
                            opacity: 0;
                        }

                        .name {
                            height: 50px;
                            line-height: 50px;
                            font-size: 25px;
                            padding: 0 15px;
                            margin-bottom: 30px;
                            border: 2px solid white;
                            z-index: 1;
                            background-color: rgba($color: #000, $alpha: 0.2);
                            cursor: pointer;
                            transition: transform 0.5s ease, color 0.3s ease, border-color 0.3s ease;

                            &:hover {
                                color: rgb(206, 119, 221);
                                border-color: rgb(206, 119, 221);
                            }
                        }

                        .slogan {
                            z-index: 1;
                            font-weight: 100;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            font-size: 12px;

                            .cn {
                                .cn-content {
                                    padding: 0 20px;
                                    margin-bottom: 5px;
                                    transition: all 0.5s ease;
                                    transform: translateX(0);
                                }

                                .divide {
                                    width: 100%;
                                    border-bottom: 1px solid white;
                                    transition: all 0.5s ease;
                                }
                            }

                            .en {
                                transition: all 0.5s ease;
                                transform: translateX(0);
                            }
                        }
                    }
                }
            }
        }


        .graph {
            width: 100%;
            height: 100%;
            opacity: 1;
            transition: opacity 0.5s ease;
        }
    }

    .members {
        height: 600px;
        margin-top: 80px;

        .title {
            background-image: linear-gradient(45deg, #417dff, #55e7fc);
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .graph {
            width: 100%;
            height: 100%;
        }
    }
}

.allclubslist {
    width: 100%;
    margin-top: 60px;

    .title {
        font-size: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-weight: bold;
        position: relative;
        user-select: none;

        .text {
            background-image: linear-gradient(45deg, #9378ff, #ff77c2);
            background-clip: text;
            -webkit-text-fill-color: transparent;
        }

        .filter {
            position: absolute;
            right: 20px;
            display: flex;

            :deep(.el-input) {
                width: 200px;
                margin-right: 20px;

                .el-input__wrapper {
                    border-radius: 20px;
                }
            }

            :deep(.el-select) {
                width: 150px;
                font-weight: 100;

                .el-select__wrapper {
                    border-radius: 20px;
                }
            }
        }
    }

    .clublist-ul {
        width: 95%;
        height: 580px;
        box-sizing: border-box;
        margin: 10px auto;
        padding-top: 20px;
        display: flex;
        list-style: none;
        flex-wrap: wrap;
        overflow: scroll;
        background-color: transparent;
        transition: all 0.3s ease;

        .no-data {
            width: 100%;
            height: calc(100% - 20px);
            display: flex;
            justify-content: center;
            align-items: center;

            &>div {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-weight: 100;
                color: #2e2e2e;

                .en {
                    font-size: 50px;
                    font-weight: 900;
                    margin-bottom: 10px;
                }

                .cn span {
                    background-image: linear-gradient(45deg, #9378ff, #ff77c2);
                    background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
            }

            &:hover {
                transform: scale(1);
                box-shadow: none;
            }
        }

        &:hover {
            box-shadow: 0 0 10px 0 rgba($color: #d089ff, $alpha: 0.8);
        }

        &::-webkit-scrollbar {
            width: 5px;
            background-color: transparent;
        }

        &::-webkit-scrollbar-thumb {
            width: 10px;
            background: linear-gradient(45deg, #9378ff, #ff77c2);
            border-radius: 5px;
        }

        li {
            width: 318px;
            height: 170px;
            margin: 0 0 20px 20px;
            background-position: center;
            background-size: cover;
            border-radius: 5px;
            user-select: none;
            transition: all 0.3s ease;

            &:hover {
                transform: scale(1.05);
                box-shadow: 0 0 15px 0 rgba($color: #000, $alpha: 0.8);

                .card {
                    background: transparent;

                    .shortcut {
                        .name {
                            transform: translateY(40px);
                        }

                        .slogan {
                            .cn {
                                .cn-content {
                                    transform: translateX(-400px);
                                }

                                .divide {
                                    opacity: 0;
                                }
                            }

                            .en {
                                transform: translateX(400px);
                            }
                        }

                        .avatar {
                            transform: translateY(0);
                        }

                        .time {
                            transform: translateX(0);
                        }

                        .type {
                            opacity: 1;
                        }
                    }
                }
            }

            .card {
                width: 100%;
                height: 100%;
                border-radius: 5px;
                background: rgba($color: #fff, $alpha: 0.15);
                transition: all 0.2s ease;

                .shortcut {
                    color: white;
                    height: 100%;
                    font-weight: 100;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    position: relative;
                    overflow: hidden;

                    .name {
                        font-size: 20px;
                        margin-bottom: 15px;
                        background: rgba($color: #000, $alpha: 0.3);
                        padding: 3px 5px;
                        border: 1px solid white;
                        transition: transform 0.5s ease, color 0.3s ease, background 0.3s ease, font-size 0.2s ease;
                        cursor: pointer;

                        &:hover {
                            background: rgba($color: #fff, $alpha: 0.5);
                            color: #313131;
                            border: none;
                        }

                        &:active {
                            font-size: 19px;
                        }
                    }

                    .slogan {
                        display: flex;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                        font-size: 13px;

                        .cn {
                            .cn-content {
                                padding: 0 5px;
                                transition: all 0.5s ease;
                            }

                            .divide {
                                width: 100%;
                                margin-top: 3px;
                                border-bottom: 1px solid white;
                                transition: all 0.5s ease;
                            }
                        }

                        .en {
                            text-align: center;
                            transition: all 0.5s ease;
                        }
                    }

                    .avatar {
                        width: 60px;
                        height: 60px;
                        position: absolute;
                        top: 10px;
                        left: calc(50% - 30px);
                        border-radius: 50%;
                        border: 2px solid white;
                        transition: all 0.5s ease;
                        transform: translateY(-100px);

                        img {
                            position: absolute;
                            width: 60px;
                            height: 60px;
                            object-fit: cover;
                            object-position: center;
                            position: absolute;
                            top: 0;
                            left: 0;
                            border-radius: 50%;
                        }
                    }

                    .type {
                        position: absolute;
                        bottom: 30px;
                        font-size: 10px;
                        background: rgba($color: #000, $alpha: 0.2);
                        border: 1px solid white;
                        padding: 2px 5px;
                        border-radius: 10px;
                        transition: all 0.5s ease;
                        opacity: 0;
                    }

                    .time {
                        position: absolute;
                        bottom: 2px;
                        left: 5px;
                        font-size: 12px;
                        transition: all 0.5s ease;
                        transform: translateX(-200px);
                    }

                }
            }
        }
    }
}
</style>

<style lang="scss">
.clubtype-option {
    background-color: white;

    .el-select-dropdown__item {
        text-align: center;
    }

}
</style>