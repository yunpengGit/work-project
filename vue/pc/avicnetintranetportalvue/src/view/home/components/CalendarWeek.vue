<template>
  <div class="home-calendar">
    <div class="header">
      <!-- <span class="calendar-date"><span class="day">{{ +calendarDate.day }}</span><span class="month">{{ +calendarDate.month }}月</span><span class="year">{{ calendarDate.year }}</span></span> -->
      <!-- <div class="continer-box btn-box fix">
        <span class="fr info-btn-notext" @click="refreshFn">
          <el-tooltip class="item" effect="dark" content="刷新" placement="bottom">
            <span class="info-btn-notext-icon"><icon-svg name="shuaxin" /></span>
          </el-tooltip>
        </span>
        <div class="fr fix week-day">
          <span class="fl info-btn" @click="prevFn">
            <span class="info-btn-icon">
              上周
            </span>
          </span>
          <span class="fl info-btn" @click="todayFn">
            <span class="info-btn-icon">
              今天
            </span>
          </span>
          <span class="fl info-btn" @click="nextFn">
            <span class="info-btn-icon">
              下周
            </span>
          </span>
        </div>
      </div> -->
    </div>
    <div class="content">
      <div class="week-list fix">
        <div v-for="item in weekList" :key="item" class="item">{{ item }}</div>
      </div>
      <div class="day-list fix">
        <div
          v-for="item in dayList"
          :key="item.dateTime"
          class="item"
          :class="{
            'selected': item.selected,
            'current': isTodayFn(item.dateTime,today),
            'disable': item.otherMonth,
          }"
          @click="clickFn(item.dateTime)"
        >
          <div class="solar">{{ +item.dateTime.substring(8) }}</div>
          <div class="lunar">{{ item.lunar }}</div>
          <div v-if="tipFn(item.dateTime)" class="tip">
            <span class="self" />
            <!-- <span v-if="tipSelfFn(item.dateTime)" class="self" />
            <span v-if="tipSharedFn(item.dateTime)" class="shared" /> -->
          </div>
        </div>
      </div>
    </div>
    <mqtt-client @change="change" />
  </div>
</template>

<script>
import solarLunar from 'solarlunar'
// import iconSvg from '@/components/icon-svg'
import formatDate from '@/utils/format-date'
import MqttClient from '@/components/MqttMessage'
export default {
  name: 'Calendar',
  components: {
    // iconSvg,
    MqttClient
  },
  filters: {
    d (value) {
      return formatDate(value, 'd')
    }
  },
  props: {
    calendarTypeList: {
      type: Array,
      default: () => []
    },
    rangeNum: {
      type: Number,
      default: 14
    }
  },
  data () {
    return {
      interval: null,
      today: formatDate(new Date(), 'yyyy-MM-dd'),
      calendarDate: {},
      weekList: ['日', '一', '二', '三', '四', '五', '六'],
      calendarRange: [],
      dayList: [{
        dateTime: '',
        selected: false,
        lunar: '',
        shared: false,
        self: false,
        otherMonth: false,
        tip: []
      }]
    }
  },
  watch: {
    calendarDate: {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        this.$emit('calendarDateFn', newVal)
      }
    }
  },
  created () {
    this.init()
  },
  methods: {
    change (data) {
      if (data === 'SCHEDULE') {
        this.init()
      }
    },
    init () {
      const now = new Date(this.today)
      this.calendarDate = this.yearMonthDay(formatDate(now, 'yyyy-MM-dd'))
      const day = now.getDay()
      const d = now.getDate()
      const start = now.setDate(d - day)
      const startDate = new Date(start)
      // console.log(formatDate(startDate, 'yyyy-MM-dd'))
      const end = now.setDate(new Date(start).getDate() + this.rangeNum - 1)
      const endDate = new Date(end)
      this.calendarRange = [formatDate(startDate, 'yyyy-MM-dd'), formatDate(endDate, 'yyyy-MM-dd')]
      this.dayListFn()
    },
    yearMonthDay (dateStr) {
      // yyyy-MM-dd 格式获取 年月日
      const year = dateStr.substring(0, 4)
      const month = dateStr.substring(5, 7)
      const day = dateStr.substring(8)
      return {
        year,
        month,
        day
      }
    },
    dayListFn (day) {
      const monthOfToday = formatDate(new Date(), 'MM')
      const start = new Date(this.calendarRange[0])
      let n = 0
      const arr = []
      while (n < this.rangeNum) {
        let dateTime
        if (n === 0) {
          dateTime = formatDate(start, 'yyyy-MM-dd')
        } else {
          dateTime = formatDate(start.setDate(start.getDate() + 1), 'yyyy-MM-dd')
        }
        const yearMonthDay = this.yearMonthDay(dateTime)
        const { year, month, day } = yearMonthDay
        const solar2lunar = solarLunar.solar2lunar(year, month, day)
        const obj = {
          dateTime,
          lunar: solar2lunar.term ? solar2lunar.term : (solar2lunar.dayCn === '初一' ? solar2lunar.monthCn : solar2lunar.dayCn),
          selected: false,
          otherMonth: monthOfToday !== month,
          tip: []
        }
        arr.push(obj)
        ++n
      }
      // console.log(arr)
      this.dayList = arr
      this.$emit('scheduleFn', this.calendarRange[0], this.calendarRange[1], this.dayList)
    },
    tipFn (dateTime) {
      // console.log(this.calendarTypeList)
      const type = this.calendarTypeList.find(ele => {
        return dateTime === ele.dateTime
      })

      // console.log(type, type && type.self, type && type.shared)
      // const status = type ? (type.self || type.shared) : false
      return type ? (type.self || type.shared) : false
    },
    tipSelfFn (dateTime) {
      const type = this.calendarTypeList.find(ele => {
        return dateTime === ele.dateTime
      })
      return type && type.self
    },
    tipSharedFn (dateTime) {
      const type = this.calendarTypeList.find(ele => {
        return dateTime === ele.dateTime
      })
      return type && type.shared
    },
    clickFn (dateTime) {
      this.calendarMonth = dateTime
      this.dayList = this.dayList && this.dayList.map(ele => {
        if (dateTime === ele.dateTime) {
          ele.selected = true
        } else {
          ele.selected = false
        }
        return ele
      })
      // 点击今天查询今天明天的日程
      const today = new Date()
      if (dateTime === formatDate(today, 'yyyy-MM-dd')) {
        this.$emit('scheduleFn', dateTime, formatDate(today.setTime(today.getTime() + 24 * 60 * 60 * 1000), 'yyyy-MM-dd'))
      } else {
        this.$emit('scheduleFn', dateTime, dateTime)
      }
    },
    isTodayFn (date1, date2) {
      return formatDate(new Date(date1), 'yyyy-MM-dd') === formatDate(new Date(date2), 'yyyy-MM-dd')
    },
    beforeTodayFn (date1, date2) {
      const num1 = new Date(formatDate(new Date(date1), 'yyyy-MM-dd'))
      const num2 = new Date(formatDate(new Date(date2), 'yyyy-MM-dd'))
      return +num1 < +num2
    },
    todayFn () {
      this.calendarMonth = formatDate(new Date(), 'yyyy-MM-dd')
      this.init()
    },
    refreshFn () {
      this.init()
    },
    prevFn () {
      const startDay = new Date(this.calendarRange[0])
      const endDay = new Date(this.calendarRange[0])
      // console.log(this.calendarRange[0])
      const start = formatDate(startDay.setDate(startDay.getDate() - this.rangeNum), 'yyyy-MM-dd')
      const end = formatDate(endDay.setDate(endDay.getDate() - 1), 'yyyy-MM-dd')
      this.calendarRange = [start, end]
      // console.log(this.calendarRange)
      this.dayListFn()
    },
    nextFn () {
      const startDay = new Date(this.calendarRange[1])
      const endDay = new Date(this.calendarRange[1])
      const start = formatDate(startDay.setDate(startDay.getDate() + 1), 'yyyy-MM-dd')
      const end = formatDate(endDay.setDate(endDay.getDate() + this.rangeNum), 'yyyy-MM-dd')
      this.calendarRange = [start, end]
      // console.log(this.calendarRange)
      this.dayListFn()
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14PX){
  .home-calendar{
    .header{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .continer-box-title{
        padding: 0;
        .week-day{
          .info-btn{
            & + &{
              margin-left: 0;
            }
            .info-btn-icon{
              position: relative;
              margin-left: 0;
              &:hover{
                z-index: 1;
              }
            }
            &:first-child{
              .info-btn-icon{
                border-top-right-radius: 0;
                border-bottom-right-radius: 0;
              }
            }
            &:not(:first-child):not(:last-child){
              .info-btn-icon{
                border-radius: 0;
              }
            }
            &:not(:last-child){
              .info-btn-icon{
                margin-right: -1px;
              }
            }
            &:last-child {
              .info-btn-icon{
                border-top-left-radius: 0;
                border-bottom-left-radius: 0;
              }
            }
          }
        }
      }
      /* .continer-box-title .info-btn-notext{
        height: 30px;
      }
      .continer-box-title .info-btn{

      } */
      .calendar-date{
        .day{
          width: 45px;
          height: 48px;
          text-align: center;
          font-size: 40px;
          color: #191F24;
          line-height: 48px;
        }
        .month,
        .year{
          width: 36px;
          height: 25px;
          font-size: 18px;
          font-weight: 400;
          color: rgba(25, 31, 36, 0.5);
          line-height: 25px;
        }
      }
    }
    .content{
      .week-list{
        font-size: $fs;
        color: rgba($color: #191F24, $alpha: 0.48);
        line-height: 20px;
        display: flex;
        .item{
          flex: 1;
          height: 20px;
          text-align: center;
        }
      }
      .day-list{
        display: flex;
        .item{
          flex: 1;
          display: flex;
          flex-direction: column;
          /* justify-content: center; */
          align-items: center;
          box-sizing: border-box;
          margin: 9px 6px;
          height: 44px;
          cursor: pointer;
          .solar{
            margin-top: -3px;
            width: 26px;
            height: 26px;
            font-size: $fs;
            font-weight: 500;
            color: #191F24;
            line-height: 26px;
            text-align: center;
            border-radius: 50%;
            border: 1px solid transparent;
          }
          .lunar {
            margin-top: 5px;
            height: 12px;
            font-size: 12px * $sc;
            color: rgba($color: #191F24, $alpha: 0.48);
          }
          .tip{
            flex: 1;
            margin-top: -3px;
            span{
              width: 4px;
              height: 4px;
              border-radius: 50%;
            }
            .self{
              background: #499CF8;
            }
            .shared{
              margin-left: 2px;
              background: #FF8200;
            }
          }
          &.disable{
            opacity: 0.4;
          }
          &.current{
            .solar{
              color:  #499CF8;
              border: 1px solid #499CF8;
            }
          }
          &:hover{
            .solar{
              color:  #fff;
              background-color: #499CF8;
            }
            /* .lunar {
              color:  #fff;
            } */
            /* .tip{
              .self{
                background: #fff;
              }
              .shared{
                background: #fff;
              }
            } */
          }
          &.selected{
            .solar{
              color:  #fff;
              background-color: #499CF8;
            }
            /* .lunar {
              color:  #fff;
            }
            .tip{
              .self{
                background: #fff;
              }
              .shared{
                background: #fff;
              }
            }
            background-color: #499CF8; */
            cursor: context-menu;
          }
        }
      }
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
