<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-16 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div class="dining-container">
    <div class="attendee-tab">
      <span
        v-for="(ele, index) in diningAttendeeList"
        :key="index"
        @click="handleAttendee(ele, index)"
        class="attendee-item"
        :class="activeIndex === index ? 'active-attendee-item' : ''"
      >
        {{ ele.fixAttributeCommonVO.attendeeName }}
      </span>
    </div>
    <div class="blue-bg"></div>
    <div class="tool-bar">
      <div class="time-title">
        <div class="one-day" v-if="dropdownValue == 0" @click="showCalendar = true">
          {{ filterDate(startDinnerDate) }}&nbsp;
          <span v-if="todayOrtomo(startDinnerDate).length">({{ todayOrtomo(startDinnerDate) }})</span>
          <span><img src="@/assets/images/whiteArrow.svg" alt="" /></span>
        </div>
        <div class="some-day" v-else>{{ filterDate(startDinnerDate) }}-{{ filterDate(endDinnerDate) }}</div>
      </div>
      <div class="oneOrAll">
        <van-dropdown-menu active-color="#3070FF">
          <van-dropdown-item v-model="dropdownValue" :options="optionsData" @change="handleDropdown" />
        </van-dropdown-menu>
        <img src="@/assets/images/whiteArrow.svg" alt="" />
      </div>
    </div>
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
        :columns="diningDateColumns"
        @cancel="showCalendar = false"
        @confirm="onConfirmDate"
      />
    </van-popup>
    <list
      class="dining-task-list"
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      :clear="clear"
      @resetClear="resetClear"
    >
      <template v-slot:item="data">
        <div class="task-item" v-for="(ele, index) in data.data" :key="index">
          <div class="top">
            <div class="room">
              <div>
                <span
                  >{{ ele.dining.dinnerRoom
                  }}<span v-if="ele.tableNo && ele.tableNo.length"> | {{ ele.tableNo }}号桌</span></span
                >
              </div>
              <a :href="`tel:${ele.dining.phone}`" v-if="ele.dining.phone.length">
                <img src="@/assets/images/phone.svg" alt="" />
              </a>
            </div>
            <div class="address">
              {{ ele.dining.diningAddress || '暂无餐厅位置信息' }}
            </div>
          </div>
          <div class="time">
            <div class="time-info">
              {{ filterDate(startDinnerDate) }}
              <span v-if="todayOrtomo(startDinnerDate).length" style="margin-right: 5px">{{
                todayOrtomo(startDinnerDate)
              }}</span
              >{{ ele.startTime.slice(0, 5) }}-{{ ele.endTime.slice(0, 5) }}
            </div>
            <span class="dining-type">{{ ele.typeCode }}</span>
          </div>
        </div>
        <div class="dining-notice">
          <div class="dining-notice-item" v-for="(ele, index) in noRepeat(data.data)" :key="index">
            <p>餐厅名称+用餐须知</p>
            <p><span style="font-weight: 700">·</span> {{ ele.dining.notice }}</p>
          </div>
        </div>
      </template>
    </list>
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
      startDinnerDate: '', // 距离今天最近的一天用餐日期
      endDinnerDate: '', // 结束日期
      dropdownValue: 0,
      optionsData: [
        { text: '每日安排', value: 0 },
        { text: '全部', value: 1 }
      ],
      currentAttendeeId: '', // 当前参会人的attendeeId
      diningAttendeeList: [], // 参会人列表
      diningTaskData: [], // 任务列表
      diningDateColumns: [], // 用餐日历

      params: {
        httpUrl: 'attendeeApi.getDinnerTask',
        type: 'up',
        httpParams: {
          conferenceId: '',
          pageNum: 1,
          pageSize: 10,
          attendeeId: '',
          publish: 1,
          startDinnerDate: '',
          endDinnerDate: ''
        }
      },
      clear: false
    }
  },
  computed: {},
  created() {
    const stayAttendeeArr = JSON.parse(this.routeParams.diningAttendeeList)
    this.diningAttendeeList = stayAttendeeArr
    this.currentAttendeeId = this.diningAttendeeList[0].id

    // 获取用餐日历
    this.getDiningDateData()
  },
  mounted() {},
  methods: {
    // 餐厅须知去重
    noRepeat(data) {
      const list = [...data]
      const result = []
      const obj = {}
      for (let i = 0; i < list.length; i++) {
        if (list[i].dining.notice && list[i].dining.notice.length) {
          if (!obj[list[i]['diningId']]) {
            result.push(list[i])
            obj[list[i].diningId] = true
          }
        }
      }
      return result
    },
    // 将时间2021-08-25 处理为 2021年08月25日
    filterDate(time) {
      const str = time.replace('-', '年').replace('-', '月')
      const newStr = str + '日'
      return newStr
    },
    // 切换每日安排/全部安排
    handleDropdown(value) {
      this.getDiningDateData()
    },

    // 切换顶部参会人tab
    handleAttendee(ele, index) {
      this.dropdownValue = 0
      this.activeIndex = index
      this.currentAttendeeId = ele.fixAttributeCommonVO.attendeeId
      this.getDiningDateData()
    },
    // 获取所有存在任务的日期集合
    getDiningDateData() {
      const conferenceId = this.routeParams.conferenceId
      const paramsData = {}
      paramsData.conferenceId = conferenceId
      paramsData.attendeeId = this.currentAttendeeId
      paramsData.publish = 1
      this.$api({
        url: 'attendeeApi.getDinnerDate',
        data: paramsData
      }).then(res => {
        if (res.success) {
          const data = res.result
          if (data.length) {
            const newArr = []
            data.forEach(ele => {
              newArr.push(ele.slice(0, ele.length - 9))
            })
            this.diningDateColumns = newArr
            this.getNearestDate()
          }
        }
      })
    },

    // 选出离今天最近的一天
    getNearestDate() {
      // 将时间集合和今天转为时间戳
      const data = this.diningDateColumns
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
        this.startDinnerDate = arr[index].slice(0, 10)
      } else {
        if (today < allDays[0]) {
          // 当前时间小于最早一天安排，加载第一天的用餐信息
          this.startDinnerDate = arr[0].slice(0, 10)
        } else {
          // 当前时间大于最晚一天安排，加载最后一天的用餐信息
          this.startDinnerDate = arr[arr.length - 1].slice(0, 10)
        }
      }

      if (this.dropdownValue) {
        this.startDinnerDate = arr[0].slice(0, 10)
        this.endDinnerDate = arr[arr.length - 1].slice(0, 10)
      }

      // 调接口获取任务列表
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.routeParams.conferenceId,
        attendeeId: this.currentAttendeeId,
        startDinnerDate: this.startDinnerDate,
        publish: 1,
        pageNum: 1,
        pageSize: 10
      }
      if (this.dropdownValue) {
        this.params.httpParams.endDinnerDate = this.endDinnerDate
      }
      // this.getDiningTaskData()
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

    // 选择日期
    onConfirmDate(date) {
      this.showCalendar = false
      this.startDinnerDate = date

      // 调接口获取任务接口
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.routeParams.conferenceId,
        attendeeId: this.currentAttendeeId,
        startDinnerDate: this.startDinnerDate,
        publish: 1,
        pageNum: 1,
        pageSize: 10
      }
      if (this.dropdownValue) {
        this.params.httpParams.endDinnerDate = this.endDinnerDate
      }
    },
    onRefresh() {
      this.params.httpParams.pageNum++
      this.params.type = 'down'
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
  height: calc(100% - 108px);
  top: 108px;
  padding: 0;
  background: rgba(255, 255, 255, 0);
}

.dining-container {
  width: 100%;
  height: 100%;
  position: relative;
  ::v-deep .van-pull-refresh {
    padding-top: 0px !important;
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
  .blue-bg {
    height: 128px;
    background: linear-gradient(180deg, #2946bf 0%, #537ce1 100%);
  }
  .tool-bar {
    position: absolute;
    top: 54px;
    padding: 0 20px 0 20px;
    width: 100%;
    color: #fff;
    height: 54px;
    background: rgba(255, 255, 255, 0);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 15px;
    .time-title {
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
      top: 108px !important;
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
    ::v-deep .van-dropdown-menu__title {
      color: #fff;
      font-size: 15px;
    }
    ::v-deep .van-dropdown-menu__title--active {
      color: #fff !important;
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
  .dining-task-list {
    .task-item {
      margin: 0 20px 12px 20px;
      background: linear-gradient(315deg, #ffffff 0%, #f2f5fc 100%);
      box-shadow: 0px 0px 4px 0px rgba(107, 127, 153, 0.41);
      border-radius: 4px;
      .top {
        padding: 19px 16px 11px 16px;
        border-bottom: 1px solid #f1f1f2;
        .room {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          div {
            flex: 1;
            height: 24px;
            font-size: 18px;
            font-family: PingFangSC-Medium, PingFang SC;
            font-weight: 500;
            color: #102c70;
            line-height: 24px;
            // text-shadow: 0px 0px 4px rgba(107, 127, 153, 0.41);
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          a {
            width: 16px;
          }
        }
        .address {
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #253763;
          line-height: 18px;
          // text-shadow: 0px 0px 4px rgba(107, 127, 153, 0.41);
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 2;
          overflow: hidden;
        }
      }
      .time {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 54px;
        padding: 0 16px;
        .time-info {
          height: 18px;
          font-size: 15px;
          font-family: PingFangSC-Regular, PingFang SC;
          font-weight: 400;
          color: #102c70;
          line-height: 18px;
          // text-shadow: 0px 0px 4px rgba(107, 127, 153, 0.41);
        }
        .dining-type {
          height: 22px;
          font-size: 16px;
          font-family: PingFangSC-Medium, PingFang SC;
          font-weight: 500;
          color: #102c70;
          line-height: 22px;
          // text-shadow: 0px 0px 4px rgba(107, 127, 153, 0.41);
        }
      }
    }
    .dining-notice {
      padding: 16px 0 0 16px;
      font-size: 14px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.64);
      line-height: 21px;
      .dining-notice-item {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
