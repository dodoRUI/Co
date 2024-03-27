<template>
    <div class="root">
        <div class="container" id="container">
            <div class="form-container sign-up-container">
                <div class="form">
                    <h1>用户注册</h1>
                    <input type="text" placeholder="用户名">
                    <input type="password" placeholder="密码">
                    <input type="email" placeholder="邮箱">
                    <button id="send_code">发送验证码</button>
                    <input type="email" placeholder="验证码">

                    <button>注册</button>
                </div>
            </div>
            <div class="form-container sign-in-container">

                <div class="form" @keydown.enter="handleLogin(loginForm)">
                    <h1>用户登录</h1>
                    <input type="text" placeholder="学号" v-model="loginForm.userid">
                    <input type="password" placeholder="密码" v-model="loginForm.password">
                    <a href="">忘记密码？</a>
                    <button @click="handleLogin(loginForm)">登录</button>
                </div>
            </div>
            <div class="overlay-container">
                <div class="overlay">
                    <div class="overlay-pannel overlay-left">
                        <h1>已有账号？</h1>
                        <p>现在去登录</p>
                        <button class="ghost" id="signIn">登录</button>
                    </div>
                    <div class="overlay-pannel overlay-right">
                        <h1>没有账号？</h1>
                        <p>现在去注册</p>
                        <button class="ghost" id="signUp">注册</button>
                    </div>
                </div>
            </div>
        </div>
    </div>   
</template>

<script setup>
import { ElMessage } from 'element-plus'
import { onMounted, reactive } from 'vue';
import axios from 'axios'
import {useRouter} from 'vue-router'
import {useHomeStore} from '@/stores/home'

const router = useRouter()
const store = useHomeStore()
const loginForm = reactive({
    userid: '',
    password: ''
})

onMounted(() => {
    const container = document.querySelector("#container")
    const signInButton = document.querySelector("#signIn")
    const signUpButton = document.querySelector("#signUp")
    signUpButton.addEventListener("click", () => container.classList.add('right-pannel-active'))
    signInButton.addEventListener("click", () => container.classList.remove('right-pannel-active'))
})

function handleLogin(loginForm) {
    axios.post("/adminapi/users/login",loginForm).then(res => {
        if(res.data.ok===1){
            // console.log(res.data.data)
            store.addUserInfo(res.data.data)
            store.changeGetterRouter(false)
            router.push('/home')
        }else{
            ElMessage.error('用户不存在或密码错误！')
        }
    })
}
</script>
<style>
.root {
    font-family: Arial, Helvetica, sans-serif;
    background-color: #f8f8f8;
    background-attachment: fixed;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100vh;
    margin: 0 auto;
    background: url('@/assets/渐变背景.png');
}

h1 {
    margin: 0.2rem;
    font-size: 1.2rem;
}

p {
    font-size: 1rem;
    line-height: 1.5rem;
    font-weight: 100;
    margin: 1.2rem 0;
    letter-spacing: 0.1rem;
}

span {
    font-size: 0.8rem;
    margin: 1.2rem 0;
}

a {
    color: #333;
    font-size: 0.8rem;
    text-decoration: none;
    /* float: right; */
}

.container {
    position: relative;
    background: #fff;
    border-radius: 10px;
    box-shadow: 0 14px 28px rgba(0, 0, 0, 0.25), 0 10px 10px rgba(0, 0, 0, 0.22);
    padding: 0.6rem;
    width: 50rem;
    height: 35rem;
    overflow: hidden;
    max-width: 100vw;
    min-height: 70vh;
}

.form-container .form {
    background-color: #fff;
    display: flex;
    flex-direction: column;
    padding: 0 1.8rem;
    height: 100%;
    justify-content: center;
    align-items: center;
}

.form-container input {
    width: 100%;
    height: 2.2rem;
    text-indent: 1rem;
    border: 1px solid #ccc;
    border-left: none;
    border-right: none;
    border-top: none;
    outline: none;
    margin: 0.6rem 0;
}

.form-container button:active {
    transform: scale(0.9);
}

.form-container button {
    padding: 0.4rem 1rem;
    background: #417dff;
    color: white;
    border: 1px solid #fff;
    outline: none;
    cursor: pointer;
    width: 5rem;
    border-radius: 8px;
    transition: all 100ms ease-in;
    margin: 0.6rem 0;
    padding: 0.5rem 0;
    font-size: 0.8rem;
    line-height: 0.8rem;
}

button#send_code {
    width: 100%;

}

button.ghost {
    background-color: white;
    border-color: #fff;
    border: 1px solid #fff;
    outline: none;
    cursor: pointer;
    width: 5rem;
    border-radius: 8px;
    transition: all 800ms ease-in;
    margin: 0.6rem 0;
    padding: 0.5rem 0;
    color: #417dff;
    font-size: 0.8rem;
    line-height: 0.8rem;
}

button.ghost:active {
    transform: scale(0.9);
}

.form-container {
    position: absolute;
    top: 0;
    height: 100%;
    transition: all 0.5s ease-in;
}

.sign-in-container {
    left: 0;
    width: 50%;
    z-index: 2;
}

.sign-up-container {
    left: 0;
    width: 50%;
    opacity: 0;
    z-index: -1;
}

.overlay {
    background-color: #417dff;
    width: 200%;
    height: 100%;
    position: relative;
    left: -100%;
    transition: all 0.6s ease-in-out;
    color: white;
}

.overlay-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 50%;
    height: 100%;
    overflow: hidden;
    transition: all 0.6s ease-in-out;
    z-index: 99;
}

.overlay-pannel {
    position: absolute;
    top: 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 50%;
    height: 100%;
    padding: 0 2.2rem;
}

.overlay-right {
    right: 0;
}

.container.right-pannel-active .overlay-container {
    transform: translateX(-100%);
}

.container.right-pannel-active .sign-in-container {
    transform: translateX(50%);
}

.container.right-pannel-active .sign-up-container {
    transform: translateX(100%);
    opacity: 1;
    z-index: 5;
    transition: all 0.6s ease-in;
}

.container.right-pannel-active .overlay {
    transform: translateX(50%);
}
</style>