<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-07-04 20:23:03
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <van-cell-group>
        <van-cell title="票证名称" :value="detailData.cardName" border />
        <van-cell title="状态" :value="detailData.cardStatusStr" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <van-cell-group>
        <van-cell title="生效日期" :value="detailData.effectiveTime" border />
        <van-cell title="失效日期" :value="detailData.invalidTime" border />
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      detailData: null
    }
  },
  created() {
    const dataInfo = JSON.parse(this.routeParams.dataInfo)
    this.detailData = Object.assign({}, dataInfo)
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  padding: 12px;
  .form-item {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;
    background-color: #fff;
    margin-bottom: 12px;
    .van-cell {
      height: 53px;
      line-height: 53px;
      padding-top: 0;
      padding-bottom: 0;
      .van-cell__left-icon, .van-cell__right-icon {
        line-height: 53px;
      }
      .van-cell__title {
        font-size: 15px;
        color: rgba(25, 31, 36, 0.64);
      }
      .van-cell__value {
        span {
          font-size: 15px;
          color: rgba(25, 31, 36, 1);
        }
      }
    }
  }
}
</style>
