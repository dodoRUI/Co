<template>
    <div class="root">
        <div class="container" id="container">
            <div class="form">
                <div class="sign-up">
                    <h3>用户注册</h3>
                    <div class="sign-up-form">
                        <div class="major">
                            <el-cascader v-model="registerForm.instituteMajor" :options="options" @change="handleChange"
                                placeholder="学院专业" />
                        </div>
                        <input type="text" v-model="registerForm.userid" placeholder="学号/工号" @change="useridCheck" @input="()=>{registerForm.userid=registerForm.userid.replace(/\D/g, '')}">
                        <input type="text" v-model="registerForm.classid" placeholder="班级">
                        <input type="password" v-model="registerForm.password" placeholder="密码" @change="passwordCheck">
                        <input type="password" v-model="registerForm.password2" placeholder="确认密码">
                        <div class="captcha">
                            <input v-model="registerCaptcha" type="text" placeholder="请输入验证码">
                            <canvas ref="registerCaptchaCanvas" class="canvas" @click="refreshCaptcha"></canvas>
                        </div>
                        <button @click="submitRegistration">注册</button>
                    </div>
                </div>
                <div class="sign-in">
                    <h3>
                        <el-switch v-model="loginForm.stage" inline-prompt active-text="管理" inactive-text="用户"
                            size="large" />
                        用户登录
                    </h3>
                    <div class="sign-in-form" @keydown.enter="handleLogin(loginForm)">
                        <input type="text" placeholder="学号/工号" v-model="loginForm.userid" @input="()=>{loginForm.userid=loginForm.userid.replace(/\D/g, '')}">
                        <input type="password" placeholder="密码" v-model="loginForm.password">
                        <div class="forget"><a href="#">忘记密码？</a></div>
                        <div class="captcha">
                            <input v-model="loginCaptcha" type="text" placeholder="请输入验证码">
                            <canvas ref="loginCaptchaCanvas" class="canvas" @click="refreshCaptcha"></canvas>
                        </div>
                        <button @click="handleLogin(loginForm)">登录</button>
                    </div>
                </div>
            </div>
            <div class="overlay">
                <div class="left-pannel">
                    <img src="../assets/西科大logo.png" :class="{ 'lrotate-image': loginSuccess }">
                    <h3>西南科技大学社团管理系统</h3>
                    <h3 class="title">没有账号?</h3>
                    <button id="toSignUp">点击注册</button>
                </div>
                <div class="right-pannel">
                    <img src="../assets/西科大logo.png" :class="{ 'rrotate-image': registerSuccess }">
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
import { onMounted, reactive, ref } from 'vue';
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useHomeStore } from '@/stores/home'
import instituteMajor from '@/assets/instituteMajor.js'

const loginCaptcha = ref('');
const loginCaptchaText = ref('');
const loginCaptchaCanvas = ref(null);
const registerCaptcha = ref('');
const registerCaptchaText = ref('');
const registerCaptchaCanvas = ref(null);
// 生成验证码函数
function generateCaptcha(canvas, textRef) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    textRef.value = generateRandomString();
    ctx.font = '100px Arial'
    ctx.fillStyle = '#fff'
    ctx.rotate((Math.PI / 180) * (Math.random() * 10 - 5))
    ctx.fillText(textRef.value, canvas.width / 2 - 130, canvas.height / 2 + 30)
    for (let i = 0; i < 5; i++) {
        ctx.beginPath();
        ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
        ctx.strokeStyle = '#fff';
        ctx.stroke();
    }
}
// 刷新验证码函数
function refreshCaptcha() {
    generateCaptcha(loginCaptchaCanvas.value, loginCaptchaText)
    generateCaptcha(registerCaptchaCanvas.value, registerCaptchaText)
}
// 生成随机字符串函数
function generateRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 4; i++) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

const router = useRouter()
const store = useHomeStore()
const loginSuccess = ref(false)
const loginForm = reactive({
    userid: '',
    password: '',
    stage: false
})

const signIn = ref(null)
onMounted(() => {
    const container = document.querySelector('#container');
    signIn.value = document.querySelector('#toSignIn');
    const signUp = document.querySelector('#toSignUp');
    signUp.addEventListener("click", () => container.classList.add('active'))
    signIn.value.addEventListener("click", () => container.classList.remove('active'))

    generateCaptcha(loginCaptchaCanvas.value, loginCaptchaText)         // 生成登录验证码
    generateCaptcha(registerCaptchaCanvas.value, registerCaptchaText)   // 生成注册验证码
})

// 登录提交
function handleLogin(loginForm) {
    if (loginCaptcha.value.toLowerCase() === loginCaptchaText.value.toLowerCase()) {
        axios.post("/adminapi/users/login", loginForm).then(res => {
            if (res.data.ok === 1) {
                store.addUserInfo(res.data.data)
                store.changeGetterRouter(false)
                loginSuccess.value = true
                setTimeout(() => {
                    if (loginForm.stage) {
                        router.push('/backstage/home')
                    }else{
                        router.push('/front/home')
                    }
                }, 200);
            } else {
                ElMessage.error('用户不存在或密码错误！')
            }
        })
    } else {
        ElMessage.error("验证码错误!")
        refreshCaptcha();
    }
}

// 注册
const options = Object.entries(instituteMajor).map(([faculty, majors]) => {
    return {
        value: faculty,
        label: faculty,
        children: majors.map(major => {
            return {
                value: major,
                label: major
            }
        })
    }
})
const registerSuccess = ref(false)
const registerForm = reactive({
    legal: false,
    userid: '',
    password: '',
    password2: '',
    instituteMajor: '',
    classid: ''
})
// 查看用户id是否已经注册过
const useridCheck = async () => {
    if (registerForm.userid.length === 10) {
        const res = await axios.get(`/adminapi/users/login/${registerForm.userid}`)
        if (res.data.repeat) {
            ElMessage.error('该学号已注册!')
            registerForm.legal = false
        } else {
            registerForm.legal = true
        }
    } else {
        ElMessage.error('学号长度应为 10位')
        registerForm.legal = false
    }

}
// 密码合法检验
const passwordCheck = () => {
    const reg = /^(?=.*[a-zA-Z])(?=.*\d).{8,16}$/
    if(reg.test(registerForm.password)){
        return true
    }else{
        ElMessage.error('密码必须包含字母和数字，长度为8-16位')
        return false
    }
    
}
// 提交注册函数
const submitRegistration = async () => {
    if (registerCaptcha.value.toLowerCase() === registerCaptchaText.value.toLowerCase()) {
        if (Object.values(registerForm).some(item => item == '')) {
            ElMessage.error('请将信息填写完整!')
            refreshCaptcha()
            return
        }
        if (!registerForm.legal) {
            ElMessage.error('请先输入正确的学号!')
            refreshCaptcha()
            return
        }
        if(!passwordCheck()){
            refreshCaptcha()
            return
        }
        if (registerForm.password !== registerForm.password2) {
            ElMessage.error('两次密码输入不一致!')
            registerForm.password = registerForm.password2 = ''
            refreshCaptcha()
            return
        }
        const res = await axios.post('/adminapi/users/login/register', registerForm)
        if (res.data.success) {
            registerSuccess.value = true
            signIn.value.click()
            for (var i in registerForm) {
                registerForm[i] = ''
            }
            registerForm.legal = false
            registerCaptcha.value = ''
            refreshCaptcha()
            ElMessage.success('注册成功!')
        }

    } else {
        ElMessage.error("验证码错误!")
        refreshCaptcha()
    }
}
</script>

<style lang="scss" scoped>
.lrotate-image {
    transform: scale(0.95);
}

.rrotate-image {
    transform: scale(0.95);
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
    background-image: linear-gradient(125deg, #417dff, #55e7fc, #c79fff, #ff9ec2, #55e7fc, #417dff);
    background-size: 400%;
    animation: bgMove 20s infinite;

    @keyframes bgMove {
        0% {
            background-position: 0% 0%
        }

        50% {
            background-position: 100% 50%
        }

        100% {
            background-position: 0% 0%
        }
    }

    .container {
        position: relative;
        width: 800px;
        height: 600px;
        border-radius: 10px;
        overflow: hidden;
        background-color: white;
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

                    .major {
                        width: 100%;
                        margin-top: 5px;

                        :deep(.el-input .el-input__wrapper) {
                            border-radius: 20px !important;
                            width: 320px;
                        }
                    }

                    .captcha {
                        height: 60px;
                        display: flex;
                        justify-content: space-between;
                        margin-bottom: 30px;
                        padding-bottom: 0;

                        input {
                            margin-bottom: 0;
                        }

                        .canvas {
                            width: 140px;
                            height: 60px;
                            background: linear-gradient(45deg, #9378ff, #ff77c2);
                            border-radius: 10px;
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
                    position: relative;

                    .el-switch {
                        position: absolute;
                        top: -8px;
                        left: 0;
                    }
                }

                .sign-in-form {
                    display: flex;
                    flex-direction: column;

                    .captcha {
                        height: 60px;
                        display: flex;
                        justify-content: space-between;
                        margin-top: 30px;

                        input {
                            margin-bottom: 0;
                        }

                        .canvas {
                            width: 140px;
                            height: 60px;
                            background: linear-gradient(15deg, #417dff, #55e7fc);
                            border-radius: 10px;
                        }
                    }

                    .forget {
                        text-align: right;
                        font-size: 13px;

                        a {
                            color: #ccc;
                            text-decoration: none;

                            &:hover {
                                color: rgb(73, 164, 254);
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
                    transition: all 0.5s ease;

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
                    transition: all 0.1s ease;
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