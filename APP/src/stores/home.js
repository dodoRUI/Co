import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useHomeStore = defineStore('home',()=>{
    const isCollapse = ref(false)
    const userInfo = ref({})

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
        isCollapse,
        userInfo,
        toggleCollapse,
        addUserInfo,
        clearUserInfo
    }
},{persist:{
    paths:['isCollapse','userInfo']
}})
