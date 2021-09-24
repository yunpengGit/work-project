<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-06-06 18:26:28
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-06 18:39:28
-->
<template>
  <div class="home-notice">
    <div class="continer-box continer-box-title clearfix">
      <span class="fl">
        新闻中心
      </span>
      <span class="fr info-btn-notext">
        <el-tooltip class="item" effect="dark" content="更多" placement="bottom">
          <span class="info-btn-notext-icon"><icon-svg name="gengduo" /></span>
        </el-tooltip>
      </span>
    </div>
    <ul class="notice-cont">
      <li class="item">
        <span class="dot" />
        <span class="title ell">[2021-06-04] 真抓实干 以月促年确保“十四五”开局安全生产形势稳定</span>
      </li>
      <li class="item">
        <span class="dot" />
        <span class="title ell">[2021-06-04] 谭瑞松到陕西片区所属单位调研</span>
      </li>
      <li class="item">
        <span class="dot" />
        <span class="title ell">[2021-06-04] 航空工业赴安徽广德参加“六·三”英……</span>
      </li>
      <li class="item">
        <span class="dot" />
        <span class="title ell">[2021-06-04] 罗荣怀赴航空工业向阳、惠阳检查指导……</span>
      </li>
      <li class="item">
        <span class="dot" />
        <span class="title ell">[2021-06-04] 真抓实干、只争朝夕为实现高水平航空……</span>
      </li>
      <li class="item">
        <span class="dot" />
        <span class="title ell">[2021-06-04] 围绕中心 服务大局全力打造航空工业……</span>
      </li>
    </ul>
  </div>
</template>
<script>
import iconSvg from '@/components/icon-svg'
export default {
  components: {
    iconSvg
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
