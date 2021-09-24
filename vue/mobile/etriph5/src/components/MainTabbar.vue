<template>
  <van-tabbar v-model="active" route>
    <van-tabbar-item to="/" icon="wap-home-o">因公</van-tabbar-item>
    <van-tabbar-item icon="search">优选</van-tabbar-item>
    <van-tabbar-item icon="plus"></van-tabbar-item>
    <van-tabbar-item icon="completed">工作</van-tabbar-item>
    <van-tabbar-item to="/userCenter" icon="user-circle-o">
      我的
    </van-tabbar-item>
  </van-tabbar>
</template>

<script>
import { Tabbar, TabbarItem } from 'vant'
import Vue from 'vue'
Vue.use(Tabbar).use(TabbarItem)
export default {
  name: 'MainTabbar',
  data () {
    return {
      active: 0
    }
  }
}
</script>

<style lang="less" scoped>
</style>
