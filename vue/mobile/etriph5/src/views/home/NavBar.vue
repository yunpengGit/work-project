<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-03-25 11:43:09
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-15 14:21:44
-->
<template>
  <van-nav-bar fixed :z-index="999">
    <!-- <div class="scan-icon-content" slot="left" flex="cross:center">
      <svg-icon href="iconsaoyisao" class="scan-icon" />
    </div> -->
    <span slot="title" class="title">欢迎您，{{userName}}</span>
    <router-link slot="right" to="/service">
      <van-icon class="icon" name="phone-circle-o" />
    </router-link>
  </van-nav-bar>
</template>

<script>
import { NavBar, Icon } from 'vant'
import Vue from 'vue'
Vue.use(NavBar).use(Icon)
export default {
  name: 'NavBar',
  data () {
    return {
      userName: ''
    }
  },
  watch: {
    userInfo: {
      deep: true,
      handler (n) {
        // console.log(n)
        this.userName = n.userName
      }
    }
  },
  computed: {
    userInfo () {
      return this.$store.state.userInfo.userInfo
    }
  }
}
</script>

<style lang="less" scoped>
.icon {
  font-size: 24px;
}
.scan-icon-content {
  height: 46px;
}
.scan-icon {
  width: 28px;
  height: 28px;
}
.title {
  font-size: 14px;
}

.van-nav-bar::after {
  display: none;
}
</style>
