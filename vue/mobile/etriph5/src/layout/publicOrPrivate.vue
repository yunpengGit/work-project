<template>
  <div>
    <nav-bar/>
    <SwitchPublicOrPrivate/>
    <router-view></router-view>
    <main-tabbar v-if="false"/>
  </div>
</template>

<script>
import MainTabbar from '@c/MainTabbar.vue'
import NavBar from './../views/home/NavBar'
import SwitchPublicOrPrivate from './../views/home/Switch'

export default {
  components: {
    MainTabbar,
    NavBar,
    SwitchPublicOrPrivate
  }
}
</script>

<style lang="less" scoped>
</style>
