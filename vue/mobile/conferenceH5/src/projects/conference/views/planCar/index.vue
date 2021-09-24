<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-02 23:50:10
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-31 17:43:01
-->
<template>
  <div class="plan-container">
    <ul class="plan-list">
      <li
        v-for="ele in specialCarData"
        :key="ele.id"
        class="special-car"
        @click="$router.push({
          name: 'formCar',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('taskId')]: $enc(ele.id),
            [$enc('type')]: $enc('4'),
            [$enc('dataInfo')]: $enc(JSON.stringify(ele))
          }
        })"
      >
        <div class="location">
          <h3>
            <span class="time">{{ ele.startTime.slice(0, ele.startTime.length - 3) }}</span>
          </h3>
          <div class="type">专车</div>
        </div>
        <div class="car">
          <h4>{{ ele.vehicle.vehicleTypeVO.name }} {{ ele.vehicle.platNum }}</h4>
          <div class="detail">
            司机：{{ ele.driverVO.name }} | {{ ele.driverVO.phone }}
          </div>
        </div>
      </li>
      <li
        v-for="ele in carData"
        :key="ele.id"
        @click="$router.push({
          name: 'formCar',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.conferenceId),
            [$enc('taskId')]: $enc(ele.id),
            [$enc('type')]: $enc('1,2'),
            [$enc('dataInfo')]: $enc(JSON.stringify(ele))
          }
        })"
      >
        <div class="location">
          <h3>
            <span class="time">{{ ele.startTime.slice(0, ele.startTime.length - 3) }}</span>
            <i />
            <div class="status" :class="ele.type === '1' ? '' : 'status-checked'">
              <img :src="ele.type === '1' ? pickUp : delivery" alt="">
              {{ ele.type === '1' ? '接站' : '送站 '}}
            </div>
          </h3>
          <div class="detail">
            送往：<span>{{ ele.endAddress }}</span>
          </div>
          <div class="detail">
            上车地点：<span>{{ ele.startAddress }}</span>
          </div>
        </div>
        <div class="car">
          <h4>{{ ele.vehicle.vehicleTypeVO.name }} {{ ele.vehicle.platNum }}</h4>
          <div class="detail">
            司机：{{ ele.driverVO.name }} | {{ ele.driverVO.phone }}
          </div>
        </div>
      </li>
    </ul>
    <!-- <div class="single-btn-bottom fixed">
      <van-button type="info" @click="checkMore">查看其他用车安排</van-button>
    </div> -->
  </div>
</template>

<script>
import pickUp from '@/assets/images/pickUp.svg'
import delivery from '@/assets/images/delivery.svg'
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      pickUp, delivery,
      // 用车任务
      carData: [],
      // 专车任务
      specialCarData: []
    }
  },
  created() {
    const conferenceId = this.routeParams.conferenceId
    const attendeeId = this.routeParams.attendeeId
    // 用车任务
    this.$api({
      url: 'plan.getCarList',
      data: {
        // 1 接站 2 送站 3 会议用车 4 专车
        typeList: '1,2,3',
        conferenceId,
        attendeeId
      }
    }).then(res => {
      if (res.code === 2000) {
        this.carData = res.result.list
      }
    })
    // 专车任务
    this.$api({
      url: 'plan.getSpecialCarList',
      data: {
        conferenceId,
        attendeeId
      }
    }).then(res => {
      if (res.code === 2000) {
        this.specialCarData = res.result.list
      }
    })
  },
  methods: {
    checkMore() {
      // alert(1)
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.plan-container {
  min-height: 100%;
  background-color: #f8f8f8;
  width: 100%;
  padding: 16px 16px 80px;
  .plan-list {
    li {
      border-radius: 12px;
      background-color: #fff;
      margin-bottom: 16px;
      overflow: hidden;
      box-shadow: 0px 4px 32px 0px rgba(0, 0, 0, 0.12);;
      .location {
        padding: 16px 16px 12px;
        h3 {
          line-height: 22px;
          @include list(row,flex-start,center);
          margin-bottom: 16px;
          .time {
            font-size: 17px;
            font-weight: 500;
          }
          i {
            width: 1px;
            height: 18px;
            background-color: rgba(216, 216, 216, 1);
            margin: 0 8px;
          }
          .status {
            @include list(row,flex-start,center);
            color: #FF8200;
            font-size: 14px;
            img {
              margin-right: 4px;
            }
          }
          .status-checked {
            color: rgba(0, 162, 140, 1);
          }
        }
      }
      .detail {
          font-size: 13px;
          line-height: 18px;
          color: rgba(25, 31, 36, 0.64);
          margin-bottom: 4px;
          span {
            font-size: 13px;
            color: rgba(25, 31, 36, 1);
          }
      }
      .car {
        background-color: rgba(25, 31, 36, 0.02);
        padding: 12px 16px 12px;
        h4 {
          font-weight: 500;
          margin-bottom: 7px;
        }
      }
    }
    .special-car {
      .type {
        padding-bottom: 10px;
      }
      .type, .time {
        font-size: 28px;
        color: rgba(156, 110, 55, 1);
        line-height: 34px;
        font-weight: 500;
      }
      .car {
        background-color: rgba(179, 133, 78, 1);
        h4 {
          color: rgba(255, 255, 255, 1);
        }
        .detail {
          color: rgba(255, 255, 255, 0.64);
        }
      }
    }
  }
}
</style>
