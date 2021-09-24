<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:07:50
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <van-cell-group>
        <van-cell title="用车类型" :value="detailData.type === '1' ? '接站用车': '送站用车'" border />
        <van-cell title="车型" :value="detailData.vehicle.vehicleTypeVO.name" border />
        <van-cell title="车牌号" :value="detailData.vehicle.platNum" border />
        <van-cell title="司机" :value="detailData.driverVO.name" border />
        <van-cell title="手机" :value="detailData.driverVO.phone" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <van-cell-group>
        <van-cell title="出发时间" :value="detailData.startTime.slice(0, detailData.startTime.length - 3)" border />
        <van-cell title="上车时间" :value="detailData.endTime.slice(0, detailData.endTime.length - 3)" border />
        <van-cell v-if="type.indexOf('1') !== -1 || type.indexOf('2') !== -1" title="接站地点" :value="detailData.startAddress" border />
        <van-cell v-if="type.indexOf('1') !== -1 || type.indexOf('2') !== -1" title="送达地点" :value="detailData.endAddress" borde0r />
        <van-cell v-if="type.indexOf('1') !== -1 || type.indexOf('2') !== -1" title="送达时间" :value="detailData.endTime.slice(0, detailData.endTime.length - 3)" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <van-cell-group>
        <van-cell title="乘车人" :value="detailData.contactPerson" border />
        <van-cell title="联系人" :value="detailData.contactPerson" border />
        <van-cell title="联系电话" :value="detailData.contactPhone" border />
        <!-- <van-cell title="同乘人员" :value="内容" border /> -->
      </van-cell-group>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    },
    dataInfo: {
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
    const conferenceId = this.routeParams.conferenceId
    const taskId = this.routeParams.taskId
    const type = this.routeParams.type
    const dataInfo = JSON.parse(this.routeParams.dataInfo)
    this.type = type
    console.log(this.routeParams)
    if (type === '4') {
      // console.log(this.detailData)
      // 专车详情
      this.$api({
        url: 'plan.getSpecialCar',
        data: {
          conferenceId,
          taskId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list[0]
          this.detailData = Object.assign({}, dataInfo, data)
        }
      })
    } else {
      // 接站送站详情
      this.$api({
        url: 'plan.getCar',
        data: {
          conferenceId,
          taskId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list[0]
          this.detailData = Object.assign({}, dataInfo, data)
        }
      })
    }
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
