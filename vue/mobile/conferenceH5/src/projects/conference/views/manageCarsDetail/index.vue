<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:08:39
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <h3>车辆信息</h3>
      <van-cell-group>
        <van-cell title="车辆品牌" :value="detailData.vehicleTypeVO.name" border />
        <van-cell title="座位数" :value="detailData.vehicleTypeVO.seatNum" border />
        <van-cell title="颜色" :value="detailData.vehicleColorStr" border />
        <van-cell title="车牌号" :value="detailData.platNum" border />
        <van-cell title="所属公司" :value="detailData.vehicleCompanyVO.name" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <h3>司机信息</h3>
      <van-cell-group>
        <van-cell title="姓名" :value="detailData.driverVO.name" border />
        <van-cell title="手机号" :value="detailData.driverVO.phone" border />
        <van-cell title="所属公司" :value="detailData.vehicleCompanyVO.name" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <h3>备注</h3>
      <textarea v-model="detailData.description" disabled></textarea>
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
    const id = this.routeParams.id
    this.$api({
      url: 'manage.getCarsDetail',
      data: {
        id
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        this.detailData = data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
.form-container {
  min-height: 100%;
  background-color: #f8f8f8;
  padding: 0 12px 12px;
  .form-item {
    width: 100%;
    // background-color: #fff;
    margin-bottom: 10px;
    > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 16px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    textarea {
      width: 100%;
      height: 200px;
      background-color: #fff;
      border-radius: 8px;
      padding: 16px;
      resize: none;
    }
    .van-cell-group {
      border-radius: 8px;
      overflow: hidden;
    }
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
