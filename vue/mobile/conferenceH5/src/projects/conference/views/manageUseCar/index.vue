<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-09-03 15:19:49
-->
<template>
  <div class="manage-use-car-container">
    <!-- <div class="tabs-type">
      <div
        v-for="(ele, index) in tabsTypeData"
        :key="ele.text"
        class="tabs-type-item"
        :class="ele.checked ? 'tabs-type-item-checked' : ''"
        @click="tabsTypeHandle(index)"
      >
        {{ ele.text }}
        <i :class="ele.checked ? 'show' : ''"></i>
      </div>
    </div> -->
    <div class="filter-container">
      <div class="filter-btn" @click="dateHandler">
        {{ filterDate }}
        <img src="@/assets/images/arrowDown.svg" alt="">
      </div>
      <div class="filter-btn" @click="filterHandler">
        筛选
        <img src="@/assets/images/filter.svg" alt="">
      </div>
    </div>
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
            @click="$router.push({
              name: 'formUserCarManage',
              query: {
                [$enc('id')]: $enc(ele.id),
                [$enc('conferenceId')]: $enc(routeParams.id),
                [$enc('startTime')]: $enc(routeParams.startTime),
                [$enc('endTime')]: $enc(routeParams.endTime),
              }
            })"
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
            @click="$router.push({
              name: 'editCar',
              query: {
                [$enc('conferenceId')]: $enc(routeParams.id),
                [$enc('id')]: $enc(ele.id),
                [$enc('addUserFlag')]: $enc(true),
              }
            })"
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
    <van-popup
      v-model="sidePopupShow"
      position="right"
      :style="{ width: '315px',height:'100%' }"
      round
    >
      <div class="popup-container">
        <div class="popup-title">
          <i />
          车型
        </div>
        <ul class="filter-condition">
          <li
            v-for="(ele,index) in modelListData"
            :key="index"
            @click="modelChoice(index)"
            :class="ele.checked ? 'filter-btn-checked' : ''"
          >
            {{ ele.enumValue }}
          </li>
        </ul>
        <div class="popup-title">
          <i />
          其他条件筛选
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.platNumLike"
            background="#fff"
            placeholder="输入车牌号查询"
          />
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.startAddressLike"
            background="#fff"
            placeholder="输入始发地查询"
          />
        </div>
        <div class="filter-input">
          <van-search
            v-model="filterInput.endAddressLike"
            background="#fff"
            placeholder="输入目的地查询"
          />
        </div>
      </div>
      <div class="filter-submit-btn">
        <van-button @click="resetHandler">重置</van-button>
        <van-button type="info" @click="submitHandler">确定</van-button>
      </div>
    </van-popup>
    <van-popup v-model="dateStartShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择开始时间" :columns="columnsStart" @confirm="startChoice" @cancel="dateStartShow=false"/>
    </van-popup>
    <van-popup v-model="dateEndShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择结束时间" :columns="columnsEnd" @confirm="endChoice" @cancel="dateEndShow=false"/>
    </van-popup>
    <!-- <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="$router.push({
          name: 'addUserCar',
          query: {
            [$enc('conferenceId')]: $enc(routeParams.id),
            [$enc('startTime')]: $enc(routeParams.startTime),
            [$enc('endTime')]: $enc(routeParams.endTime),
          }
        })"
        >添加用车任务</van-button>
    </div> -->
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
      dateStartShow: false,
      dateEndShow: false,
      // 选择的开始时间
      choiceStartTime: '',
      // 选择的结束时间
      choiceEndTime: '',
      columnsStart: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
          defaultIndex: 1
        },
        {
          values: [],
          defaultIndex: 1
        }
      ],
      columnsEnd: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: ['0时', '1时', '2时', '3时', '4时', '5时', '6时', '7时', '8时', '9时', '10时', '11时', '12时', '13时', '14时', '15时', '16时', '17时', '18时', '19时', '20时', '21时', '22时', '23时'],
          defaultIndex: 1
        },
        {
          values: [],
          defaultIndex: 1
        }
      ],
      tabsTypeData: [
        { text: '任务车辆', checked: true, queryType: '1' },
        { text: '空闲车辆', checked: false, queryType: '2' }
      ],
      filterDate: '全部用车时间',
      sidePopupShow: false,
      filterInput: {
        // 车牌号筛选
        platNumLike: '',
        // 出发地筛选
        startAddressLike: '',
        // 目的地筛选
        endAddressLike: ''
      },
      // 筛选条件车型
      modelListData: [],
      params: {
        httpUrl: 'task.getArriveCarTaskPc',
        type: 'up',
        // 模拟数据
        httpParams: {
          publish: '',
          conferenceId: '',
          startTime: '',
          endTime: '',
          // 车牌号查询
          platNumLike: '',
          // 始发地查询
          startAddressLike: '',
          // 目的地查询
          endAddressLike: '',
          // 车型选择 传 enumKey值 多个中间用,分割
          vehicleTypeLike: '',
          pageNum: 1,
          pageSize: 10
        }
      },
      clear: false,
      tabsIndex: 0
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
    },
    statusColor() {
      return function(status) {
        let result = ''
        if (status === -1) {
          result = '#aeb2b7'
        } else if (status === 0) {
          result = '#191F24'
        } else if (status === 1) {
          result = '#F8B700'
        } else if (status === 2) {
          result = '#aeb2b7'
        } else if (status === 3) {
          result = '#aeb2b7'
        }
        return result
      }
    }
  },
  created() {
    console.log(this.routeParams)
    const { id, startTime, endTime } = this.routeParams
    this.filterDate = `${startTime.slice(0, startTime.length - 3)}-${endTime.slice(0, endTime.length - 3)}`
    this.$nextTick(() => {
      this.params.httpParams.conferenceId = id
      this.params.httpParams.startTime = startTime
      this.params.httpParams.endTime = endTime
    })
    // 获取当前会议下的所有可选车型
    this.getModel()
    // 获取日程可选择的时间范围
    this.getAgendaDate()
  },
  methods: {
    // 结束日期选择
    endChoice(val) {
      const choiceEndTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.choiceEndTime = choiceEndTime
      // 结束时间不得大于开始时间
      if (new Date(this.choiceEndTime).getTime() < new Date(this.choiceStartTime).getTime()) {
        this.$toast({
          message: '结束时间不得大于开始时间',
          duration: 3000
        })
        return
      }
      this.filterDate = `${this.choiceStartTime.slice(0, this.choiceStartTime.length - 3)} 至 ${this.choiceEndTime.slice(0, this.choiceEndTime.length - 3)}`
      // 请求接口
      this.clear = true
      this.params.httpParams.startTime = this.choiceStartTime
      this.params.httpParams.endTime = this.choiceEndTime
      this.params.httpParams.pageNum = 1
      this.dateEndShow = false
      console.log(this.params.httpParams.startTime, this.params.httpParams.endTime)
    },
    // 开始日期选择
    startChoice(val) {
      this.dateStartShow = false
      const choiceStartTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.choiceStartTime = choiceStartTime
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this.columnsEnd[2].values.push(`${minute}分`)
      }
      const calendarYear = this.columnsEnd[0].values
      const calendarHour = this.columnsEnd[1].values
      const calendarMinute = this.columnsEnd[2].values
      const startTime = this.routeParams.startTime
      const endTime = this.routeParams.endTime
      const startDay = startTime.slice(0, 10)
      const endDay = endTime.slice(0, 10)
      // const startHour = `${startTime.slice(-8, -6).replace(/\b(0+)/gi, '')}时`
      const endHour = `${endTime.slice(-8, -6).replace(/\b(0+)/gi, '')}时`
      // const startMinute = `${startTime.slice(-5, -3)}分`
      const endMinute = `${endTime.slice(-5, -3)}分`
      // 根据会议开始时间向前退两个月
      const prevYearMonthDay = []
      for (let i = 1; i < 61; i++) {
        const now = new Date(startDay)
        const yesterday = new Date(now.setDate(now.getDate() - i))
        prevYearMonthDay.push(this.formatCode(yesterday))
      }
      for (let i = 0; i < prevYearMonthDay.length; i++) {
        this.columnsEnd[0].values.unshift(prevYearMonthDay[i])
      }
      // 把开始时间和结束时间的日期补全
      const nowYearMonthDay = []
      const getDaysBetween = this.getDaysBetween(startDay, endDay)
      for (let i = 0; i < getDaysBetween; i++) {
        const now = new Date(startDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        nowYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < nowYearMonthDay.length; i++) {
        this.columnsEnd[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.columnsEnd[0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(endDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsEnd[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === endHour)
      this.columnsEnd[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === endMinute)
      this.columnsEnd[2].defaultIndex = minuteIndex
      this.dateEndShow = true
    },
    getAgendaDate() {
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this.columnsStart[2].values.push(`${minute}分`)
      }
      const calendarYear = this.columnsStart[0].values
      const calendarHour = this.columnsStart[1].values
      const calendarMinute = this.columnsStart[2].values
      const startTime = this.routeParams.startTime
      const endTime = this.routeParams.endTime
      const startDay = startTime.slice(0, 10)
      const endDay = endTime.slice(0, 10)
      const startHour = `${startTime.slice(-8, -6).replace(/\b(0+)/gi, '')}时`
      const startMinute = `${startTime.slice(-5, -3)}分`
      // 根据会议开始时间向前退两个月
      const prevYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(startDay)
        const yesterday = new Date(now.setDate(now.getDate() - i))
        prevYearMonthDay.push(this.formatCode(yesterday))
      }
      for (let i = 0; i < prevYearMonthDay.length; i++) {
        this.columnsStart[0].values.unshift(prevYearMonthDay[i])
      }
      // 把开始时间和结束时间的日期补全
      const nowYearMonthDay = []
      const getDaysBetween = this.getDaysBetween(startDay, endDay)
      for (let i = 1; i < getDaysBetween; i++) {
        const now = new Date(startDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        nowYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < nowYearMonthDay.length; i++) {
        this.columnsStart[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.columnsStart[0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(startDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsStart[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === startHour)
      this.columnsStart[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === startMinute)
      this.columnsStart[2].defaultIndex = minuteIndex
    },
    // 将 2020-01-02 转换为 2020年01月01日
    formatCode(date) {
      return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
    },
    // 将 2020年01月02日 转换为2020-01-02
    formatCodeSymbol(yearMonthDay, hour, minute) {
      const choiceYearMonthDay = yearMonthDay.slice(0, -1).replace(/([^\u0000-\u00FF])/g, '-')
      const yearMonthDayArr = choiceYearMonthDay.split('-')
      yearMonthDayArr.forEach((ele, index) => {
        if (ele < 10) {
          yearMonthDayArr[index] = `0${ele}`
        }
      })
      const paramsYearMonthDay = yearMonthDayArr.join('-')
      // 将小时转换为两位数
      const choiceHour = hour.replace(/([^\u0000-\u00FF])/g, '')
      const paramsHour = choiceHour < 10 ? `0${choiceHour}` : choiceHour
      const choiceMinute = minute.replace(/([^\u0000-\u00FF])/g, '')
      const finalStartDate = `${paramsYearMonthDay} ${paramsHour}:${choiceMinute}:00`
      return finalStartDate
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    // 重置搜索条件
    resetHandler() {
      this.resetModelStatus()
      this.resetInputStatus()
    },
    // 确定
    submitHandler() {
      const vehicleTypeLike = []
      this.modelListData.forEach(ele => {
        if (ele.checked) {
          vehicleTypeLike.push(ele.enumValue)
        }
      })
      this.params.httpParams.vehicleTypeLike = vehicleTypeLike.join(',')
      // 清空现有list数据
      this.clear = true
      this.params.httpParams.pageNum = 1
      // 合并输入框内容筛选条件
      const httpParams = Object.assign({}, this.params.httpParams, this.filterInput)
      this.params.httpParams = httpParams
      // 关闭弹窗
      this.sidePopupShow = false
    },
    // 时间选择
    dateHandler() {
      this.choiceStartTime = ''
      this.choiceEndTime = ''
      this.dateStartShow = true
    },
    // 重置车型选择状态
    resetModelStatus() {
      this.modelListData.forEach(ele => {
        ele.checked = false
      })
    },
    // 重置筛选中输入框的内容
    resetInputStatus() {
      Object.keys(this.filterInput).forEach(key => {
        this.filterInput[key] = ''
      })
    },
    // 车型选择
    modelChoice(index) {
      const isChecked = this.modelListData[index].checked
      this.modelListData.forEach(ele => {
        ele.checked = false
      })
      this.$set(this.modelListData[index], 'checked', !isChecked)
    },
    // 更多筛选条件
    filterHandler() {
      this.sidePopupShow = true
    },
    tabsTypeHandle(index) {
      // 当前选中的不允许点击
      if (this.tabsTypeData[index].checked) {
        return
      }
      this.tabsIndex = index
      this.tabsTypeData.forEach(ele => {
        ele.checked = false
      })
      this.tabsTypeData[index].checked = true
      const queryType = this.tabsTypeData[index].queryType
      this.clear = true
      if (index === 0) {
        this.params.httpUrl = 'task.getArriveCarTaskPc'
        this.params.httpParams.sortName = 'startTime'
      } else if (index === 1) {
        this.params.httpUrl = 'task.getCars'
        delete this.params.httpParams.sortName
      }
      this.params.httpParams.queryType = queryType
      this.params.httpParams.pageNum = 1
    },
    // 获取当前会议下所有车型
    getModel() {
      const id = this.routeParams.id
      this.$api({
        url: 'manage.getModel',
        data: {
          conferenceId: id
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.checked = false
          })
          this.modelListData = data
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
.van-picker {
  z-index: 1;
}
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
        background-color: rgba(25, 31, 36, 0.04);
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
    height: calc(100% - 48px);
    top: 48px;
    // padding-top: 12px;
    // padding-bottom: 64px;
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
</style>
<style lang="scss" scoped>
.manage-use-car-container::v-deep {
   .van-pull-refresh {
    padding-top: 12px;
  }
}
</style>
