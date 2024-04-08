import {defineStore} from 'pinia'
import { ref } from 'vue'

export const useClubStore = defineStore('club',()=>{
    const clubid = ref('')
    const rememberClub = (id)=>{
        clubid.value = id
    }
    return {
        clubid,
        rememberClub
    }
},{persist:{
    paths:['clubid']
}})