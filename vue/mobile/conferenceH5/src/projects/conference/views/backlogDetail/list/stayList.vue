<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-11 11:44:40
-->
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
        >
          <div class="status">
            <div class="text">
              <i class="status-icon"></i>
              <span>{{ ele.roomFormVO.hotelVO.name }}</span>
            </div>
          </div>
          <div class="car">
            {{ ele.roomFormVO.modelName }}
            <i></i>
            <!-- <i />
            {{ ele.roomNo }}
            <i />
            <div class="room-status room-status-vip" v-if="ele.oneself === 1">单住</div>
            <i v-if="ele.oneself === 1"/> -->
            <!-- <div
              class="room-status"
              :class="ele.fullStatus === 0 ? 'room-status-full' : ele.fullStatus === 1 ? 'room-status-full-no' : ele.fullStatus === 2 ? 'room-status-free' : ''"
            >{{ ele.fullStatusStr }}</div> -->
          </div>
          <!-- <div class="free">
            总床位：{{ ele.totalCount }} 可用床位{{ ele.remainCount }}
          </div> -->
          <div class="time">
            <div>
              <img src="@/assets/images/time.svg" alt="">
              {{ ele.startDate }} - {{ ele.endDate }}
            </div>
            <span>共{{ timeBetween(ele.startDate, ele.endDate) }}天</span>
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
      // 默认选中的日期
      defaultDate: [],
      calendarShow: false,
      minDate: new Date(),
      maxDate: new Date(),
      filterDate: '选择用房时间',
      sidePopupShow: false,
      filterInput: {
        hotelNameLike: '',
        roomNoLike: ''
      },
      // 房间状态
      statusData: [
        { text: '空闲', checked: false, fullStatusList: 0 },
        { text: '未满', checked: false, fullStatusList: 1 },
        { text: '已满', checked: false, fullStatusList: 2 }
      ],
      // 筛选条件房间类型
      roomData: [],
      // 床位数
      roomCountData: [],
      // 房间使用方式
      typesData: [
        { text: '单住', checked: false, oneself: 1 },
        { text: '合住', checked: false, oneself: 0 }
      ],
      params: {
        httpUrl: 'plan.getStayList',
        type: 'up',
        // 模拟数据
        httpParams: {
          attendeeId: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false
    }
  },
  computed: {
    timeBetween() {
      return function(startTime, endTime) {
        const startDate = Date.parse(startTime)
        const endDate = Date.parse(endTime)
        const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
        return Math.ceil(days)
      }
    },
    prevMonth() {
      const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
      // 1 * 24 * 60 * 60 * 1000
      const nowDate = new Date(date).getTime()
      const resTime = nowDate - (60 * 24 * 60 * 60 * 1000)
      const year = new Date(resTime).getFullYear()
      const month = new Date(resTime).getMonth()
      const day = new Date(resTime).getDate()
      return new Date(year, month, day)
    },
    nextMonth() {
      const date = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
      // 1 * 24 * 60 * 60 * 1000
      const nowDate = new Date(date).getTime()
      const resTime = nowDate + (60 * 24 * 60 * 60 * 1000)
      const year = new Date(resTime).getFullYear()
      const month = new Date(resTime).getMonth()
      const day = new Date(resTime).getDate()
      return new Date(year, month, day)
    }
  },
  created() {
    console.log(this.routeParams)
    const attendeeId = this.routeParams.attendeeId
    this.$nextTick(() => {
      this.params.httpParams.attendeeId = attendeeId
    })
    this.getRoomType()
    this.getRoomCount()
    // this.filterDateHandler()
  },
  methods: {
    filterDateHandler() {
      const startDinnerDate = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.startTime))[0]
      const endDinnerDate = (/\d{4}-\d{1,2}-\d{1,2}/g.exec(this.routeParams.endTime))[0]
      // this.prevMonth(startDinnerDate)
      // this.nextMonth(endDinnerDate)
      const nowDateMill = new Date().getTime()
      const startDateMill = new Date(this.routeParams.startTime).getTime()
      const endDateMill = new Date(this.routeParams.endTime).getTime()
      if (nowDateMill > endDateMill) {
        // 当前日期大于结束日期
        this.filterDate = `${startDinnerDate}至${endDinnerDate}`
      } else {
        if (nowDateMill > startDateMill) {
          const now = new Date()
          const year = now.getFullYear()
          const month = now.getMonth() + 1
          const date = now.getDate()
          this.filterDate = `${year}-${month}-${date} 至 ${endDinnerDate}`
        } else {
          this.filterDate = `${startDinnerDate} 至 ${endDinnerDate}`
        }
        const defaultStartDate = new Date(this.filterDate.slice(0, 10))
        const defaultEndDate = new Date(this.filterDate.slice(-10))
        this.defaultDate = [defaultStartDate, defaultEndDate]
      }
    },
    dateConfirm(val) {
      const startTime = this.dateCode(val[0])
      const endTime = this.dateCode(val[1])
      this.filterDate = `${startTime} - ${endTime}`
      // 请求接口
      this.clear = true
      this.params.httpParams.startDate = startTime
      this.params.httpParams.endDate = endTime
      this.params.httpParams.pageNum = 1
      this.calendarShow = false
    },
    dateCode(date) {
      const now = new Date(date)
      const year = now.getFullYear()
      const month = (now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
      const day = (now.getDate()) < 10 ? `0${now.getDate()}` : now.getDate()
      return `${year}-${month}-${day}`
    },
    // 时间选择
    dateHandler() {
      this.calendarShow = true
    },
    // 重置搜索条件
    resetHandler() {
      this.resetRoom()
      this.resetRoomCount()
      this.resetStatus()
      this.resetTypes()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      // 房型
      const roomType = []
      this.roomData.forEach(ele => {
        if (ele.checked) {
          roomType.push(ele.enumKey)
        }
      })
      this.params.httpParams.modelIdList = roomType.join(',')
      // 床位数
      const roomCount = []
      this.roomCountData.forEach(ele => {
        if (ele.checked) {
          roomCount.push(ele.enumKey)
        }
      })
      this.params.httpParams.capacityList = roomCount.join(',')
      // 房间状态
      const status = []
      this.statusData.forEach(ele => {
        if (ele.checked) {
          status.push(ele.fullStatusList)
        }
      })
      this.params.httpParams.fullStatusList = status.join(',')
      // 房间使用方式
      const types = []
      this.typesData.forEach(ele => {
        if (ele.checked) {
          types.push(ele.oneself)
        }
      })
      this.params.httpParams.oneself = types.join(',')
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    roomChoice(index) {
      const isChecked = this.roomData[index].checked
      this.$set(this.roomData[index], 'checked', !isChecked)
    },
    resetRoom() {
      this.roomData.forEach(ele => {
        ele.checked = false
      })
    },
    roomCountChoice(index) {
      const isChecked = this.roomCountData[index].checked
      this.$set(this.roomCountData[index], 'checked', !isChecked)
    },
    resetRoomCount() {
      this.roomCountData.forEach(ele => {
        ele.checked = false
      })
    },
    statusChoice(index) {
      const isChecked = this.statusData[index].checked
      this.$set(this.statusData[index], 'checked', !isChecked)
    },
    resetStatus() {
      this.statusData.forEach(ele => {
        ele.checked = false
      })
    },
    typesChoice(index) {
      this.typesData.forEach(ele => {
        ele.checked = false
      })
      this.$set(this.typesData[index], 'checked', true)
    },
    resetTypes() {
      this.typesData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
    },
    // 获取当前会议下所有房型
    getRoomType() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getRoomType',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
          })
          this.roomData = data
        }
      })
    },
    // 获取当前会议下床位数
    getRoomCount() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getRoomBedCount',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
          })
          this.roomCountData = data
        }
      })
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
  .popup-container {
    width: 100%;
    height: 100%;
    padding: 24px 16px 50px;
    position: absolute;
    left: 0;
    top: 0;
    .popup-title {
      width: 100%;
      height: 50px;
      line-height: 50px;
      font-size: 15px;
      font-weight: 500;
      @include list(row,flex-start,center);
      i {
        display: block;
        width: 4px;
        height: 14px;
        border-radius: 2px;
        background-color: rgba(30, 137, 255, 1);
        margin-right: 4px;
      }
    }
    .filter-condition {
      margin:10px 0 10px -12px;
      li {
        display: inline-block;
        height: 30px;
        line-height: 30px;
        font-size: 12px;
        color: rgba(25, 31, 36, 0.8);
        background-color: rgba(25, 31, 36, 0.04);
        border-radius: 6px;
        padding: 0 31px;
        margin: 0 0 12px 12px;
      }
      .filter-btn-checked {
        background-color: rgba(30, 137, 255, 1);
        color: #fff;
      }
    }
    .filter-input {
      width: 100%;
      margin-bottom: 16px;
      .van-search {
        padding: 0;
      }
    }
    .filter-submit-btn {
      width: 100%;
      height: 50px;
      @include absolute('','',0,0);
      .van-button {
        width: 50%;
        height: 100%;
      }
    }
  }
  .tabs-type {
    width: 100%;
    height: 54px;
    background-color: #fff;
    border-bottom: 1px solid #eee;
    padding: 0 16px;
    @include list(row,space-between,center);
    .tabs-type-item {
      width: 164px;
      height: 38px;
      line-height: 38px;
      text-align: center;
      font-size: 15px;
      border-radius: 22px;
      // background-color: rgba(25, 31, 36, 0.04);
      color: rgba(25, 31, 36, 0.64);
      i {
        display: none;
        width: 30px;
        height: 3px;
        background: linear-gradient(270deg, #40BEFF 0%, #1E89FF 100%);
        border-radius: 2px;
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        bottom: 4px;
      }
    }
    .tabs-type-item-checked {
        color: #1E89FF;
        color: rgba(25, 31, 36, 1);
        font-weight: 500;
      }
  }
  .filter-container {
    width: 100%;
    height: 48px;
    line-height: 48px;
    background-color: #fff;
    padding: 0 16px;
    @include list(row, space-between, center);
    .filter-btn {
      @include list(row, flex-start, center);
      font-size: 13px;
      img {
        margin-left: 4px;
      }
    }
  }
  .list-container {
    height: calc(100% - 120px);
    top: 120px;
    // padding-top: 12px;
    padding-bottom: 64px;
    .list-item {
      width: 100%;
      border-radius: 8px;
      background-color: #fff;
      overflow: hidden;
      // padding: 16px 16px 8px;
      margin-bottom: 12px;
      .status {
        @include list(row, space-between, center);
        font-size: 15px;
        height: 40px;
        line-height: 40px;
        border-bottom: 1px solid #efeff0;
        padding: 0 16px;
        // margin-bottom: 20px;
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
          .task-status {
            color: rgba(248, 183, 0, 1);
          }
        }
      }
      .car {
        font-size: 18px;
        font-weight: 500;
        line-height: 22px;
        margin-bottom: 12px;
        padding: 16px 16px 0;
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
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 12px;
        padding: 0 16px;
      }
      .time {
        @include list(row,space-between,center);
        div {
          @include list(row,flex-start,center);
        }
        font-size: 14px;
        color: rgba(25, 31, 36, 0.64);
        line-height: 18px;
        margin-bottom: 16px;
        padding: 0 16px;
        img {
          margin-right: 8px;
        }
      }
    }
  }
}
</style>
