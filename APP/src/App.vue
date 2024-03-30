<template>
  <div>
    <router-view></router-view>
  </div>
</template>


<style>
* {
  margin: 0;
  padding: 0;

  &::-webkit-scrollbar {
    width: 5px;
    background-color: white;
  }

  &::-webkit-scrollbar-thumb {
    width: 10px;
    background: #9a9a9a;
    /* 设置滑块颜色 */
    border-radius: 5px;
    /* 设置滑块圆角 */
  }
}
</style>
