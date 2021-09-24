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
        <div
          v-for="(ele, index) in data.data"
          :key="index"
          class="list-item"
          :class="ele.status === '-1' ? 'list-item-checked' : ''"
        >
          <div class="status">
            <span>{{ ele.typeCode }}</span>
            <i />
            {{ dinnerTime(ele) }}
          </div>
          <div class="free">
            <span>餐厅：</span>
            {{ ele.dining.dinnerRoom }}
            <i />
            <!-- 可用餐位
            {{ ele.dining.remainCount }}
            <i /> -->
          </div>
          <div class="free">
            <span>地址：</span>
            {{ ele.dining.diningAddress }}
          </div>
        </div>
      </template>
    </list>
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  components: { list },
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      calendarShow: false,
      minDate: new Date(),
      maxDate: new Date(),
      filterDate: '',
      sidePopupShow: false,
      filterInput: {
        dinnerRoomLike: '',
        seatNum: ''
      },
      // 默认选中的日期
      defaultDate: [],
      // 用餐类型
      mealData: [],
      params: {
        httpUrl: 'plan.getMealList',
        type: 'up',
        httpParams: {
          conferenceId: '',
          attendeeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  computed: {
    dinnerTime() {
      return function(data) {
        const nowDate = new Date().getTime()
        const deDate = new Date(data.dinnerEndDate).getTime()
        const differDate = Math.ceil((deDate - nowDate) / (1000 * 60 * 60 * 24))
        const dinnerStartDate = this.dateFormat(data.dinnerStartDate)
        const dinnerEndDate = this.dateFormat(data.dinnerEndDate)
        const startTime = data.startTime.slice(0, 5)
        const endTime = data.endTime.slice(0, 5)
        let result = ''
        if (differDate === 1) {
          result = `${dinnerStartDate}至明天 ${startTime}-${endTime}`
        } else if (differDate === 2) {
          result = `${dinnerStartDate}至后天 ${startTime}-${endTime}`
        } else {
          result = `${dinnerStartDate}至${dinnerEndDate} ${startTime}-${endTime}`
        }
        return result
      }
    }
  },
  created() {
    const attendeeId = this.routeParams.attendeeId
    const id = this.routeParams.id
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
      this.params.httpParams.attendeeId = attendeeId
    })
    // this.getMeal()
  },
  methods: {
    dateFormat(dateVal) {
      const date = new Date(dateVal)
      const month = date.getMonth() + 1
      const today = date.getDate()
      return `${month}月${today}日`
    },
    // getMeal() {
    //   const id = this.routeParams.id
    //   const attendeeId = this.routeParams.attendeeId
    //   this.$api({
    //     url: 'plan.getMealList',
    //     data: {
    //       conferenceId: id,
    //       attendeeId
    //     }
    //   }).then(res => {
    //     if (res.code === 2000) {
    //       const data = res.result
    //       data.list.forEach(ele => {
    //         ele.checked = false
    //       })
    //       this.mealData = data.list
    //     }
    //   })
    // },
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
    height: calc(100% - 110px);
    // top: 48px;
    // // padding-top: 12px;
    // padding-bottom: 64px;
    // height: 100%;
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
        @include list(row, flex-start, center);
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        margin-bottom: 18px;
        i {
          display: block;
          width: 1px;
          height: 14px;
          margin: 0 10px;
          background-color: rgba(25, 31, 36, 0.64);
        }
        span {
          font-size: 16px;
          color: rgba(25, 31, 36, 1);
          font-weight: 500;
        }
      }
      .car {
        font-size: 18px;
        font-weight: 500;
        line-height: 22px;
        margin-bottom: 6px;
        @include list(row, flex-start,center);
        i {
          display: block;
          width: 1px;
          height: 18px;
          background-color: rgba(216, 216, 216, 1);
          margin: 0 10px;
        }
        .room-status {
          height: 20px;
          line-height: 20px;
          padding: 0 7px;
          font-size: 13px;
          color: #fff;
          border-radius: 4px;
        }
        .room-status-free {
          background-color: rgba(3, 190, 28, 1);
        }
        .room-status-full-no {
          background-color: rgba(248, 183, 0, 1);
        }
        .room-status-full {
          background-color: rgba(25, 31, 36, 0.32);
        }
        .room-status-vip {
          background: linear-gradient(230deg, #FF00EA 0%, #8000F8 100%);
        }
      }
      .free {
        font-size: 14px;
        color: rgba(25, 31, 36, 1);
        line-height: 18px;
        margin-bottom: 4px;
        span {
          color: rgba(25, 31, 36, 0.48);
        }
      }
      .time {
        @include list(row,flex-start,center);
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 8px;
        img {
          margin-right: 8px;
        }
      }
    }
    .list-item-checked {
      .status {
        color: rgba(25, 31, 36, 0.32);
        i {
          background-color: rgba(25, 31, 36, 0.32);
        }
        span {
          color: rgba(25, 31, 36, 0.32);
        }
      }
      .car {
        i {
          background-color: rgba(216, 216, 216, 1);
        }
      }
      .free {
        color: rgba(25, 31, 36, 0.32);
        span {
          color: rgba(25, 31, 36, 0.32);
        }
      }
      .time {
        color: rgba(25, 31, 36, 0.32);
      }
    }
  }
}
</style>
