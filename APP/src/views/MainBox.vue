<template>
  <div class="common-layout">
    <el-container>
      <SideMenu>Aside</SideMenu>
      <el-container direction="vertical">
        <TopHeader>Header</TopHeader>
        <el-main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

  
  
  
<script setup>
    import TopHeader from '../components/mainbox/TopHeader.vue'
    import SideMenu from '../components/mainbox/SideMenu.vue'
</script>

<style lang="scss">
    html, body {
      width: 100%;
      height: 100%;
    }
</style>