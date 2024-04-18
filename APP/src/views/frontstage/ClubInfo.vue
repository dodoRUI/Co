<template>
    <div :class="{ 'root': true, 'is-mounted': isMounted }">
        <div class="header" :style="{ backgroundImage: 'url(http://localhost:3000/' + clubinfo.club_background + ')' }">
            <div class="clubavatar">
                <div class="avatar">
                    <div class="popularity">
                        <i class="iconfont icon-renqi" @click="clubVote"></i>
                        <span>{{ clubinfo.club_star }}</span>
                    </div>
                    <img :src="'http://localhost:3000/' + clubinfo.club_avatar">
                </div>
                <div class="clubtype">{{ clubType[clubinfo.club_type - 1] }}</div>
            </div>

            <div class="title">
                <div class="clubname">
                    {{ clubinfo.club_name }}
                    <div class="apply-button" v-if="clubinfo.isMember" style="right: -80px;"
                        @click="() => { quitClubDialog = true }">已加入</div>
                    <div class="apply-button applying" v-else-if="clubinfo.applyState" style="right: -120px;">申请审核中
                    </div>
                    <div class="apply-button apply" v-else style="right: -100px;" @click="showApplyDialog">申请加入</div>
                </div>
                <div class="tag">
                    <div class="college">{{ clubinfo.club_belong }}</div>
                </div>
            </div>
        </div>
        <div class="content">
            <div class="news">
                <div class="title">最新资讯</div>
                <div class="data">
                    <div v-if="!clubinfo.news" class="no-data">暂无资讯</div>
                    <div v-else class="news-data">
                        <div class="news-title" @click="news_drawer = !news_drawer">
                            {{ clubinfo.news?.news_title }}
                        </div>
                        <div class="news-text" v-html="clubinfo.news?.news_content"></div>
                        <div>......</div>
                    </div>
                </div>
            </div>
            <div class="basis">
                <div class="title">基本信息</div>
                <div class="info">
                    <div><span>社团编号：</span>{{ clubinfo.club_id }}</div>
                    <div><span>社团名称：</span>{{ clubinfo.club_name }}</div>
                    <div><span>社团分类：</span><span class="clubtype">{{ clubType[clubinfo.club_type - 1] }}</span></div>
                    <div><span>所属学院：</span>{{ clubinfo.club_belong }}</div>
                    <div><span>成立时间：</span>{{ clubinfo.club_birth }}</div>
                    <div>
                        <span>社长：</span>
                        <img :src="'http://localhost:3000/' + clubinfo.minister?.avatar" />
                        {{ clubinfo.minister?.username }}
                    </div>
                </div>
            </div>
            <div class="members">
                <div class="title">成员概况</div>
                <div class="data">
                    <div class="total">
                        <el-progress type="circle" :percentage="total / 97 * 100" status="success">
                            <el-statistic title="社团总人数" :value="totalNum" />
                        </el-progress>

                    </div>
                    <div class="gender">
                        <div class="gender-ratio-number">
                            <el-statistic :value="clubinfo.male_count">
                                <template #title>
                                    <div style="display: inline-flex; align-items: center">
                                        男女成员比例
                                    </div>
                                </template>
                                <template #suffix>{{ clubinfo.female_count }}</template>
                            </el-statistic>
                        </div>
                        <div class="gender-ratio-bar">
                            <div class="male" :style="{ 'width': (clubinfo.male_count / total * 100).toFixed() + '%' }">
                                <el-icon>
                                    <Male />
                                </el-icon>{{ (clubinfo.male_count / total * 100).toFixed() + '%' }}
                            </div>
                            <div class="female"
                                :style="{ 'width': (clubinfo.female_count / total * 100).toFixed() + '%' }">
                                <el-icon>
                                    <Female />
                                </el-icon>{{ (clubinfo.female_count / total * 100).toFixed() + '%' }}
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            <div class="profile">
                <div class="title">社团介绍</div>
                <div class="text">{{ clubinfo.club_profile }}</div>
            </div>
            <div class="activity">
                <div class="title">最新活动</div>
                <div class="data">
                    <div v-if="!clubinfo.actvt" class="no-data">暂无活动</div>
                    <div v-else>
                        <div class="actvt-name">{{ clubinfo.actvt?.activity_name }}</div>
                        <div class="actvt-content">
                            <div>
                                <el-icon style="font-size: 18px;">
                                    <Clock />
                                </el-icon>
                                <span style="text-align: center;">{{ clubinfo.actvt?.activity_start }} <br>至<br> {{
                                    clubinfo.actvt?.activity_end }}</span>
                            </div>
                            <div>
                                <el-icon>
                                    <LocationInformation />
                                </el-icon>
                                <span>{{ clubinfo.actvt?.activity_place }}</span>
                            </div>
                            <div>
                                <el-icon>
                                    <Medal />
                                </el-icon>
                                <span style="display: flex;align-items: center;">
                                    期待值
                                    <el-icon style="font-size: 18px;margin-left: 10px;margin-right: 5px;color: orange;">
                                        <StarFilled />
                                    </el-icon>
                                    <span style="color: orange;">{{ clubinfo.actvt?.expectation.score }}</span>
                                </span>
                            </div>
                            <div v-show="clubinfo.actvt.activity_file.filename">
                                <el-icon>
                                    <Paperclip />
                                </el-icon>
                                <span class="filename" @click="downloadFile">{{ clubinfo.actvt?.activity_file.filename
                                    }}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- 详情 -->
        <el-drawer v-model="news_drawer" :with-header="false" direction="rtl" class="drawer">
            <div class="news-drawer__title">
                {{ clubinfo.news?.news_title }}
            </div>
            <div class="news-drawer__content">
                <div v-html="clubinfo.news?.news_content"></div>
            </div>
            <div class="news-drawer__minister">
                <img :src="'http://localhost:3000' + clubinfo.minister?.avatar">
                <span>{{ clubinfo.minister?.username }}</span>
            </div>
            <div class="news-drawer__time">
                <span>编辑时间：</span>
                {{ clubinfo.news?.edit_time }}
            </div>
        </el-drawer>

        <!-- 申请加入社团 -->
        <el-dialog v-model="applyClubDialog" width="500" center :title="clubinfo.club_name">
            <el-input v-model="applyText" type="textarea" placeholder="申请说明" resize="none" show-word-limit
                maxlength="100" rows="5">

            </el-input>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="applyClubDialog = false">取消</el-button>
                    <el-button type="primary" @click="submitApply">
                        提交申请
                    </el-button>
                </div>
            </template>
        </el-dialog>

        <el-dialog v-model="quitClubDialog" width="500" center>
            <div style="font-size: 16px;">你即将<span style="color: red;">退出</span> <span style="font-weight: bold;">{{
                clubinfo.club_name }}</span> 是否继续？</div>
            <template #footer>
                <div class="dialog-footer">
                    <el-button @click="quitClubDialog = false">取消</el-button>
                    <el-button type="danger" @click="quitClub">
                        退出
                    </el-button>
                </div>
            </template>
        </el-dialog>
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { Female, Male, Clock, LocationInformation, Medal, Paperclip, StarFilled } from '@element-plus/icons-vue'
import axios from 'axios'
import getDateTime from '@/utils/getDateTime'
import formatDateTime from '@/utils/formatDateTime'
import { useHomeStore } from '@/stores/home'
import { useTransition } from '@vueuse/core'
import { ElMessage, ElNotification } from 'element-plus'

const store = useHomeStore()
const route = useRoute()
const clubinfo = ref({})
const total = ref(0)
const totalNum = useTransition(total, {
    duration: 1000,
})
const clubType = ref(['学科学术类', '文化艺术类', '体育健身类', '志愿服务类', '科技创新类', '兴趣爱好类', '国际交流类', '创业就业类'])
const news_drawer = ref(false)
const isMounted = ref(false)

onMounted(async () => {
    await getClubData(route.query.id)
    isMounted.value = true
})

// 获取该社团信息
const getClubData = async (id) => {
    const userid = store.userInfo.userid ? store.userInfo.userid : '000'
    const res = await axios.get(`/frontapi/show/clubs/clubinfo/${id}/${userid}`)
    clubinfo.value = res.data.data
    setTimeout(() => {
        total.value = clubinfo.value.members
    }, 600)
}

// 下载文件
const downloadFile = async () => {
    const res = await axios.get(`/frontapi/activities/downloadfile`, { params: { filepath: clubinfo.value.actvt.activity_file.filepath }, responseType: "blob" })
    const url = URL.createObjectURL(res.data)
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', clubinfo.value.actvt.activity_file.filename)
    link.click()
    URL.revokeObjectURL(url)
}

// 申请加入社团
const showApplyDialog = () => {
    if (!store.userInfo.userid) {
        ElMessage.error('请先登录')
    } else {
        applyClubDialog.value = true
    }
}
const applyClubDialog = ref(false)
const applyText = ref('')
const submitApply = async () => {
    const res = await axios.post('/frontapi/clubs/applyclub', {
        apply_user: store.userInfo.userid,
        apply_club: clubinfo.value.club_id,
        apply_text: applyText.value,
        apply_time: getDateTime.date(),
    })
    if (res.data.success) {
        ElMessage.success(res.data.message)
    } else {
        ElMessage.error(res.data.message)
    }
    applyClubDialog.value = false
    await getClubData(route.query.id)
}

// 退出社团
const quitClubDialog = ref(false)
const quitClub = async () => {
    const res = await axios.post('/frontapi/clubs/quitclub', {
        userid: store.userInfo.userid,
        clubid: clubinfo.value.club_id
    })
    if (res.data.success) {
        ElNotification.success({
            title: '退出成功',
            message: `你已退出 ${clubinfo.value.club_name}`,
            duration: 1500,
        })
    } else {
        ElNotification.error({
            title: '退出失败',
            message: res.data.message,
            duration: 1500,
        })
    }
    quitClubDialog.value = false
    await getClubData(route.query.id)
}

// 社团投票
const clubVote = async () => {
    if (!store.userInfo.userid) {
        ElMessage.error('请先登录')
        return
    } else {
        const todayVote = clubinfo.value.todayVote
        if (todayVote && todayVote.split(',')[0] === formatDateTime.date(new Date())) {
            ElNotification({
                title: '投票失败',
                message: `今日已为 ${todayVote.split(',')[1]}投票，请明日再试！`,
                type: 'error',
                duration: 1500,
            })
            return
        } else {
            const res = await axios.post('/frontapi/clubs/clubvote', {
                userid: store.userInfo.userid,
                clubid: clubinfo.value.club_id,
                date: getDateTime.date()
            })
            if (res.data.success) {
                ElNotification({
                    title: '投票成功',
                    message: `投票成功，${clubinfo.value.club_name} 票数+1`,
                    type: 'success',
                    duration: 1500,
                })
                await getClubData(route.query.id)
            } else {
                ElNotification({
                    title: '投票失败',
                    type:'error',
                    message: res.data.message,
                })
            }
        }
    }
}
</script>

<style scoped lang="scss">
:deep(.el-dialog) {
    margin: 0 auto;
    margin-top: calc(15%);
    border-radius: 10px;


    .el-dialog__header {
        font-weight: normal;

        .el-dialog__title {
            color: rgb(64, 158, 255);
        }
    }
}

.is-mounted {
    .header {
        transform: translateY(0) !important;
    }

    .content {
        .basis {
            transform: translateY(0) !important;
        }

        .members {
            transform: translateY(0) !important;
        }

        .news {
            transform: translateY(0) !important;
        }

        .profile {
            transform: translateY(0) !important;
        }

        .activity {
            transform: translateY(0) !important;
        }
    }

}

.root {
    width: 100%;
    height: calc(100vh - 100px);
    overflow: hidden;

    .header {
        width: 100%;
        height: 300px;
        position: relative;
        box-sizing: border-box;
        user-select: none;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: cover;
        background-position: center;
        color: white;
        transition: all 0.5s ease;
        transform: translateY(-300px);

        .clubavatar {
            height: 100%;
            position: relative;
            display: flex;
            flex-direction: column;
            justify-content: center;

            .avatar {
                width: 200px;
                height: 200px;
                position: relative;
                border-radius: 50%;
                border: 4px solid white;
                overflow: hidden;
                z-index: 2;
                transition: all 0.5s ease;

                &:hover {
                    background-color: rgba($color: #fff, $alpha: 0.2);

                    img {
                        transform: scale(1.05);
                        opacity: 0;
                    }

                    .popularity {
                        opacity: 1;
                    }
                }

                .popularity {
                    width: 100%;
                    height: 100%;
                    position: absolute;
                    z-index: 3;
                    display: flex;
                    flex-direction: column;
                    gap: 15px;
                    justify-content: center;
                    align-items: center;
                    opacity: 0;
                    transition: all 0.5s ease;
                    border-radius: 50%;

                    i {
                        font-size: 80px;
                        cursor: pointer;
                        transition: all 0.2s ease;

                        &:hover {
                            color: orangered;
                        }

                        &:active {
                            transform: scale(0.95);
                        }
                    }

                    span {
                        font-size: 30px;
                        font-weight: 100;
                    }
                }

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
                    transition: all 0.5s ease;
                }
            }

            .clubtype {
                width: 100px;
                height: 30px;
                display: flex;
                justify-content: center;
                align-items: center;
                border: 1px solid white;
                background-color: rgba($color: #000, $alpha: 0.2);
                border-radius: 20px;
                position: absolute;
                text-align: center;
                bottom: 10px;
                left: calc(50% - 50px);
            }
        }



        .title {
            font-size: 60px;
            font-weight: bold;
            margin-left: 50px;
            color: white;

            .clubname {
                border-bottom: 2px solid white;
                padding-bottom: 10px;
                position: relative;

                .apply-button {
                    font-size: 16px;
                    position: absolute;
                    top: calc(50% - 10px);
                    font-weight: 100;
                    padding: 5px 8px;
                    border-radius: 20px;
                    background-color: white;
                    border: 1px solid white;
                    color: #3f3f3f;
                    cursor: pointer;
                    transition: all 0.3s ease;

                    &:active {
                        transform: scale(0.9);
                    }
                }

                .apply {
                    background-color: transparent;
                    color: white;

                    &:hover {
                        background: white;
                        color: #3f3f3f;
                    }
                }

                .applying {
                    background-color: rgba($color: #fff, $alpha: 0.2);
                    color: white;
                }
            }

            .tag {
                font-size: 16px;
                display: flex;
                justify-content: center;
                gap: 20px;
                margin-top: 10px;
                position: relative;
            }
        }
    }

    .content {
        height: calc(100vh - 400px);
        width: 100%;
        box-sizing: border-box;
        display: flex;
        justify-content: center;
        color: #3e3e3e;

        &>div {
            height: 100%;
            display: flex;
            flex-direction: column;
            align-items: center;
            flex: 1;
            font-weight: 100;
            padding: 20px;
            box-sizing: border-box;
            overflow: hidden;
        }

        .title {
            font-size: 25px;
            font-weight: 100;
            margin-bottom: 20px;
        }

        .basis {
            transition: all 0.5s 0.1s ease;
            transform: translateY(500px);

            .info {
                box-sizing: border-box;

                .clubtype {
                    display: inline-block;
                    padding: 3px 5px;
                    border: 1px solid #3e3e3e;
                    font-size: 14px;
                }

                div {
                    margin-bottom: 15px;
                    display: flex;
                    align-items: center;

                    span {
                        font-size: 18px;
                    }

                    img {
                        width: 50px;
                        border-radius: 50%;
                        margin-right: 15px;
                    }
                }
            }
        }

        .members {
            transition: all 0.5s ease;
            transform: translateY(500px);

            .data {
                width: 100%;
                flex: 1;
                display: flex;
                flex-direction: column;
                align-items: center;


                .total {
                    width: 100%;
                    flex: 1;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    :deep(.el-statistic) {
                        width: 126px;
                        height: 126px;
                        display: flex;
                        box-sizing: border-box;
                        border-radius: 100px;
                        flex-direction: column;
                        justify-content: center;
                        align-items: center;
                    }
                }

                .gender {
                    flex: 1;
                    width: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 20px;

                    .gender-ratio-number {
                        width: 100%;

                        :deep(.el-statistic) {
                            width: 100%;
                            display: flex;
                            flex-direction: column;
                            align-items: center;
                            font-weight: 100;

                            .el-statistic__head {
                                font-size: 16px;
                            }

                            .el-statistic__content {
                                width: 100%;
                                font-size: 16px;
                                display: flex;
                                justify-content: space-around;
                                color: #505050;
                            }
                        }
                    }

                    .gender-ratio-bar {
                        width: 100%;
                        display: flex;
                        justify-content: space-between;
                        align-items: center;

                        div {
                            height: 30px;
                            display: flex;
                            justify-content: center;
                            align-items: center;
                            color: white;
                            box-sizing: border-box;

                            i {
                                margin-right: 5px;
                            }
                        }

                        .male {
                            width: 0;
                            transition: all 1s 0.5s ease;
                            background: linear-gradient(15deg, #417dff, #55e7fc);
                            clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
                        }

                        .female {
                            width: 100%;
                            transition: all 1s 0.5s ease;
                            background: linear-gradient(-15deg, #8b6eff, #ff75c1);
                            clip-path: polygon(20px 0%, 100% 0%, calc(100% - 20px) 100%, 0% 100%);
                        }
                    }



                }
            }
        }

        .profile {
            transition: all 0.5s 0.1s ease;
            transform: translateY(500px);

            .text {
                text-indent: 2em;
                line-height: 22px;
            }
        }

        .activity {
            transition: all 0.5s 0.2s ease;
            transform: translateY(500px);

            .data {
                width: 100%;
                height: 100%;
                display: flex;
                position: relative;
                flex-direction: column;

                .no-data {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ccc;
                }

                .actvt-name {
                    font-weight: bold;
                    text-align: center;
                    margin-bottom: 20px;
                }

                .actvt-content {
                    display: flex;
                    flex-direction: column;

                    div {
                        display: flex;
                        align-items: center;
                        margin-bottom: 15px;

                        &>.el-icon {
                            font-size: 20px;
                            margin-right: 10px;
                        }

                        span {
                            font-size: 14px;
                        }

                        .filename {
                            cursor: pointer;
                            font-size: 12px;
                            border-bottom: 1px solid #484848;
                            transition: all 0.2s ease;

                            &:hover {
                                color: #623bff;
                                border-color: #592fff;
                            }
                        }
                    }
                }
            }
        }

        .news {
            transition: all 0.5s 0.2s ease;
            transform: translateY(500px);

            .data {
                width: 100%;
                height: 100%;
                overflow: hidden;

                .no-data {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    color: #ccc;
                }

                .news-data {
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;

                    .news-title {
                        font-weight: bold;
                        text-align: center;
                        margin-bottom: 5px;
                        cursor: pointer;
                        transition: all 0.3s ease;

                        &:hover {
                            background-image: linear-gradient(45deg, #417dff, #55e7fc);
                            background-clip: text;
                            -webkit-text-fill-color: transparent;
                        }
                    }

                    .news-text {
                        font-size: 14px;
                        overflow: hidden;
                        height: 75%;
                    }
                }
            }
        }
    }
}

:deep(.drawer) {
    width: 500px !important;
    background-color: transparent !important;
    box-shadow: none !important;
    padding: 20px;

    .el-drawer__body {
        width: 420px;
        background-color: white;
        box-shadow: 0px 0px 10px 0px rgba(0, 0, 0, 0.5);
        position: relative;
    }

    .news-drawer__title {
        font-weight: bold;
        font-size: 18px;
        text-align: center;
    }

    .news-drawer__content {
        margin-top: 10px;
        height: 560px;
        overflow-y: scroll;
        font-weight: 100;

        ol,
        ul {
            padding-left: 20px;
        }
    }

    .news-drawer__minister {
        position: absolute;
        bottom: 40px;
        right: 40px;
        display: flex;
        align-items: center;
        justify-content: end;

        img {
            width: 40px;
            height: 40px;
            border-radius: 25px;
            margin-right: 10px;
        }
    }

    .news-drawer__time {
        position: absolute;
        bottom: 20px;
        left: 20px;
        font-size: 12px;
    }
}
</style>