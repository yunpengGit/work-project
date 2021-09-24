<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:07:56
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <van-cell-group>
        <van-cell title="用餐类型" :value="detailData.typeCode" border />
        <van-cell title="用餐时间" :value="`${detailData.startTime.slice(0,detailData.startTime.length -3)}-${detailData.endTime.slice(0,detailData.endTime.length -3)}`" border />
        <van-cell title="餐厅位置" :value="detailData.dining.diningAddress ? detailData.dining.diningAddress : '-'" border />
        <van-cell title="桌位" :value="detailData.tableNo ? detailData.tableNo : '-'" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <van-cell-group>
        <van-cell title="餐厅名称" :value="detailData.dining.dinnerRoom ? detailData.dining.dinnerRoom : '-'" border />
        <van-cell title="餐厅电话" :value="detailData.dining.phone ? detailData.dining.phone : '-'" border />
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
      detailData: null,
      type: ''
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
  min-height: 100%;
  background-color: #f8f8f8;
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
