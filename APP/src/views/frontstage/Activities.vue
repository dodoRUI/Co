<template>
    <div class="root">
        <ul :class="{ 'nav': true, 'isMounted': isMounted }" @click="activityFilter">
            <li :class="{ 'active': actvtType == 'all' }" @click="actvtType = 'all'">
                <div class="cn">全部活动</div>
                <div class="en">ALL ACTIVITIES</div>
            </li>
            <li :class="{ 'active': actvtType == 'pre' }" @click="actvtType = 'pre'">
                <div class="cn">未开始</div>
                <div class="en">COMMING SOON</div>
            </li>
            <li :class="{ 'active': actvtType == 'now' }" @click="actvtType = 'now'">
                <div class="cn">进行中</div>
                <div class="en">UNDER WAY</div>
            </li>
            <li :class="{ 'active': actvtType == 'end' }" @click="actvtType = 'end'">
                <div class="cn">已结束</div>
                <div class="en">FINISHED</div>
            </li>
            <li :class="{ 'active': actvtType == 'myclubs' }" @click="actvtType = 'myclubs'">
                <div class="cn">我的社团</div>
                <div class="en">MY CLUBS</div>
            </li>
        </ul>
        <div class="main">
            <div :class="{ 'actvt-timeline': true, 'mounted': isMounted }">
                <div class="pannel">
                    <el-input :prefix-icon="Search" v-model="keyword" placeholder="查找活动"></el-input>
                    <el-radio-group v-model="sortType">
                        <el-radio-button label="时间" value="time" />
                        <el-radio-button label="热度" value="star" />
                    </el-radio-group>
                </div>

                <el-timeline style="max-width: 600px">
                    <el-timeline-item v-for="item in actvtList" :timestamp="`${item.activity_start}`" placement="top"
                        :color="new Date(item.activity_end) > new Date() ? new Date(item.activity_start) < new Date() ? '#ffa500' : '#15a8ff' : '#909399'"
                        size="large">
                        <el-card shadow="hover" :class="{ 'myclubactvt': actvtType == 'myclubs' }">
                            <div class="title">
                                <h3>{{ item.activity_name }}
                                    <el-tag round effect="plain"
                                        :type="new Date(item.activity_end) > new Date() ? new Date(item.activity_start) < new Date() ? 'warning' : 'primary' : 'info'">
                                        {{ new Date(item.activity_end) > new Date() ? new Date(item.activity_start) <
                                            new Date() ? '进行中' : '未开始' : '已结束' }} </el-tag>
                                </h3>
                                <div class="star">
                                    期待值：
                                    <span><el-icon>
                                            <StarFilled />
                                        </el-icon>{{ item.expectation.score }}</span>
                                </div>
                            </div>
                            <div class="shortcut">
                                <div class="time"><span>举办时间：</span>{{ item.activity_start }} 至 {{ item.activity_end }}
                                </div>
                                <div class="place"><span>举办地点：</span>{{ item.activity_place }}</div>
                                <div class="num"><span>期待人数：</span><i class="iconfont icon-shetuan"></i>
                                    {{ item.expectation.score == 0 ? '暂无' : Object.keys(item.expectation.users).length
                                    }}</div>
                            </div>
                            <div class="club">
                                <div class="left" @click="showActvtDetail(item)">
                                    <div class="bg"></div>
                                    <div>
                                        <span>查看</span>
                                        <el-icon>
                                            <ArrowRight />
                                        </el-icon>
                                    </div>
                                </div>
                                <div class="right">
                                    <span>{{ item.club_name }}</span>
                                    <div class="image"><img :src="'http://localhost:3000' + item.club_avatar"></div>
                                </div>
                            </div>
                        </el-card>
                    </el-timeline-item>
                    <el-timeline-item v-if="actvtList.length == 0" :icon=CloseBold color="tomato">
                        <el-card>
                            <div class="no-data">
                                <h3>NO DATA</h3>
                                <div>当前分类中没有任何有关 <span>{{ keyword }}</span> 的活动</div>
                            </div>
                        </el-card>
                    </el-timeline-item>
                </el-timeline>
            </div>
            <div :class="{ 'bgtext': true, 'bgtext-mounted': isMounted }" :style="actvtDetailCard.activity_id?'color:white':''">
                <div class="cn">发现激情，创造回忆，一起点燃校园生活的火花！</div>
                <div class="en">Discover passion, create memories, and ignite the sparks of campus life together!</div>
            </div>
            <Transition>
                <div class="actvt-card" v-if="actvtDetailCard.activity_id">
                    <div class="poster">
                        <img :src="'http://localhost:3000/' + actvtDetailCard.activity_poster">
                        <div class="overlay">
                            <div class="avatar">
                                <img :src="'http://localhost:3000/' + actvtDetailCard.club_avatar">
                            </div>
                            <div class="time">
                                <span>
                                    <el-icon>
                                        <Clock />
                                    </el-icon>
                                    举办时间
                                </span>
                                {{ actvtDetailCard.activity_start }} - {{ actvtDetailCard.activity_end }}
                            </div>
                            <div class="place">
                                <span>
                                    <el-icon>
                                        <LocationInformation />
                                    </el-icon>
                                    举办地点
                                </span>
                                {{ actvtDetailCard.activity_place }}
                            </div>
                            <div class="expect">
                                <span>
                                    <el-icon>
                                        <Stopwatch />
                                    </el-icon>
                                    我的期待
                                </span>
                                <div v-show="!store.userInfo.userid" style="font-size: 14px;color: #ccc;">
                                    登录后即可为该活动评分
                                </div>
                                <div v-show="store.userInfo.userid">
                                    <el-rate v-model="myexpectation" size="large"
                                        :colors="['#99A9BF', '#F7BA2A', '#FF9900']"
                                        :disabled="new Date(actvtDetailCard.activity_end) < new Date() || (actvtDetailCard.expectation?.users[store.userInfo.userid])" />
                                    <el-button round type="none" plain size="small" @click="rateActivity"
                                        v-if="new Date(actvtDetailCard.activity_end) > new Date() && (!actvtDetailCard.expectation?.users[store.userInfo.userid])">提交</el-button>
                                </div>
                            </div>
                            <div class="file" v-if="actvtDetailCard.activity_file">
                                <span>
                                    <el-icon>
                                        <Paperclip />
                                    </el-icon>
                                    相关文件
                                </span>
                                <div class="filedownload" @click="downloadFile">
                                    <div class="border"></div>
                                    {{ actvtDetailCard.activity_file?.filename }}
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="article">
                        <div>
                            <h3>{{ actvtDetailCard.activity_name }}</h3>
                        </div>
                        <div class="content">
                            <div v-html="actvtDetailCard.activity_content"></div>
                        </div>
                    </div>
                </div>
            </Transition>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue'
import { useHomeStore } from '@/stores/home'
import axios from 'axios'
import { ElMessage, ElNotification } from 'element-plus'
import { Search, StarFilled, ArrowRight, CloseBold, LocationInformation, Clock, Stopwatch, Paperclip } from '@element-plus/icons-vue'

const store = useHomeStore()
const isMounted = ref(false)
const actvtType = ref('all')
const sortType = ref('time')
const keyword = ref('')
const myclubs = ref('')
const actvtListData = ref([])
const actvtList = computed(() => {
    let arr = []
    switch (actvtType.value) {
        case 'all':
            arr = actvtListData.value.filter(item => new Date(item.activity_end) > new Date())
            break
        case 'pre':
            arr = actvtListData.value.filter(item => new Date(item.activity_start) > new Date())
            break
        case 'now':
            arr = actvtListData.value.filter(item => new Date(item.activity_start) < new Date() && new Date(item.activity_end) > new Date())
            break
        case 'end':
            arr = actvtListData.value.filter(item => new Date(item.activity_end) < new Date())
            break
        case 'myclubs':
            arr = actvtListData.value.filter(item => myclubs.value.includes(item.club_id))
    }
    if (keyword.value) {
        return arr.filter(item => item.activity_name.includes(keyword.value) || item.club_name.includes(keyword.value))
    }
    if (sortType.value == 'time' && (actvtType.value !== 'end' || actvtType.value == 'myclubs')) {
        return arr.sort((a, b) => new Date(a.activity_start) - new Date(b.activity_start))
    } else if (sortType.value == 'star') {
        return arr.sort((a, b) => b.expectation.score - a.expectation.score)
    }
    else {
        return arr.sort((a, b) => new Date(b.activity_start) - new Date(a.activity_start))
    }

})

onMounted(async () => {
    await getUserClub()
    await getActivities()
    isMounted.value = true
})

// 获取所有活动
const getActivities = async () => {
    const res = await axios.get(`/frontapi/show/activities`)
    actvtListData.value = res.data.data
}
// 获取用户社团
const getUserClub = async () => {
    if (store.userInfo.userid) {
        const res = await axios.get(`/frontapi/activities/getuserclubs/${store.userInfo.userid}`)
        myclubs.value = res.data.data.map(item => item.club_id).join(',')
    } else {
        return
    }
}

// 显示活动详情信息卡片
const actvtDetailCard = ref({})
const showActvtDetail = (actvt) => {
    actvtDetailCard.value = {}
    setTimeout(() => {
        actvtDetailCard.value = actvt
        myexpectation.value = actvtDetailCard.value.expectation.users[store.userInfo.userid]
    }, 100)
}

// 评分
const myexpectation = ref('')
const rateActivity = async () => {
    const res = await axios.put(`/frontapi/activities/rate`, { userid: store.userInfo.userid, rate: myexpectation.value, id: actvtDetailCard.value.activity_id })
    if (res.data.success) {
        ElNotification.success({
            title: '评分成功',
            message: `我的期待值为： ${myexpectation.value}分`,
            duration: 1500
        })
        await getActivities()
        actvtDetailCard.value.expectation.users[store.userInfo.userid] = myexpectation.value
    } else {
        ElMessage.error(res.data.message)
    }
}

// 下载文件
const downloadFile = async () => {
    const res = await axios.get(`/frontapi/activities/downloadfile`, { params: { filepath: actvtDetailCard.value.activity_file.filepath }, responseType: "blob" })
    const url = URL.createObjectURL(res.data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', actvtDetailCard.value.activity_file.filename)
    link.click()
    URL.revokeObjectURL(url)
}
</script>

<style lang="scss" scoped>
.v-enter-active {
    transition: all 0.5s ease;
}

.v-leave-active {
    transition: all 1ms ease;
}

.v-enter-from {
    opacity: 0;
    transform: translateX(-100px);
}

.v-leave-to {
    opacity: 0;
}

.no-data {
    font-weight: 100;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 150px;
    gap: 10px;

    h3 {
        font-size: 30px;
        color: tomato;
    }

    span {
        color: tomato;
    }
}

.root {
    display: flex;
    overflow: hidden;

    .nav {
        width: 200px;
        height: calc(100vh - 100px);
        position: relative;
        // border-right: 1px solid #ccc;
        transform: translateX(-200px);
        transition: all 0.5s ease;

        .active {
            background: linear-gradient(45deg, rgba(64, 158, 255, 1), rgba(85, 231, 252, 1));
            border-radius: 50px 0 0 50px;
            color: white;

            &:last-child {
                background: linear-gradient(45deg, #9378ff, #ff77c2);
            }

            &:hover {
                background: linear-gradient(45deg, rgba(64, 158, 255, 1), rgba(85, 231, 252, 1));
            }
        }

        li {
            width: 100%;
            height: 80px;
            user-select: none;
            cursor: pointer;
            transition: all 0.5s ease;
            font-weight: 100;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            gap: 10px;

            .cn {
                font-size: 18px;
                height: 18px;
            }

            .en {
                height: 10px;
                font-size: 10px;
            }

            &:hover {
                background: linear-gradient(45deg, rgba(64, 158, 255, 0.5), rgba(85, 231, 252, 0.5));
                border-radius: 50px 0 0 50px;
                color: white;

                &:last-child {
                    background: linear-gradient(45deg, #9378ff, #ff77c2);
                }
            }

            &:last-child {
                position: absolute;
                bottom: 0;
            }
        }
    }

    .main {
        width: calc(100% - 200px);
        height: calc(100vh - 100px);
        display: flex;
        align-items: center;
        justify-content: space-between;

        .actvt-timeline {
            width: 34%;
            height: 100%;
            overflow: auto;
            padding: 20px;
            padding-top: 0;
            box-sizing: border-box;
            position: relative;
            transition: all 0.5s ease;
            transform: translateY(-800px);

            &::-webkit-scrollbar {
                width: 5px;
                background-color: transparent;
            }

            &::-webkit-scrollbar-thumb {
                width: 10px;
                background: linear-gradient(15deg, rgba(64, 158, 255, 0.5), rgba(85, 231, 252, 0.5));
                border-radius: 5px;
            }

            .pannel {
                position: sticky;
                height: 50px;
                top: 0;
                left: 0;
                padding: 0 5px;
                z-index: 2;
                background-color: white;
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #e8e8e8;
                margin-bottom: 10px;
                border-bottom: 1px solid #ccc;

                :deep(.el-input) {
                    width: 240px;

                    .el-input__wrapper {
                        border-radius: 50px;
                    }
                }

                :deep(.el-radio-group) {
                    .el-radio-button.is-active {
                        &:hover .el-radio-button__inner {
                            color: white;
                        }

                        .el-radio-button__inner {
                            background: linear-gradient(45deg, rgba(64, 158, 255, 1), rgba(85, 231, 252, 1));
                            border-color: rgb(72, 186, 254);
                            box-shadow: none;
                        }
                    }

                    .el-radio-button {
                        &:hover .el-radio-button__inner {
                            color: rgb(72, 186, 254);
                        }

                        &:first-child .el-radio-button__inner {
                            border-radius: 20px 0 0 20px;
                        }

                        &:last-child .el-radio-button__inner {
                            border-radius: 0 20px 20px 0;
                        }
                    }
                }
            }

            :deep(.el-timeline) {
                .el-timeline-item {
                    .el-timeline-item__timestamp {
                        color: #797979;
                    }

                    .el-card {
                        cursor: pointer;
                        user-select: none;
                        transition: all 0.2s ease;
                        border-radius: 10px;

                        &:hover {
                            box-shadow: 0 0 15px 0 rgba(52, 174, 255, 0.5);
                            transform: scale(1.02);

                            h3 {
                                color: rgb(21, 169, 255);
                            }
                        }

                        &:active {
                            transform: translateX(20px);
                        }

                        .title {
                            display: flex;
                            justify-content: space-between;
                            font-weight: 100;

                            .el-tag--primary {
                                .el-tag__content {
                                    color: rgb(21, 169, 255);
                                }
                            }

                            .star {
                                display: flex;
                                justify-content: end;
                                align-items: center;
                                font-size: 12px;

                                span {
                                    font-size: 16px;
                                    display: flex;
                                    align-items: end;

                                    i {
                                        font-size: 20px;
                                        color: orange;
                                    }
                                }
                            }
                        }

                        .shortcut {
                            margin: 20px 0;
                            margin-bottom: 10px;
                            display: flex;
                            flex-direction: column;

                            div {
                                margin-bottom: 5px;
                                font-weight: 100;

                                span {
                                    font-size: 14px;
                                    font-weight: normal;
                                }
                            }

                            .time {
                                font-size: 12px;
                            }

                            .num {
                                i {
                                    margin-right: 5px;
                                }
                            }
                        }

                        .club {
                            display: flex;
                            justify-content: space-between;
                            font-weight: 100;

                            .left {
                                position: relative;
                                transition: all 0.2s ease;
                                overflow: hidden;

                                .bg {
                                    width: 100px;
                                    height: 100%;
                                    background: linear-gradient(45deg, rgba(64, 158, 255, 1), rgba(85, 231, 252, 1));
                                    position: absolute;
                                    top: 0;
                                    left: 0;
                                }

                                div {
                                    width: 100px;
                                    height: 100%;
                                    display: flex;
                                    justify-content: center;
                                    align-items: center;
                                    box-sizing: border-box;
                                    border: 1px solid #ccc;
                                    border-radius: 30px;
                                    background-color: white;
                                    position: relative;
                                    transition: all 0.2s ease;

                                    &:hover {
                                        background-color: transparent;
                                        color: white;
                                        border: none;
                                    }

                                    &:active {
                                        transform: translateX(20px);
                                    }

                                    i {
                                        font-size: 16px;
                                        margin-left: 5px;
                                    }
                                }
                            }

                            .right {
                                display: flex;
                                align-items: center;
                                justify-content: end;

                                .image {
                                    width: 40px;
                                    height: 40px;
                                    position: relative;
                                    margin-left: 10px;

                                    img {
                                        position: absolute;
                                        width: 40px;
                                        height: 40px;
                                        object-fit: cover;
                                        object-position: center;
                                        position: absolute;
                                        top: 0;
                                        left: 0;
                                        border-radius: 50%;
                                        border: 2px solid #6f6f6f;
                                    }
                                }
                            }
                        }
                    }

                }
            }
        }

        .mounted {
            transform: translateY(0);
        }

        .bgtext {
            position: absolute;
            right: 0;
            width: 57%;
            height: calc(100vh - 100px);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-weight: 100;
            transform: translateX(900px);
            transition: all 0.5s ease;

            .cn {
                font-size: 30px;
                margin-bottom: 10px;
            }

            .en {
                font-size: 16px;
            }
        }

        .bgtext-mounted {
            transform: translateX(0);
        }

        .actvt-card {
            width: 62%;
            height: calc(100vh - 120px);
            box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);
            box-sizing: border-box;
            margin-right: 20px;
            display: flex;
            padding: 10px;
            padding-right: 0;
            box-sizing: border-box;
            border-radius: 10px;
            background-color: white;
            z-index: 1;

            .poster {
                width: 48%;
                position: relative;
                overflow: hidden;
                border-radius: 5px 0 0 5px;

                img {
                    width: 100%;
                    height: 100%;
                    transition: all 0.5s ease;
                }

                &:hover {
                    .overlay {
                        opacity: 0.9;

                        .avatar {
                            transform: translateY(0);

                            img {
                                animation: rotateImg 10s linear infinite;
                            }

                            @keyframes rotateImg {
                                from {
                                    transform: rotate(0deg)
                                }

                                to {
                                    transform: rotate(360deg)
                                }
                            }
                        }

                        .time {
                            transform: translateX(0);
                        }

                        .place {
                            transform: translateX(0);
                        }

                        .expect,
                        .file {
                            transform: translateY(0);
                        }
                    }

                    img {
                        transform: scale(1.1);
                    }

                }

                .overlay {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    background-color: white;
                    overflow: hidden;
                    justify-content: center;
                    transition: all 0.5s ease;
                    opacity: 0;

                    div {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        font-weight: 100;
                        font-size: 18px;
                        margin-bottom: 15px;
                        transition: all 0.5s ease;

                        span {
                            font-size: 16px;
                            display: flex;
                            align-items: center;
                            margin-bottom: 5px;

                            i {
                                margin-right: 10px;
                            }
                        }
                    }

                    .avatar {
                        width: 200px;
                        height: 200px;
                        position: relative;
                        border-radius: 50%;
                        transform: translateY(-500px);
                        transition: all 0.5s ease;

                        img {
                            position: absolute;
                            width: 200px;
                            height: 200px;
                            object-fit: cover;
                            object-position: center;
                            position: absolute;
                            top: 0;
                            left: 0;
                            border-radius: 50%;
                        }
                    }

                    .time {
                        transform: translateX(-600px);

                        i {
                            font-size: 22px;
                        }
                    }

                    .place {
                        transform: translateX(500px);

                        i {
                            font-size: 24px;
                        }
                    }

                    .expect {
                        transform: translateY(500px);

                        i {
                            font-size: 22px;
                        }

                        .el-rate {
                            display: inline;
                            margin-bottom: 0;
                            height: 30px;
                        }
                    }

                    .file {
                        transform: translateY(500px);
                        margin-top: 40px;
                        transition: all 0.5s 0.1s ease;
                        position: relative;

                        span {
                            font-size: 14px;
                        }

                        i {
                            font-size: 16px;
                        }

                        .filedownload {
                            font-size: 16px;
                            position: relative;
                            text-decoration: none;
                            transition: all 0.3s ease;
                            font-size: 14px;
                            cursor: pointer;
                            color: #515151;

                            &:hover {
                                color: #9378ff;

                                .border {
                                    width: 100%;
                                }
                            }

                            .border {
                                position: absolute;
                                top: 0;
                                left: 0;
                                width: 0;
                                height: 22px;
                                border-bottom: 1px solid #9378ff;
                            }
                        }
                    }
                }
            }

            .article {
                width: 48%;
                padding-left: 20px;
                background-color: white;
                border-radius: 0 5px 5px 0;
                color: #303030;

                h3 {
                    text-align: center;
                }

                .content {
                    margin-top: 5px;
                    height: calc(100% - 30px);
                    overflow-y: auto;
                    // padding-right: 20px;

                    &::-webkit-scrollbar {
                        width: 2px;
                        background-color: transparent;
                    }

                    &::-webkit-scrollbar-thumb {
                        width: 5px;
                        background: rgba($color: #000, $alpha: 0.2);
                        border-radius: 5px;
                    }

                    div {
                        text-align: justify;

                        :deep(ul) {
                            margin-left: 20px;
                        }

                        :deep(ol) {
                            margin-left: 20px;
                        }
                    }
                }

            }
        }
    }

    .isMounted {
        transform: translateX(0);
    }
}

.slide-in-enter-active,
.slide-in-leave-active {
    transition: transform 0.5s ease;
}

.slide-in-enter,
.slide-in-leave-to {
    transform: translateX(-600px);
}
</style>