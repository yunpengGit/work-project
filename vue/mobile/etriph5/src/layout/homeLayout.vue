<template>
  <div>
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
    <main-tabbar v-if="false"/>
  </div>
</template>

<script>
import MainTabbar from '@c/MainTabbar.vue'

export default {
  components: {
    MainTabbar
  }
}
</script>

<style lang="less" scoped>
</style>
