<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:08:02
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <van-cell-group>
        <van-cell title="住宿类型" :value="detailData.oneself === 0 ? '共享' : '单住'" border />
        <van-cell title="房型" :value="detailData.roomFormVO.modelName ? detailData.roomFormVO.modelName : '-'" border />
        <van-cell title="房间号" :value="detailData.roomNo ? detailData.roomNo : '-'" border />
        <van-cell title="房间位置" :value="detailData.description ? detailData.description : '-'" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <van-cell-group>
        <van-cell title="酒店名称" :value="detailData.roomFormVO.hotelVO.name ? detailData.roomFormVO.hotelVO.name : '-'" border />
        <van-cell title="酒店地址" :value="detailData.roomFormVO.hotelVO.address ? detailData.roomFormVO.hotelVO.address : '-'" border />
        <van-cell title="入住日期" :value="detailData.startDate" border />
        <van-cell title="退房日期" :value="detailData.endDate" border />
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
