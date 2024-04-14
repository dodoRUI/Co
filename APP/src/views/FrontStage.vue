<template>
    <div class="root">
        <div class="nav">
            <Navigation :page="currentPage"></Navigation>
        </div>
        <div :style="currentPage == 'home' ? 'height:0' : 'height:100px'"></div>
        <router-view></router-view>
    </div>
</template>

<script setup>
import Navigation from '../components/frontstage/Navigation.vue'
import { onMounted, ref } from 'vue'
import { onBeforeRouteUpdate,useRoute } from 'vue-router'

const currentPage = ref('home')
const route = useRoute()
onMounted(()=>{
    const path = route.path.split('/')
    currentPage.value = path[path.length-1]

})
onBeforeRouteUpdate((to, from, next) => {
    currentPage.value = to.name
    next()
})
</script>

<style lang="scss" scoped>
* {
    margin: 0;
    padding: 0;
}

.root {
    width: 100%;
    position: relative;

    .nav {
        width: 100%;
        position: fixed;
        top: 0;
        z-index: 1;
    }
}
</style>