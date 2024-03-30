<template>
    <div class="root">
        <div class="container" id="container">
            <div class="form">
                <div class="sign-up">
                    <h3>用户注册</h3>
                    <div class="sign-up-form">
                        <input type="text" placeholder="学号/工号">
                        <input type="text" placeholder="手机号">
                        <input type="password" placeholder="密码">
                        <input type="password" placeholder="确认密码">
                        <div class="code">
                            <input type="text" placeholder="请输入验证码">
                            <span>SWUST</span>
                        </div>

                        <button>注册</button>
                    </div>
                </div>
                <div class="sign-in">
                    <h3>用户登录</h3>
                    <div class="sign-in-form" @keydown.enter="handleLogin(loginForm)">
                        <input type="text" placeholder="学号/工号" v-model="loginForm.userid">
                        <input type="password" placeholder="密码" v-model="loginForm.password">
                        <div class="forget"><a href="#">忘记密码？</a></div>
                        <button @click="handleLogin(loginForm)">登录</button>
                    </div>
                </div>
            </div>
            <div class="overlay">
                <div class="left-pannel">
                    <img src="../assets/西科大logo.png" :class="{ 'rotate-image': loginSuccess }">
                    <h3>西南科技大学社团管理系统</h3>
                    <h3 class="title">没有账号?</h3>
                    <button id="toSignUp">点击注册</button>
                </div>
                <div class="right-pannel">
                    <img src="../assets/西科大logo.png">
                    <h3>西南科技大学社团管理系统</h3>
                    <h3 class="title">已有账号?</h3>
                    <button id="toSignIn">点击登录</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, reactive,ref } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useHomeStore } from '@/stores/home'

const router = useRouter()
const store = useHomeStore()
const loginSuccess = ref(false)
const loginForm = reactive({
    userid: '',
    password: ''
})
onMounted(() => {
    const container = document.querySelector('#container');
    const signIn = document.querySelector('#toSignIn');
    const signUp = document.querySelector('#toSignUp');
    signUp.addEventListener("click", () => container.classList.add('active'))
    signIn.addEventListener("click", () => container.classList.remove('active'))
})

function handleLogin(loginForm) {
    axios.post("/adminapi/users/login", loginForm).then(res => {
        if (res.data.ok === 1) {
            store.addUserInfo(res.data.data)
            store.changeGetterRouter(false)
            loginSuccess.value = true
            setTimeout(() => {
                router.push('/home')
            }, 1200);
        } else {
            ElMessage.error('用户不存在或密码错误！')
        }
    })
}
</script>

<style lang="scss" scoped>

.rotate-image {
    transform: scale(1.1) rotate(360deg);
}

* {
    margin: 0;
    padding: 0;
}

html,
body {
    width: 100%;
    height: 100%;
}

.root {
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image:linear-gradient(125deg, #417dff, #55e7fc, #c79fff, #ff9ec2, #55e7fc, #417dff);
    background-size: 400%;
    animation: bgMove 20s infinite;
    @keyframes bgMove {
        0%{
            background-position:0% 0%
        }
        50%{
            background-position:100% 50%
        }
        100%{
            background-position:0% 0%
        }
    }

    .container {
        position: relative;
        width: 800px;
        height: 600px;
        border-radius: 10px;
        overflow: hidden;
        box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);

        .form {
            width: 100%;
            display: flex;
            height: 100%;
            position: absolute;

            input {
                margin: 12px 0;
                font-size: 14px;
                border: 0;
                border-bottom: 1px solid #ccc;
                padding: 5px 5px 5px 15px;
                outline: none;
            }

            .sign-up {
                position: absolute;
                right: 0;
                width: 400px;
                height: 100%;
                display: flex;
                box-sizing: border-box;
                padding: 30px;
                flex-direction: column;
                justify-content: center;
                background: white;
                opacity: 0;
                z-index: 1;
                transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease-in-out;

                h3 {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .sign-up-form {
                    width: 100%;
                    display: flex;
                    flex-direction: column;

                    .code {
                        margin-bottom: 30px;

                        span {
                            display: inline-block;
                            box-sizing: border-box;
                            width: 144px;
                            height: 50px;
                            color: white;
                            background: linear-gradient(-45deg, #9378ff, #ff77c2);
                            border-radius: 5px;
                            text-align: center;
                            line-height: 50px;
                            font-size: 30px;
                        }
                    }

                    button {
                        cursor: pointer;
                        padding: 0.3rem;
                        font-size: 16px;
                        color: white;
                        border: 0;
                        border-radius: 18px;
                        background: linear-gradient(45deg, #9378ff, #ff77c2);
                        transition: all 0.1s ease-in;

                        &:active {
                            transform: scale(0.95);
                        }
                    }
                }
            }

            .sign-in {
                position: absolute;
                right: 0;
                width: 400px;
                background: white;
                height: 100%;
                display: flex;
                box-sizing: border-box;
                padding: 30px;
                flex-direction: column;
                justify-content: center;
                z-index: 2;
                transition: transform 1s cubic-bezier(0.25, 0.1, 0.25, 1), opacity 0.6s ease-in-out;

                h3 {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .sign-in-form {
                    display: flex;
                    flex-direction: column;

                    .forget {
                        text-align: right;
                        font-size: 13px;

                        a {
                            color: #ccc;
                            text-decoration: none;

                            &:active {
                                color: #417dff;
                                text-decoration: none;
                            }
                        }
                    }

                    button {
                        cursor: pointer;
                        padding: 0.3rem;
                        margin-top: 25px;
                        font-size: 16px;
                        color: white;
                        border: 0;
                        border-radius: 18px;
                        /* background-color: #417dff; */
                        background: linear-gradient(15deg, #417dff, #55e7fc);
                        transition: all 0.1s ease-in;

                        &:active {
                            transform: scale(0.95);
                        }
                    }
                }
            }
        }

        .overlay {
            position: absolute;
            top: 0;
            left: 0;
            width: 400px;
            height: 100%;
            display: flex;
            overflow: hidden;
            z-index: 9;
            background: linear-gradient(45deg, #4157ff, #37f2ff);
            transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);
            user-select: none;

            .left-pannel {
                position: absolute;
                left: 0;
                width: 400px;
                height: 100%;
                display: flex;
                flex-direction: column;
                text-align: center;
                justify-content: start;
                align-items: center;
                color: white;
                box-sizing: border-box;
                transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);

                img {
                    width: 280px;
                    margin: 60px 0 20px 0;
                    transition: transform 1s ease;

                }

                button {
                    cursor: pointer;
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    background: transparent;
                    border: 2px solid white;
                    border-radius: 20px;
                    color: white;
                    font-size: 15px;
                    transition: all 0.1s ease-in;

                    &:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }

                    &:active {
                        transform: scale(0.95);
                    }
                }

                .title {
                    margin: 50px 0 10px 0;
                    font-size: 16px;
                    font-weight: 100;
                }
            }

            .right-pannel {
                position: absolute;
                width: 400px;
                height: 100%;
                display: flex;
                flex-direction: column;
                text-align: center;
                justify-content: start;
                align-items: center;
                color: white;
                box-sizing: border-box;
                left: 400px;
                transform: translateX(800px);
                transition: all 1s cubic-bezier(0.25, 0.1, 0.25, 1);

                img {
                    width: 280px;
                    margin: 60px 0 20px 0;
                }

                button {
                    cursor: pointer;
                    width: 120px;
                    height: 40px;
                    line-height: 40px;
                    background: transparent;
                    border: 2px solid white;
                    border-radius: 20px;
                    color: white;
                    font-size: 15px;
                    transition: all 0.1s ease-in;

                    &:hover {
                        background: rgba(255, 255, 255, 0.2);
                    }

                    &:active {
                        transform: scale(0.95);
                    }
                }

                .title {
                    margin: 50px 0 10px 0;
                    font-size: 16px;
                    font-weight: 100;
                }
            }
        }
    }

    .active {
        .overlay {
            transform: translateX(400px);
            background: linear-gradient(45deg, #9378ff, #ff77c2);
        }

        .overlay .left-pannel {
            transform: translateX(-800px);
        }

        .overlay .right-pannel {
            transform: translateX(-400px);
        }

        .form .sign-up {
            transform: translateX(-100%);
            opacity: 1;
            z-index: 3;
        }

        .form .sign-in {
            transform: translateX(-100%);
            opacity: 0;
        }
    }
}
</style>