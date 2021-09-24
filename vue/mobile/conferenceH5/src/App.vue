<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-09 18:58:54
-->
<template>
  <div id="app">
    <keep-alive>
      <router-view v-if="$route.meta.keepAlive"></router-view>
    </keep-alive>
    <router-view v-if="!$route.meta.keepAlive"></router-view>
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'App',
  mounted() {
    // alert('加载完毕')
    // const jsapi = new JsApi()
    // this.$dialog({ message: jsapi })
    // setTimeout(() => {
    //   this.$dialog({ message: jsapi.checkEnvironment() })
    // })
    // setInterval(() => {
    //   this.$dialog({ message: jsapi.checkEnvironment() })
    // },1000)
    // const userInfo = sessionStorage.getItem('userInfo')
    const url = window.location.href
    const token = getToken()
    if (url.includes('J07ManageApp') && token) {
      // this.$api({
      //   url: 'user.userInfo'
      // }).then(res => {
      //   const data = res.result
      //   const userBasicInfo = {
      //     name: data.ssoUserName,
      //     mobile: data.mobile ? data.mobile.slice(-4) : ''
      //   }
      //   sessionStorage.setItem('userBasicInfo', `${userBasicInfo.name}  ${userBasicInfo.mobile}`)
      // })
    }
  }
}
</script>
<style lang="scss"></style>
