<!--
 * @Author: pengpeng
 * @Date: 2020-10-13 13:49:42
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 14:03:01
 * @Description: file content
-->
<template>
  <div id="app">
    <loading/>
    <transition :name="transitionName">
      <router-view/>
    </transition>
  </div>
</template>
<script>

import Loading from '@/components/Loading'
if (process.env.NODE_ENV === 'production') {
  const Vconsole = require('vconsole')
  // eslint-disable-next-line
  new Vconsole()
}
export default {
  name: 'app',
  components: {
    Loading
  },
  data () {
    return {
      transitionName: ''
    }
  },
  beforeRouteUpdate (to, from, next) {
    const toDepth = to.path.split('/').length
    const fromDepth = from.path.split('/').length
    console.log(toDepth, fromDepth)
    this.transitionName = toDepth < fromDepth ? 'slide-right' : 'slide-left'
    next()
  },
  watch: { // 使用watch 监听$router的变化
    $route (to, from) {
      // 如果to索引大于from索引,判断为前进状态,反之则为后退状态
      const toDepth = to.path.split('/').length
      const fromDepth = from.path.split('/').length
      if (toDepth > fromDepth) {
        // 设置动画名称
        this.transitionName = 'slide-left'
      } else if (toDepth < fromDepth) {
        this.transitionName = 'slide-right'
      }
    }
  }
}
</script>
<style lang="less">
  body{
    background: #F5F8FD;
    font-family: PingFangSC-Regular, PingFang SC;
  }
  *{
    box-sizing: border-box;
  }
  #YSF-BTN-HOLDER{
    display: none;
  }
  .slide-right-enter-active,
  .slide-right-leave-active,
  .slide-left-enter-active,
  .slide-left-leave-active {
    will-change: transform;
    transition: all 500ms;
    width: 100vw;
    min-height: 100vh;
    position: absolute;
  }
  .slide-right-enter {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .slide-right-leave-active {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-enter {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
  .slide-left-leave-active {
    opacity: 0;
    transform: translate3d(-100%, 0, 0);
  }
  .van-overlay{
  z-index: 11;
  background-color: rgba(0,0,0,.3);
  display: flex;
  align-items: flex-end;
  .phone-wrapper{
    width: 100vw;
    .item{
      display: flex;
      justify-content: center;
      align-items: center;
      margin: 10px 16px;
      height: 50px;
      background-color: #fff;
      font-size: 18px;
      color: #2D6DFF;
      border-radius: 4px;
    }
    a.item{
      .icon{
        margin-right: 16px;
        width: 30px;
        height: 30px;
        filter: grayscale(100%);
      }
    }
  }
}
</style>
