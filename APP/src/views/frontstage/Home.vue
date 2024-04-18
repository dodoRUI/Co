<template>
    <Transition>
        <div v-show="isMounted">
            <div class="video-container">
                <video src="@/assets/Discover the 1000+ clubs you can join at U of T!.mp4" autoplay muted loop
                    disablePictureInPicture>
                </video>
                <div class="hometitle">
                    <div class="cn">高校社团管理系统</div>
                    <div class="en">Clubs Management System of University</div>
                </div>
            </div>
            <div class="whitespace">
                <div class="text typewriter" v-show="startType">
                    "Unlock your potential, embrace the adventure, join the club and make your college experience
                    unforgettable!"
                </div>
            </div>
            <div class="recentnews">
                <h2>近期社团资讯</h2>
                <div class="search">
                    <el-input v-model="keyword" placeholder="查询关键字" :prefix-icon="Search"
                        @input="handleSearch()"></el-input>
                    <el-pagination v-model:current-page="currentPage" :page-size="5" layout="prev, pager, next"
                        :total="total" @current-change="handleCurrentChange" />
                </div>
                <ul>
                    <div v-show="clubNews.length === 0">暂无数据</div>
                    <li v-for="(item, index) in clubNews" :key="index">
                        <div class="clubinfo">
                            <div class="clubavatar">
                                <img :src="'http://localhost:3000' + item.club_avatar">
                            </div>
                            <div class="clubname">
                                <div class="club">
                                    {{ item.club_name }}
                                    <span><i class="iconfont icon-shetuan"></i>{{ item.members }}</span>
                                </div>
                                <div class="minister">{{ item.minister_name }}</div>
                            </div>
                        </div>
                        <div class="newsinfo">
                            <div class="title">{{ item.news_title }}</div>
                            <div class="content" v-html="item.news_content"></div>
                        </div>
                        <div class="button">
                            <div class="time">{{ item.edit_time }}</div>
                            <div class="more" @click="showNews(item, index)">
                                <span>详</span>
                                <span>情</span>
                                <el-icon>
                                    <ArrowDown />
                                </el-icon>
                            </div>
                        </div>
                    </li>
                </ul>
            </div>

            <!-- 详情 -->
            <el-drawer v-model="drawer" :with-header="false"
                :direction="(newsDrawer.index + 2) % 2 == 0 ? 'rtl' : 'ltr'" class="drawer">
                <div class="title">
                    {{ newsDrawer.news_title }}
                </div>
                <div class="content">
                    <div v-html="newsDrawer.news_content"></div>
                </div>
                <div class="minister">
                    <img :src="'http://localhost:3000' + newsDrawer.minister_avatar">
                    <span>{{ newsDrawer.minister_name }}</span>
                </div>
                <div class="time">
                    <span>编辑时间：</span>
                    {{ newsDrawer.edit_time }}
                </div>
            </el-drawer>
        </div>
    </Transition>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, onUnmounted } from 'vue';
import axios from 'axios'
import { ArrowDown, Search } from '@element-plus/icons-vue'

const clubNews = ref([])
const startType = ref(false)
const isMounted = ref(false)
onMounted(async () => {
    window.addEventListener('scroll', () => {
        console.log(window.scrollY)
        if (window.scrollY >= 300) {
            startType.value = true
        } else {
            startType.value = false
        }
    })
    await getClubNews(1)
    isMounted.value = true
})
onUnmounted(() => {
    window.removeEventListener('scroll', () => {
        startType.value = false
    })
})

const currentPage = ref(1)
const total = ref(0)

const handleCurrentChange = () => {
    if (keyword.value) {
        handleSearch(currentPage.value)
    }
    else {
        getClubNews(currentPage.value)
    }
}

const getClubNews = async (page) => {
    const res = await axios.get(`/frontapi/show/clubnews/${page}`)
    clubNews.value = res.data.data
    total.value = res.data.total
}

// 搜索关键字
const keyword = ref('')
const handleSearch = async (page) => {
    if (keyword.value !== '') {
        page = page ? page : 1
        currentPage.value = page
        const res = await axios.get(`/frontapi/show/clubnews/search/${keyword.value}/${page}`)
        clubNews.value = res.data.data
        total.value = res.data.total
    } else {
        currentPage.value = 1
        getClubNews(1)
    }
}

const drawer = ref(false)
const newsDrawer = ref({})
const showNews = (news, index) => {
    drawer.value = true
    newsDrawer.value = news
    newsDrawer.value.index = index
}
</script>

<style lang="scss" scoped>
.v-enter-active {
    transition: all 0.2s ease;
}

.v-enter-from {
    opacity: 0;
}

.video-container {
    height: 100vh;
    overflow: hidden;
    position: relative;

    video {
        width: 100%;
    }

    .hometitle {
        position: absolute;
        padding: 20px;
        top: calc(50% - 80px);
        left: 5%;
        border: 2px solid white;

        &:hover {
            background-color: rgba(255, 255, 255, 0.2);
        }

        ::selection {
            background-color: white;
            color: black;
        }

        .cn {
            font-size: 80px;
            color: white;
            font-weight: bold;
        }

        .en {
            text-align: right;
            font-size: 25px;
            color: white;
        }
    }
}

.whitespace {
    height: 300px;
    position: relative;
    font-weight: 100;
    font-size: 20px;
    // user-select: none;

    .text {
        height: 24px;
        line-height: 24px;
        position: absolute;
        top: calc(50% - 12px);
        left: calc(50% - 610px);
        width: 1220px;
        overflow: hidden;
        white-space: nowrap;
        letter-spacing: 2px;
        color: white;
    }

    .typewriter {
        color: #4e4e4e;
        border-right: 2px solid #4e4e4e;
        animation: blink 1s steps(1) infinite,
            grow 10s steps(115) 0s;

        @keyframes blink {

            from,
            to {
                border-color: transparent
            }

            50% {
                border-color: #4e4e4e;
            }
        }

        @keyframes grow {
            from {
                width: 0;
            }

            to {
                width: 1220px;
            }
        }
    }
}

.recentnews {
    height: 800px;

    h2 {
        text-align: center;
        background-image: linear-gradient(45deg, #417dff, #55e7fc);
        background-clip: text;
        -webkit-text-fill-color: transparent;
    }

    .search {
        margin-top: 10px;
        display: flex;
        justify-content: space-between;
        padding: 0 145px;

        .el-input {
            width: 300px;

            :deep(.el-input__wrapper) {
                border-radius: 20px;
            }
        }
    }

    ul {
        list-style: none;
        width: 80%;
        margin: 20px auto;

        &>div {
            width: 100%;
            text-align: center;
            font-size: 20px;
            font-weight: 100;
            color: #ccc;
        }

        li {
            width: 100%;
            height: 300px;
            display: flex;
            border: 2px solid #ececec;
            margin-top: 20px;

            &:nth-child(even) {
                flex-direction: row;
            }

            &:nth-child(odd) {
                flex-direction: row-reverse;
            }

            .clubinfo {
                width: 400px;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                background: linear-gradient(45deg, rgba(64, 158, 255, 0.5), rgba(85, 231, 252, 0.5));

                .clubavatar {
                    width: 150px;
                    height: 150px;
                    position: relative;
                    border-radius: 50%;
                    border: 2px solid white;

                    img {
                        position: absolute;
                        width: 150px;
                        height: 150px;
                        object-fit: cover;
                        object-position: center;
                        position: absolute;
                        top: 0;
                        left: 0;
                        border-radius: 50%;
                    }
                }

                .clubname {
                    margin-top: 20px;
                    text-align: center;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;

                    .club {
                        font-size: 20px;
                        font-weight: bold;
                        color: #333333;
                        margin-bottom: 10px;
                        position: relative;

                        span {
                            position: absolute;
                            bottom: 0;
                            right: -50px;
                            font-size: 14px;
                            color: #ffffff;

                            i {
                                margin-right: 5px;
                            }
                        }
                    }

                    .minister {
                        background-color: white;
                        color: rgb(162, 218, 254);
                        font-weight: normal;
                        width: 60px;
                        height: 25px;
                        line-height: 25px;
                        border-radius: 10px;
                    }
                }

            }

            .newsinfo {
                width: 50%;
                margin: 0 20px;

                .title {
                    text-align: center;
                    font-size: 22px;
                    margin: 20px 0;
                }

                .content {
                    width: 500px;
                    height: 200px;
                    overflow: hidden;
                    margin: 0 auto;
                    font-weight: 100;
                }
            }

            .button {
                position: relative;
                text-align: center;
                font-weight: 100;

                .time {
                    font-size: 14px;
                    color: #767676;
                    position: relative;
                    top: 5px;
                }

                .more {
                    margin: 0 auto;
                    margin-top: 80px;
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    width: 60px;
                    height: 100px;
                    cursor: pointer;
                    border: 1px solid #ccc;
                    transition: all 0.5s ease;
                    color: #4b4b4b;
                    user-select: none;
                    box-sizing: border-box;

                    i {
                        margin-top: 5px;
                    }

                    &:hover {
                        border: none;
                        background: linear-gradient(45deg, #9378ff, #ff77c2);
                        color: white;
                    }
                }
            }
        }

    }
}

:deep(.el-overlay) {
    background: transparent !important;
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

    .title {
        font-weight: bold;
        font-size: 18px;
        text-align: center;
    }

    .content {
        margin-top: 10px;
        height: 560px;
        overflow-y: scroll;

        ol,
        ul {
            padding-left: 20px;
        }
    }

    .minister {
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

    .time {
        position: absolute;
        bottom: 20px;
        left: 20px;
        font-size: 12px;
    }
}
</style>