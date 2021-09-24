<template>
  <div class="manage-use-car-container">
    <list
      :params="params"
      :clear="clear"
      @resetClear="resetClear"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
    >
      <template v-slot:item="data">
        <div v-if="tabsIndex === 0">
          <div
            v-for="(ele, index) in data.data"
            :key="index"
            class="list-item"
          >
            <div class="status">
              <div class="text">
                <i class="status-icon"></i>
                <span>{{ ele.typeStr }}</span>
                <i class="line">|</i>
                <span class="task-status" :style="{color: statusColor(ele.status)}">{{ status(ele.status) }}</span>
              </div>
              <img src="@/assets/images/conferenceBacklogArrow.svg" alt="">
            </div>
            <div class="car">{{ ele.vehicle.vehicleTypeVO.name }} - {{ ele.vehicle.platNum }}</div>
            <div class="free">
              {{ ele.vehicle.vehicleTypeVO.seatNum }}座 | 可乘{{ ele.remainCount }}人
            </div>
            <div class="detail">
              <span class="origin">始发地：</span>
              {{ ele.startAddress }}
            </div>
            <div class="detail">
              <span class="destination">目的地：</span>
              {{ ele.endAddress }}
            </div>
            <div class="detail">
              <span>司机：</span>
              {{ ele.driverVO.name }}
            </div>
            <div class="detail">
              <span>日期：</span>
              {{ ele.startTime.slice(0, ele.startTime.length - 3) }} - {{ ele.endTime.slice(0, ele.endTime.length - 3) }}
            </div>
          </div>
        </div>
        <div v-if="tabsIndex === 1">
          <div
            v-for="(ele, index) in data.data"
            :key="index"
            class="list-item list-item-car"
          >
            <div class="status">
              <div class="status-choice">
                <div class="car">
                  {{ ele.platNum }}
                  <div class="car-status">空闲</div>
                </div>
              </div>
            </div>
            <div class="text">
              <span>{{ ele.vehicleTypeVO.name }}</span>
              <i class="line">|</i>
              <span>{{ ele.vehicleColorStr }}</span>
              <i class="line">|</i>
              <span>{{ ele.vehicleTypeVO.seatNum }}座位</span>
            </div>
            <!-- <div class="detail">
              <span>所属公司：</span>
              {{ ele.vehicleCompanyVO.name }}
            </div> -->
            <div class="detail">
              <span>司机：</span>
              {{ ele.driverVO ? ele.driverVO.name : '-' }} | {{ ele.driverVO ? ele.driverVO.phone: '-' }}
            </div>
          </div>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
import { Toast } from 'vant'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      dateStartShow: false,
      dateEndShow: false,
      sidePopupShow: false,
      // 筛选条件车型
      modelListData: [],
      params: {
        httpUrl: 'plan.getCarList',
        type: 'up',
        // 模拟数据
        httpParams: {
          conferenceId: '',
          startTime: '',
          attendeeId: '',
          typeList: []
        }
      },
      clear: false,
      tabsIndex: 0,
      popoverText: [{ text: '取消任务' }],
      showPopover: []
    }
  },
  computed: {},
  created() {
    console.log(this.routeParams, 'this.routeParams')
    const attendeeId = this.routeParams.attendeeId
    const id = this.routeParams.id
    // const startTime = this.routeParams.startTime
    const typeList = this.routeParams.taskType === '61' ? 1 : this.routeParams.taskType === '62' ? 2 : 3
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
      this.params.httpParams.attendeeId = attendeeId
      this.params.httpParams.typeList = typeList
      this.params.httpParams.startTime = ''
    })
  },
  methods: {
    cardCancel(ele, popoverText) {
      console.log(ele, 'eleeeee')
      const attendeeId = this.routeParams.attendeeId
      const id = ele.id
      const cardStatus = 6
      const organizationName = ele.organizationName
      const organizationSortName = ele.organizationSortName
      const description = ele.description
      if (ele.cardType === 1) {
        const params = {
          attendee: {
            id: attendeeId
          },
          card: {
            cardStatus,
            description,
            id,
            organizationName,
            organizationSortName
          }
        }
        this.$api({
          url: 'plan.updateGuesCard',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            Toast('取消任务成功')
            window.location.reload()
          }
        }).catch(err => {
          Toast(err.message)
        })
      }
    },
    resetClear() {
      this.clear = false
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.manage-use-car-container{
  min-height: 100%;
  background-color: #f8f8f8;
  .list-container {
    // height: calc(100% - 48px);
    // top: 48px;
    // // padding-top: 12px;
    // padding-bottom: 64px;
    height: calc(100% - 110px);
    padding: 24px 16px 50px;
    margin: 100px 0;
    .list-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;
      padding: 16px 16px 8px;
      margin-bottom: 12px;
      .status {
        @include list(row, space-between, center);
        font-size: 15px;
        margin-bottom: 20px;
        .text {
          color: rgba(25, 31, 36, 1);
          @include list(row, flex-start, center);
          .status-icon {
            display: block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: rgba(25, 31, 36, 0.12);
            margin-right: 8px;
          }
          .line {
            color: rgba(25, 31, 36, 0.24);
            margin: 0 10px;
          }
          .task-status {
            color: rgba(248, 183, 0, 1);
          }
        }
      }
      .car {
        font-size: 20px;
        font-weight: 500;
        line-height: 25px;
        margin-bottom: 6px;
      }
      .free {
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 20px;
      }
      .detail {
        font-size: 14px;
        line-height: 18px;
        margin-bottom: 8px;
        span {
          color: rgba(25, 31, 36, 0.48);
        }
        .origin {
          color: rgba(0, 162, 140, 1);
        }
        .destination {
          color: rgba(255, 130, 0, 1);
        }
      }
    }
    .list-item-car {
    .status {
      margin-bottom: 16px;
    }
    .car {
      font-size: 15px;
      margin-bottom: 0;
      font-weight: 400;
      @include list(row,flex-start,center);
      .car-status {
        font-size: 13px;
        width: 40px;
        height: 20px;
        text-align: center;
        line-height: 20px;
        color: #fff;
        background-color: #03BE1C;
        margin-left: 4px;
        border-radius: 4px;
      }
    }
    .text {
      font-size: 18px;
      font-weight: 500;
      margin-bottom: 16px;
    }
    .line {
      color: rgba(25, 31, 36, 0.24);
      margin: 0 10px;
    }
  }
  }
}
</style>
