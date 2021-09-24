<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="car-container">
    <!-- 顶部参会人tab -->
    <van-sticky>
      <div class="attendee-tab">
        <span
          v-for="(ele, index) in carAttendeeList"
          :key="index"
          @click="handleAttendee(ele, index)"
          class="attendee-item"
          :class="activeIndex === index ? 'active-attendee-item' : ''"
        >
          {{ ele.fixAttributeCommonVO.attendeeName }}
        </span>
      </div>
    </van-sticky>
    <!-- 专车卡片 -->
    <van-swipe
      class="special-train"
      :loop="false"
      v-if="specialCarTaskData.length"
      show-indicators
      indicator-color="#fff"
    >
      <van-swipe-item
        v-for="(ele, index) in specialCarTaskData"
        :key="index"
        @click="
          $router.push({
            name: 'planSpecialCarDetail',
            query: {
              [$enc('conferenceId')]: $enc(routeParams.conferenceId),
              [$enc('attendeeId')]: $enc(currentAttendeeId),
              [$enc('planSpecialCarDetailData')]: $enc(ele)
            }
          })
        "
      >
        <img class="special-train-icon" src="@/assets/images/specialTrain.svg" alt="" />
        <div class="title">
          {{ ele.vehicle.platNum }}
        </div>
        <div class="type">{{ ele.vehicle.vehicleColorStr }} | {{ ele.vehicle.vehicleTypeVO.name }}</div>
        <div class="date">
          <span class="label"><img src="../conferenceHomePage/img/time.svg" alt="" /></span>
          <span
class="text"
            >{{ filterDate(ele.startTime) }} - {{ filterDate(ele.endTime) }} (
            {{ filterDays(filterDate(ele.startTime), filterDate(ele.endTime)) }}天 )</span
          >
        </div>
      </van-swipe-item>
    </van-swipe>
    <!-- 接送站安排/会议用车安排tab -->
    <div style="background: #fff" v-if="carTabDataList.length">
      <van-tabs
        class="car-tab"
        title-active-color="#2063F8"
        @change="handleCarType"
        v-model="carTypeValue"
        :style="{ width: carTabDataList.length > 1 ? '75%' : '35%' }"
      >
        <van-tab v-for="(ele, index) in carTabDataList" :key="index" :name="index" :title="ele"> </van-tab>
      </van-tabs>
    </div>
    <div class="task-container">
      <!-- 没有专车时展示蓝色背景图片 -->
      <!-- <div class="nomal-car-bgc" v-if="!specialCarTaskData.length">
      </div> -->
      <!-- 时间操作栏 -->
      <div class="tool-bar" v-if="carTabDataList.length">
        <div class="time-title">
          <div class="one-day" v-if="dropdownValue == 0" @click="showCalendar = true">
            {{ filterHanziDate(startTime) }}
            <span v-if="todayOrtomo(startTime).length">&nbsp;({{ todayOrtomo(startTime) }})</span>
            <span><img src="@/assets/images/blackArrow.svg" alt="" /></span>
          </div>
          <div class="some-day" v-else>{{ filterHanziDate(startTime) }}-{{ filterHanziDate(endTime) }}</div>
        </div>
        <div class="oneOrAll">
          <van-dropdown-menu active-color="#3070FF">
            <van-dropdown-item v-model="dropdownValue" :options="optionsData" @change="handleDropdown" />
          </van-dropdown-menu>
          <img src="@/assets/images/blackArrow.svg" alt="" />
        </div>
      </div>
      <!-- 时间滚轮选择器 -->
      <van-popup
        class="applicant-pop"
        v-model="showCalendar"
        position="bottom"
        round
        :style="{ minHeight: '40%', maxHeight: '60%' }"
      >
        <div class="applicant-pop-title">请选择日期</div>
        <van-picker
          show-toolbar
          toolbar-position="bottom"
          title=" "
          :columns="carDateColumns"
          @cancel="showCalendar = false"
          @confirm="onConfirmDate"
        />
      </van-popup>
      <!-- 用车任务列表 -->
      <list
        class="car-task-list"
        :style="{
          top: specialCarTaskData.length ? '312px' : '162px',
          height: specialCarTaskData.length ? 'calc(100% - 312px)' : 'calc(100% - 162px)'
        }"
        :params="params"
        @onRefresh="onRefresh"
        @onLoad="onLoad"
        :clear="clear"
        @resetClear="resetClear"
      >
        <template v-slot:item="data">
          <div
            class="task-item"
            :style="{ 'margin-bottom': index == data.data.length - 1 ? '0' : '10px' }"
            v-for="(ele, index) in data.data"
            :key="index"
            @click="
              $router.push({
                name: 'planCommonCarDetail',
                query: {
                  [$enc('conferenceId')]: $enc(routeParams.conferenceId),
                  [$enc('attendeeId')]: $enc(currentAttendeeId),
                  [$enc('planCommonCarDetailData')]: $enc(ele)
                }
              })
            "
          >
            <div class="title">
              <div>
                <div class="time">{{ ele.getOnVehicleTime.slice(11, 16) }}</div>
                <div class="date">{{ filterHanziDate(ele.getOnVehicleTime.slice(0, 10)) }}</div>
              </div>
              <div style="text-align: end;">
                <div class="car-num">{{ ele.vehicle.platNum }}</div>
                <div class="car-type">{{ ele.vehicle.vehicleColorStr }} | {{ ele.vehicle.vehicleTypeVO.name }}</div>
              </div>
            </div>
            <div class="content">
              <div class="info-item">
                <div class="label">上车地点</div>
                <div class="value">
                  {{ ele.startAddress }}
                  <span v-if="ele.getOnVehicleAddress.length">({{ ele.getOnVehicleAddress }})</span>
                </div>
              </div>
              <div class="info-item">
                <div class="label">送往</div>
                <div class="value">{{ ele.endAddress || '-' }}</div>
              </div>
            </div>
          </div>
        </template>
      </list>
    </div>
    <!-- </van-sticky> -->
  </div>
</template>

<script>
import list from '@/components/list'
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  components: {
    list
  },
  data() {
    return {
      activeIndex: 0,
      showCalendar: false, // 日期滚轮选择器是否显示
      startTime: '', // 距离今天最近的一天用餐日期
      endTime: '', // 结束日期
      dropdownValue: 0,
      optionsData: [
        { text: '每日安排', value: 0 },
        { text: '全部', value: 1 }
      ],
      currentAttendeeId: '', // 当前参会人的attendeeId
      carAttendeeList: [], // 参会人列表
      specialCarTaskData: [], // 专车任务列表
      carDateColumns: [], // 用车日历

      /* 接送站安排/会议用车安排tab */
      carTypeValue: 0,
      carTabDataList: [],

      typeList: '', // 任务类型：1接站，2送站，3会议

      params: {
        httpUrl: 'attendeeApi.getCarTask',
        type: 'up',
        httpParams: {
          conferenceId: '',
          pageNum: 1,
          pageSize: 10,
          attendeeId: '',
          typeList: '',
          publish: 1,
          startTime: '',
          endTime: ''
        }
      },
      clear: false
    }
  },
  computed: {},
  async created() {
    const stayAttendeeArr = JSON.parse(this.routeParams.carAttendeeList)
    this.carAttendeeList = stayAttendeeArr
    this.currentAttendeeId = this.carAttendeeList[0].id

    // 获取接送站安排/会议用车安排tab
    const show12 = await this.getCarTab('1,2')
    const show3 = await this.getCarTab('3')
    if (show12 && show3) {
      this.carTabDataList = ['接送站安排', '会议用车安排']
    } else if (show12 && !show3) {
      this.carTabDataList = ['接送站安排']
    } else if (!show12 && show3) {
      this.carTabDataList = ['会议用车安排']
    } else {
      this.carTabDataList = []
    }
    if (show12) {
      this.typeList = '1,2'
    } else {
      this.typeList = '3'
    }
    // 获取用车日历
    this.getCarDateData()
    // 获取专车任务
    this.getSpecialCarTaskData()
  },
  mounted() {},
  methods: {
    // 将时间2021-08-25 18:00:00 处理为 2021.08.25
    filterDate(time) {
      const str = time.replace(/-/g, '.')
      const newStr = str.slice(0, str.length - 9)
      return newStr
    },
    // 将时间2021-08-25 处理为 2021年08月25日
    filterHanziDate(time) {
      const str = time.replace('-', '年').replace('-', '月')
      const newStr = str + '日'
      return newStr
    },
    // 有几天
    filterDays(start1, end1) {
      const start = start1.slice(0, 10)
      const end = end1.slice(0, 10)
      const timestamp = Date.parse(new Date(end)) - Date.parse(new Date(start))
      const days = timestamp / (1000 * 3600 * 24)
      return days
    },
    // 切换每日安排/全部安排
    handleDropdown(value) {
      this.getCarDateData()
    },

    // 选择日期
    onConfirmDate(date) {
      this.showCalendar = false
      this.startTime = date

      // 调接口获取任务接口
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.routeParams.conferenceId,
        attendeeId: this.currentAttendeeId,
        startTime: this.startTime + ' 00:00:00',
        publish: 1,
        typeList: this.typeList,
        pageNum: 1,
        pageSize: 10
      }
    },

    // 切换顶部参会人tab
    async handleAttendee(ele, index) {
      this.dropdownValue = 0
      this.carTypeValue = 0
      this.activeIndex = index
      this.currentAttendeeId = ele.fixAttributeCommonVO.attendeeId

      // 获取接送站安排/会议用车安排tab
      const show12 = await this.getCarTab('1,2')
      const show3 = await this.getCarTab('3')

      if (show12 && show3) {
        this.carTabDataList = ['接送站安排', '会议用车安排']
      } else if (show12 && !show3) {
        this.carTabDataList = ['接送站安排']
      } else if (!show12 && show3) {
        this.carTabDataList = ['会议用车安排']
      } else {
        this.carTabDataList = []
      }
      if (show12) {
        this.typeList = '1,2'
      } else {
        this.typeList = '3'
      }

      if (this.carTabDataList.length) {
        // 获取用车日历
        this.getCarDateData()
      } else {
        // 没有tab时清空数据
        this.clear = true
        this.params.httpParams = {
          conferenceId: this.routeParams.conferenceId,
          attendeeId: this.currentAttendeeId,
          publish: 1,
          pageNum: 1,
          pageSize: 10
        }
      }
      // 获取专车任务
      this.getSpecialCarTaskData()
    },
    // 切换 接送站安排/会议用车安排tab
    handleCarType(index) {
      if (index === 0) {
        this.typeList = '1,2'
      } else {
        this.typeList = '3'
      }

      // 调接口获取任务列表
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.routeParams.conferenceId,
        attendeeId: this.currentAttendeeId,
        startTime: this.startTime + ' 00:00:00',
        typeList: this.typeList,
        publish: 1,
        pageNum: 1,
        pageSize: 10
      }
      if (this.dropdownValue) {
        this.params.httpParams.endTime = this.endTime + ' 00:00:00'
      }
    },

    // 获取接送站/会议用车tab
    getCarTab(typeList) {
      return new Promise(resolve => {
        const conferenceId = this.routeParams.conferenceId
        const paramsData = {}
        paramsData.conferenceId = conferenceId
        paramsData.attendeeId = this.currentAttendeeId
        paramsData.typeList = typeList
        paramsData.publish = 1
        this.$api({
          url: 'attendeeApi.getCarTask',
          data: paramsData
        }).then(res => {
          if (res.code === 2000) {
            const data = res.result.total
            resolve(data)
          }
        })
      })
    },

    // 获取专车任务
    getSpecialCarTaskData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.attendeeId = this.currentAttendeeId
      this.$api({
        url: 'attendeeApi.getSpecialCarTask',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result.list
          this.specialCarTaskData = data
        }
      })
    },

    // 获取用车日历
    getCarDateData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.attendeeId = this.currentAttendeeId
      paramsData.publish = 1
      this.$api({
        url: 'attendeeApi.getCarDate',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result
          if (data.length) {
            const newArr = []
            data.forEach(ele => {
              newArr.push(ele.slice(0, ele.length - 9))
            })
            this.carDateColumns = newArr
            this.getNearestDate()
          }
        }
      })
    },
    // 选出离今天最近的一天
    getNearestDate() {
      // 将时间集合和今天转为时间戳
      const data = this.carDateColumns
      const allDays = data.map(item => {
        return Date.parse(item)
      })
      // 获取今天时间戳
      const dt = new Date()
      const y = dt.getFullYear()
      const m = (dt.getMonth() + 1).toString().padStart(2, 0)
      const d = dt.getDate().toString().padStart(2, 0)
      const todayStr = y + '-' + m + '-' + d + ' ' + '00:00:00'
      const today = Date.parse(todayStr)

      // 找到插入index值
      var index = null
      for (let i = 0; i < allDays.length; i++) {
        if (allDays[i] >= today) {
          index = i
          break
        }
      }

      // 将时间戳转为时间字符串
      const arr = []
      allDays.forEach(item => {
        const dt = new Date(item)
        const y = dt.getFullYear()
        const m = (dt.getMonth() + 1).toString().padStart(2, 0)
        const d = dt.getDate().toString().padStart(2, 0)
        const hh = dt.getHours().toString().padStart(2, 0)
        const mm = dt.getMinutes().toString().padStart(2, 0)
        const ss = dt.getSeconds().toString().padStart(2, 0)
        const str = y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
        arr.push(str)
      })
      if (index) {
        // 当前时间介于最早、最晚之间，加载今天的用餐信息
        this.startTime = arr[index].slice(0, 10)
      } else {
        if (today < allDays[0]) {
          // 当前时间小于最早一天安排，加载第一天的用餐信息
          this.startTime = arr[0].slice(0, 10)
        } else {
          // 当前时间大于最晚一天安排，加载最后一天的用餐信息
          this.startTime = arr[arr.length - 1].slice(0, 10)
        }
      }

      if (this.dropdownValue) {
        this.startTime = arr[0].slice(0, 10)
        this.endTime = arr[arr.length - 1].slice(0, 10)
      }

      // 调接口获取任务列表
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.routeParams.conferenceId,
        attendeeId: this.currentAttendeeId,
        startTime: this.startTime + ' 00:00:00',
        typeList: this.typeList,
        publish: 1,
        pageNum: 1,
        pageSize: 10
      }
      if (this.dropdownValue) {
        this.params.httpParams.endTime = this.endTime + ' 00:00:00'
      }
    },

    // 判断是否为今天和明天
    todayOrtomo(date) {
      const today = new Date().toDateString()
      const tomStr = Date.parse(new Date()) + 24 * 60 * 60 * 1000
      const tomorrow = new Date(tomStr).toDateString()
      const nowDate = new Date(Date.parse(date)).toDateString()
      if (today === nowDate) {
        return '今天'
      } else if (tomorrow === nowDate) {
        return '明天'
      } else {
        return ''
      }
    },

    onRefresh() {
      this.clear = true
      this.params.httpParams.pageNum++
      this.params.httpParams.pageNum = 1
      // this.params.type = 'down'
    },
    onLoad() {
      this.params.httpParams.pageNum++
      this.params.type = 'up'
    },
    resetClear() {
      this.clear = false
    }
  }
}
</script>

<style scoped lang="scss">
.list-container {
  // height: calc(100% - 150px);
  background-color: #f2f5fc;
  // top: 150px;
  padding: 0;
  ::v-deep .list-item-container {
    padding: 0 12px;
  }
}
// 滚轮选择器样式
.applicant-pop {
  .applicant-pop-title {
    text-align: center;
    height: 40px;
    line-height: 40px;
    font-size: 14px;
    color: rgba(25, 31, 36, 0.64);
    border-bottom: 0.5px solid rgba(25, 31, 36, 0.08);
  }
  .van-picker {
    background: rgba(25, 31, 36, 0.04);
    ::v-deep .van-picker__columns .van-picker-column__item {
      font-size: 17px;
    }
    ::v-deep .van-picker__toolbar {
      height: 56px;
      line-height: 56px;
      margin-top: 16px;
      background-color: #fff;
    }
    ::v-deep .van-picker__cancel {
      font-size: 17px;
      width: 50%;
    }
    ::v-deep .van-picker__confirm {
      flex: 1;
      font-size: 17px;
      box-shadow: -0.5px 0px 0px 0px rgba(25, 31, 36, 0.08);
      color: #1e89ff;
    }
  }
}
.car-container {
  width: 100%;
  height: 100%;
  background-color: #f2f5fc;
  ::v-deep .van-pull-refresh {
    padding-top: 0px !important;
  }
  // 顶部参会人tab
  .attendee-tab {
    height: 54px;
    padding: 10px 12px;
    background: #ffffff;
    min-width: 100%;
    overflow-y: auto;
    white-space: nowrap;
    .attendee-item {
      display: inline-block !important;
      padding: 0 14px;
      height: 33px;
      line-height: 33px;
      background: #f1f1f1;
      border-radius: 17px;
      font-size: 15px;
      color: #191f24;
      margin-right: 10px;
      text-align: center;
    }
    .active-attendee-item {
      background: linear-gradient(136deg, #2946bf 0%, #537ce1 100%);
      color: #ffffff;
    }
  }
  // 专车卡片
  .special-train {
    position: relative;
    background: url('../../../../assets/images/carBgc.svg') no-repeat;
    height: 150px;
    background-size: cover;
    padding: 18px 20px;
    .special-train-icon {
      position: absolute;
      right: 40px;
    }
    ::v-deep .van-swipe__indicator--active {
      width: 14px;
      border-radius: 6px;
    }
    .title {
      font-size: 22px;
      font-weight: 500;
      color: #ffffff;
      line-height: 34px;
      margin-bottom: 5px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
    }
    .type {
      height: 21px;
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: #ffffff;
      line-height: 21px;
      margin-bottom: 23px;
    }
    .exceed {
      font-size: 20px;
      line-height: 30px;
    }
    .date {
      line-height: 16px;
    }
    .address {
      margin-top: 9px;
      line-height: 16px;
      .text {
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
    }
    .date,
    .address {
      display: flex;
      font-size: 16px;
      color: #ffffff;
      .label {
        height: 16px;
        line-height: 16px;
        width: 20px;
      }
      .text {
        opacity: 0.8;
        flex: 1;
      }
    }
  }
  // 接送站安排/会议用车安排tab
  .car-tab {
    height: 54px;
    background-color: #fff;
    ::v-deep .van-tab__text--ellipsis {
      font-size: 18px;
    }
  }
  ::v-deep .van-tabs__line {
    width: 30px;
    background-color: #2063f8;
  }
  .task-container {
    background: #f2f5fc;
    overflow: auto;
    .nomal-car-bgc {
      height: 137px;
      background: url('../../../../assets/images/nomalCarBgc.svg') no-repeat;
    }
  }
  // 时间操作栏
  .tool-bar {
    padding: 0 20px 0 20px;
    height: 54px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .time-title {
      font-size: 15px;
      .one-day {
        display: flex;
        align-items: center;
        img {
          margin-left: 5px;
          width: 16px;
          height: 16px;
        }
      }
    }
    ::v-deep .van-dropdown-item--down {
      // top: 108px !important;
    }
    ::v-deep .van-dropdown-menu__title--active {
      color: #000 !important;
    }
    ::v-deep .van-dropdown-menu__item {
      justify-content: flex-end;
      background-color: rgba(255, 255, 255, 0);
    }
    ::v-deep .van-dropdown-menu__bar {
      height: 100%;
      box-shadow: none;
      background-color: rgba(255, 255, 255, 0);
    }
    ::v-deep .van-dropdown-menu__title::after {
      display: none;
    }
    ::v-deep .van-cell {
      background-color: #f2f5fc;
    }
    ::v-deep .van-ellipsis {
      margin-right: 10px;
    }
    .oneOrAll {
      position: relative;
      width: 26%;
      img {
        position: absolute;
        top: 4px;
        right: -4px;
      }
    }
    .time-title {
      flex: 1;
    }
  }
  // 任务列表
  .car-task-list {
    .task-item {
      box-shadow: 0px 0px 6px 0px rgba(0, 0, 0, 0.16);
      border-radius: 4px;
      margin-top: 6px;
      background-color: #fff;
      padding: 15px 18px 0 18px;
      .title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 13px;
        .time {
          height: 20px;
          font-size: 28px;
          color: #102c70;
          line-height: 20px;
          font-weight: 600;
          margin-bottom: 7px;
        }
        .date,
        .car-type {
          height: 21px;
          font-size: 15px;
          font-weight: 400;
          color: #102c70;
          line-height: 21px;
        }
        .car-num {
          margin-bottom: 7px;
          height: 24px;
          font-size: 18px;
          font-weight: 600;
          color: #102c70;
          line-height: 24px;
        }
      }
      .content {
        .info-item {
          font-size: 14px;
          display: flex;
          align-items: center;
          padding: 16px 24px 16px 0;
          border-top: 1px solid #f1f1f2;
          .label {
            width: 80px;
            color: rgba(25, 31, 36, 0.64);
            margin-right: 20px;
          }
          .value {
            flex: 1;
            color: #191f24;
            line-height: 20px;
          }
          .phone {
            display: flex;
            align-items: center;
            justify-content: space-between;
          }
        }
      }
    }
  }
}
</style>
