<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-03 16:12:31
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-09 19:08:06
-->
<template>
  <div class="form-container" v-if="detailData">
    <div class="form-item">
      <h3>用车信息</h3>
      <van-cell-group>
        <van-cell title="用车类型" :value="detailData.typeStr" border />
        <van-cell title="用车状态" :value="status(detailData.status)" border />
        <van-cell title="出发时间" :value="detailData.startTime.slice(0, detailData.startTime.length - 3)" border />
        <van-cell title="接车时间" :value="detailData.getOnVehicleTime.slice(0, detailData.getOnVehicleTime.length - 3)" border />
        <van-cell v-if="detailData.type.indexOf('1') !== -1 || detailData.type.indexOf('2') !== -1" title="接站地点" :value="detailData.startAddress" border />
        <van-cell title="详细位置" :value="detailData.getOnVehicleAddress" border />
        <van-cell v-if="detailData.type.indexOf('1') !== -1 || detailData.type.indexOf('2') !== -1" title="送达时间" :value="detailData.endTime.slice(0, detailData.endTime.length - 3)" borde0r />
        <van-cell v-if="detailData.type.indexOf('1') !== -1 || detailData.type.indexOf('2') !== -1" title="送达地点" :value="detailData.endAddress" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <h3>车辆信息</h3>
      <van-cell-group>
        <van-cell title="车辆型号" :value="detailData.vehicle.vehicleTypeVO.name" border />
        <van-cell title="座位数" :value="detailData.vehicle.vehicleTypeVO.seatNum" border />
        <van-cell title="可用座位数" :value="detailData.remainCount" border />
        <van-cell
          title="已分配人数"
          :value="detailData.vehicle.vehicleTypeVO.seatNum - detailData.remainCount"
          border
          is-link
          @click="$router.push({
            name: 'manageUseCarStaff',
            query: {
              [$enc('taskId')]: $enc(routeParams.id),
              [$enc('conferenceId')]: $enc(routeParams.conferenceId),
              [$enc('carType')]: $enc(detailData.vehicle.vehicleTypeVO.name),
              [$enc('carNum')]: $enc(detailData.vehicle.platNum),
              [$enc('seatCount')]: $enc(detailData.vehicle.vehicleTypeVO.seatNum),
              [$enc('seatTotal')]: $enc(detailData.remainCount)
            }
          })"
        />
        <van-cell title="颜色" :value="detailData.vehicle.vehicleColorStr" border />
        <van-cell title="车牌号" :value="detailData.vehicle.platNum" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <h3>司机信息</h3>
      <van-cell-group>
        <van-cell title="司机" :value="detailData.driverVO.name" border />
        <van-cell title="手机" :value="detailData.driverVO.phone" border />
      </van-cell-group>
    </div>
    <div class="form-item">
      <h3>备注</h3>
      <textarea v-model="detailData.description" disabled></textarea>
    </div>
    <div class="single-btn-bottom" :class="String(detailData.status) !== '0' ? 'single-btn-bottom-checked' : ''" v-if="!routeParams.hide">
      <van-button
        :disabled="(String(detailData.status) !== '0' || String(detailData.status) === '1') ? true : false"
        @click="$router.push({
          name: 'editUserCar',
          query: {
            [$enc('id')]: $enc(routeParams.id),
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('startTime')]: $enc(routeParams.startTime),
            [$enc('endTime')]: $enc(routeParams.endTime),
          }
        })"
      >
        编辑用车任务
      </van-button>
      <van-button
        :disabled="String(detailData.status) !== '0' ? true : false"
        type="info"
        @click="$router.push({
          name: 'addCarUser',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('taskId')]: $enc(routeParams.id),
          }
        })"
      >
        添加用车人
      </van-button>
    </div>
    <div class="single-btn-bottom single-btn-bottom-allow" :class="String(detailData.status) !== '0' ? 'single-btn-bottom-checked' : ''" v-else>
      <van-button
        type="info"
        :disabled="(String(detailData.status) !== '0' || String(detailData.status) === '1') ? true : false"
        @click="$router.push({
          name: 'editUserCar',
          query: {
            [$enc('id')]: $enc(routeParams.id),
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('startTime')]: $enc(routeParams.startTime),
            [$enc('endTime')]: $enc(routeParams.endTime),
          }
        })"
      >
        编辑用车任务
      </van-button>
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
  computed: {
    status() {
      return function(status) {
        let result = ''
        if (status === -1) {
          result = '已取消'
        } else if (status === 0) {
          result = '未开始'
        } else if (status === 1) {
          result = '进行中'
        } else if (status === 2) {
          result = '已完成'
        } else if (status === 3) {
          result = '删除'
        }
        return result
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const id = this.routeParams.id
    this.$api({
      url: 'manage.getUserCarDetail',
      data: {
        id
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        data.description = data.description ? data.description : '无'
        this.detailData = data
      }
    })
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.form-container {
  min-height: 100%;
  background-color: #f8f8f8;
  padding: 0 12px 64px;
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
  .single-btn-bottom {
    background-color: #fff;
    position: fixed;
    z-index: 9;
    @include list(row, space-between,center);
    .van-button {
      width: 167px;
    }
  }
  .single-btn-bottom-allow {
    .van-button {
      width: 100%;
    }
  }
  .single-btn-bottom-checked {
    .van-button {
      opacity: .6;
    }
  }
}
</style>
