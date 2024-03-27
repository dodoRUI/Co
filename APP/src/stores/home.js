import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useHomeStore = defineStore('home',()=>{
    const isCollapse = ref(false)
    const userInfo = ref({})
    const isGetterRouter = ref(false)

    function changeGetterRouter(value){
        isGetterRouter.value = value
    }

    function toggleCollapse() {
        isCollapse.value = !isCollapse.value
    }
    function addUserInfo(data) {
        for (var i in data){
            userInfo.value[i] = data[i]
        }
    }
    
    function clearUserInfo() {
        userInfo.value = {}
    }

    return {
        isGetterRouter,
        isCollapse,
        userInfo,
        changeGetterRouter,
        toggleCollapse,
        addUserInfo,
        clearUserInfo
    }
},{persist:{
    paths:['isCollapse','userInfo']
}})
