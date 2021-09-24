<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-04-15 14:54:58
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-23 11:04:27
-->
<template>
  <div class="warp">
    <div class="haze" />
    <vue-seamless-scroll :data="list" :class-option="classOption">
      <ul class="item">
        <li v-for="item in list" :key="item.info" class="tip ell">{{ item.info }}</li>
      </ul>
    </vue-seamless-scroll>
  </div>
</template>

<script>
import vueSeamlessScroll from 'vue-seamless-scroll'
export default {
  name: 'ScrollNews',
  components: {
    vueSeamlessScroll
  },
  data () {
    return {
      scroll: false,
      list: [],
      classOption: {
        step: 0.1
      }
    }
  },
  created () {
    // this.$api('home.scrollNews').then(res => {
    //   this.list = res.data && [res.data[0]]
    // })
  }
}
</script>

<style scoped lang="scss">
@import './../../../ui/themeVar.scss';
.warp {
  position: relative;
  // margin-top: -12px;
  height: 20px;
  line-height: 20px;
  padding: 10px 20px;
  overflow: hidden;
  .haze{
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: 0;
    background: linear-gradient(180deg, #4285f4 0%, rgba(65, 101, 137, 0) 100%);
    opacity: 0.5;
  }
}
.tip {
  position: relative;
  padding-left: 10px;
  @include fs();
  color: #ffffff;
  line-height: 20px;
  width: 1560px;
  overflow: hidden;
  &::before {
    position: absolute;
    top: 8px;
    left: 0;
    content: '';
    display: inline-block;
    width: 4px;
    height: 4px;
    border-radius: 50%;
    background-color: #ff8200;
  }
}
</style>
