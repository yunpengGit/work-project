<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 18:26:28
 * @LastEditors: pengpeng
 * @LastEditTime: 2021-06-08 10:45:53
-->
<template>
  <div class="home-notice">
    <img :src="jyhkyfw011" alt="" class="img-news">
  </div>
</template>
<script>
import jyhkyfw011 from '@/assets/demo/jyhkyfw011.jpg'
export default {
  data () {
    return {
      jyhkyfw011
    }
  }
}
</script>
<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-notice {
    background-color: #fff;
    box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.14);
    height: 100%;
    width: 100%;
    .img-news{
      height: 100%;
      width: 100%;
    }
    .notice-cont{
      @if $fs == 14PX {
        padding-top: 10px;
      } @else {
        padding-top: 12px;
      }
      height: calc(100% - 55px);
      .item {
        display: block;
        padding: 0 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        .dot{
          display: inline-block;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          vertical-align: middle;
          background: #191F24;
        }
        .title{
          flex: 1;
          display: inline-block;
          margin-left: 8px;
          @if $fs == 14PX {
            height: 40px;
            line-height: 40px;
          } @else {
            height: 42px;
            line-height: 42px;
          }
          font-size: $fs;
          color: #191F24;
          vertical-align: middle;
        }
        &:hover{
          background-color: rgba(73, 156, 248, 0.08);
          .dot{
            background: #499CF8;
          }
          .title{
            color: #499CF8;
          }
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss';
</style>
