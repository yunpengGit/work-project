<!--全屏遮罩loading-->
<template>
  <van-overlay :show="$store.state.loading.isLoading" :z-index="9999">
    <div class="loading-content"  flex="main:center cross:center">
      <!-- <van-loading size="80px" type="spinner" /> -->
      <div class="loader-ring">
        <div class="loader-ring-light"></div>
        <div class="logo-icon"></div>
      </div>
    </div>
  </van-overlay>
</template>

<script>
import Vue from 'vue'
import { Overlay, Loading } from 'vant'

Vue.use(Overlay).use(Loading)
export default {
}
</script>

<style scoped lang="less">
@width: 67px;
  /deep/ .loading-content {
    height: 100%;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    .loader-ring{
      display: flex;
      position: relative;
      width: 112px;
      height: 95px;
      border-radius: 8px;
      justify-content: center;
      align-items: center;
      background-color: #fff;
      .loader-ring-light{
        width: @width;
        height: @width;
        border-radius: @width;
        box-shadow: 0 1px 0.5px 0.5px #009eff inset;
        animation: rotate-360 2s linear infinite;
      }
      .logo-icon{
        position: absolute;
        top: 14px;
        left: 22px;
        width: @width;
        height: @width;
        background-image: url("./../image/logo-icon.png");
        background-size: 100% 100%;
      }
      @keyframes rotate-360 {
        from {
          transform: rotate(0);
        }
        to {
          transform: rotate(360deg);
        }
      }
    }
  }
</style>
