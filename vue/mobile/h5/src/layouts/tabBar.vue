<!--
 * @Author: pengpeng
 * @Date: 2020-10-13 16:51:40
 * @LastEditors: pengpeng
 * @LastEditTime: 2020-10-23 13:35:19
 * @Description: file content
-->
<template>
  <div>
    <router-view/>
    <van-tabbar v-model="active" route class="tab-bar">
      <van-tabbar-item to="/home">
        <span>首页</span>
        <template #icon="props">
          <svg-icon :href="props.active ? 'shouye' : 'shouyehui' " class="icon"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="search" to="/tripRecord">
        <span>行程记录</span>
        <template #icon="props">
          <svg-icon :href="props.active ? 'hangchengjilu' : 'hangchengjiluhui' " class="icon"/>
        </template>
      </van-tabbar-item>
      <van-tabbar-item icon="setting-o" @click="goLink">
        <span>在线客服</span>
        <template #icon="props">
          <svg-icon :href="props.active ? 'zaixiankefu' : 'zaixiankefuhui' " class="icon"/>
          <a href="http://jsapikefu.openkefu.com" ref="link"></a>
        </template>
      </van-tabbar-item>
    </van-tabbar>
  </div>
</template>

<script>
export default {
  mounted () {
    const s = document.createElement('script')
    // s.type = 'javascript'
    s.src = 'https://qiyukf.com/script/eca2f033c90b5115c6ad99d01942a028.js'
    document.head.appendChild(s)
  },
  data () {
    return {
      active: 0
    }
  },
  methods: {
    goLink () {
      document.querySelector('#YSF-BTN-HOLDER').click()
    }
  }
}
</script>

<style scoped lang="less">
.tab-bar{
  height: 59px;
  .van-tabbar-item
  .van-tabbar-item__icon
  .icon{
    width: 22px;
    height: 22px;
  }
}
</style>
