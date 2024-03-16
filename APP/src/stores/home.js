import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useHomeStore = defineStore('home',()=>{
    const isCollapse = ref(false)
    function toggleCollapse() {
        isCollapse.value = !isCollapse.value
    }

    return {isCollapse,toggleCollapse}
},{persist:{
    paths:['isCollapse']
}})
