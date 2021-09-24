<template>
  <div class="calendar-component">
    <div class="calendar-header">
      <i class="el-icon-arrow-left" @click="swipe('right')" />
      <span>{{ headerTime }}</span>
      <i class="el-icon-arrow-right" @click="swipe('left')" />
    </div>
    <!-- <v-touch @swipeleft="swipe('left')" @swiperight="swipe('right')"> -->
    <div class="calendar">
      <div class="header-days">
        <div
          v-for="(item, index) in header"
          :key="index"
          :class="item | headerClass"
        >
          {{ item }}
        </div>
      </div>
      <div class="content-days" :style="calendarContentStyle">
        <div class="calendar-main">
          <div
            v-for="(item, i) in totalCalendarList"
            :key="i"
            flex="main:center cross:center"
            @click="dateTab(item)"
          >
            <div
              :class="item | dateClass(selectedDate)"
              @click="!item.disabled"
            >
              <span>{{ item.content }}</span>
              <!-- <span class="text">{{ item.bottomText }}</span> -->
              <span class="icon-tag" flex="cross:center">
                <!-- <span
                  v-if="showIcon(item, 'shared')"
                  class="icon-shared"
                /> -->
                <span v-if="showIcon(item, 'self') || showIcon(item, 'shared')" class="icon-self" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- </v-touch> -->
    <!-- <v-touch
      @panmove="panMove"
      @panend="panEnd"
      :pan-options="{ direction: 'vertical' }"
    >
      <span
        class="iconfont touch-line"
        @click="panEnd2(type === 'month' ? 'week' : 'month')"
        :class="[type === 'month' ? 'shanghua' : 'xiahua']"
      ></span>
    </v-touch> -->
  </div>
</template>

<script>
import { calendar } from '@/utils/calendar'
import { getItem } from '@/utils/storage'
import dayjs from 'dayjs'

export default {
  name: 'Calendar',
  filters: {
    // 星期标题class
    headerClass (item) {
      let classStr = 'main-block-head'
      const activeItems = ['日', '六']
      if (activeItems.includes(item)) {
        classStr += ' active'
      }
      return classStr
    },
    // 日期class
    dateClass (item, selectedDate) {
      let classStr = ''
      if (
        dayjs(item._date).format('YYYY-MM-DD') ===
        dayjs(selectedDate).format('YYYY-MM-DD')
      ) {
        // 判断被选中的日期
        classStr = 'selected_date'
      }
      return `main-block ${item.class || ''} ${classStr} ${
        item.disabled ? 'disabled' : ''
      }`
    }
  },
  props: {
    activeDate: {
      type: Date,
      default () {
        return new Date()
      }
    },
    filters: {
      type: Object,
      default () {
        return {
          fuzzySearchText: '',
          queryRangeType: 'ALL',
          ownerIdsIn: []
        }
      }
    },
    indexType: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
      userInfo: JSON.parse(getItem('userInfo')),
      header: ['日', '一', '二', '三', '四', '五', '六'],
      selectedDate: null,
      totalCalendarList: [],
      calendarContentStyle: {
        height: 'auto',
        transform: 'translateY(0px)'
      },
      calendarInitHeight: 0,
      type: 'month',
      minHeight: 0,
      maxHeight: 0,
      newMargin: 0,
      params: {
        fuzzySearchText: '', // 模糊搜索关键字
        queryRangeType: 'ALL', // ALL-所有日程；MY_ONLY-我的日程；ALL_SHARING-全部共享；不传表示所有范围
        ownerIdsIn: [], // 所属人ID
        dateFrom: '', // 日期范围（开始）yyyy-MM-dd
        dateTo: '', // 日期范围（结束）yyyy-MM-dd
        includeDateFrom: true, // 是否包含dateFrom那天的结果
        includeDateTo: true, // 是否包含dateTo那天的结果
        orderByDateAsc: true // 是否按照date升序排列
      },
      activeDateList: [] // 有日程的日期
    }
  },
  computed: {
    headerTime () {
      return dayjs(this.selectedDate).format('YYYY年MM月')
    }
  },
  watch: {
    selectedDate: {
      handler (newValue, oldValue) {
        this.$emit('dateChange', newValue)
      },
      deep: true
    },
    activeDate: {
      handler (newValue, oldValue) {
        if (
          dayjs(newValue).format('YYYY-MM-DD') !==
          dayjs(this.selectedDate).format('YYYY-MM-DD')
        ) {
          const selectDate = dayjs(this.selectedDate || new Date())
          this.selectedDate = newValue
          if (
            selectDate.format('YYYY-MM') !== dayjs(newValue).format('YYYY-MM')
          ) {
            // 月份、年份变更，重新获取日历
            this.getMonthDays()
          } else {
            // 在周模式的情况下，不同星期，重新获取日历
            const date1 = dayjs(newValue).day(1).format('YYYY-MM-DD')
            const date2 = selectDate.day(1).format('YYYY-MM-DD')
            if (this.type === 'week' && date1 !== date2) {
              this.getMonthDays()
            }
          }
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    this.getMonthDays()
  },
  mounted () {
    this.calendarInitHeight = document.querySelector(
      '.content-days'
    ).offsetHeight
    this.minHeight = document.querySelector('.main-block').offsetHeight
    this.maxHeight = document.querySelector('.content-days').offsetHeight
  },
  methods: {
    // 获取当前日历表中的日程数据
    getDateEvents (startDate, endDate) {
      const { params } = this
      // const _date = dayjs(this.selectedDate)
      // params.dateFrom = _date
      //   .month(_date.month() - 1)
      //   .date(21)
      //   .format('YYYY-MM-DD')
      // params.dateTo = _date
      //   .month(_date.month() + 1)
      //   .date(7)
      //   .format('YYYY-MM-DD')
      const _dateFrom = dayjs(this.totalCalendarList[0]._date).format('YYYY-MM-DD') || startDate
      const _dateTo = dayjs(this.totalCalendarList[this.totalCalendarList.length - 1]._date).format('YYYY-MM-DD') || endDate
      this.$emit('startDateChange', _dateFrom)
      this.$emit('endDateChange', _dateTo)
      params.dateFrom = _dateFrom
      params.dateTo = _dateTo
      const activeDateList = []
      this.$store.commit('clearCache', 'events')
      this.$api(
        'schedule.getDateEvents',
        Object.assign(params, this.filters)
      ).then((res) => {
        // this.$parent.$refs.calendar['next']()
        for (let i = 0; i < res.data.length; i++) {
          const item = {
            eventDate: res.data[i].eventDate,
            shared: false, // 存在共享日程
            self: false // 自己的日程
          }
          for (let j = 0; j < res.data[i].events.length; j++) {
            const t = res.data[i].events[j]
            const userId = this.userInfo.userId
            if (t.ownerId === userId) {
              item.self = true
            } else {
              item.shared = true
            }
            activeDateList.push(item)
            if (item.self && item.shared) {
              break
            }
          }
        }
        this.activeDateList = activeDateList
        this.$store.commit('setCache', {
          key: 'events',
          data: res.data
        })
      })
    },
    // 外部更改当前选择时间
    setSelectedDate (date) {
      this.selectedDate = date
      this.getMonthDays()
    },
    /**
     * 拖拽结束，状态判断
     */
    panEnd (event) {
      const { calendarInitHeight, minHeight, maxHeight } = this
      if (event.deltaY > 0 && calendarInitHeight === minHeight) {
        // 向下拖拽
        this.type = 'month'
      } else if (event.deltaY < 0 && calendarInitHeight === maxHeight) {
        // 向上拖拽
        this.type = 'week'
      }
      this.computedMaxHeight()
    },
    /**
     * 点击日历收起展开
     */
    panEnd2 (type) {
      this.domChanged()
      this.type = type
      this.computedMaxHeight()
    },
    /**
     * 拖拽过程日历变动
     */
    panMove (event) {
      this.domChanged()
      const {
        maxHeight,
        minHeight,
        calendarInitHeight,
        calendarContentStyle
      } = this
      // 计算被选择的日期可向上移动的距离
      const selectedTop =
        document.querySelector('.selected_date').offsetTop -
        document.querySelector('.content-days').offsetTop +
        document.querySelector('.header-days').offsetHeight
      // 计算被选择的日期可向下移动的距离
      const selectedBottom = this.newMargin
      let newMargin = event.deltaY + selectedBottom
      if (newMargin > 0) {
        newMargin = 0
      } else if (newMargin < 0 - selectedTop) {
        newMargin = 0 - selectedTop
      }

      let newHeight = calendarInitHeight + event.deltaY
      if (newHeight > maxHeight) {
        // 不允许拖拽超出整个日历表
        newHeight = maxHeight
      }
      if (newHeight < minHeight) {
        // 不允许少于一行高度
        newHeight = minHeight
      }
      calendarContentStyle.transform = `translateY(${newMargin}px)`
      calendarContentStyle.height = newHeight + 'px'
    },
    /**
     * 日期点击时间
     */
    dateTab (item) {
      if (item.class.indexOf('selected_date') < 0) {
        this.selectedDate = item._date
        // 点击上个月或则下个月的日期，需要切换月份
        if (item.type === 'pre' || item.type === 'next') {
          this.getMonthDays()
          // 日历中点击灰色部分切换到上一个月或者下一个月的时候 右侧日历需同步更新
          if (item.type === 'pre' && this.$parent.$refs.calendar) {
            this.$parent.$refs.calendar['prev']()
          } else if (item.type === 'next' && this.$parent.$refs.calendar) {
            this.$parent.$refs.calendar['next']()
          }
        }
      }
    },
    /**
     * 获取选择月份日期
     */
    getMonthDays () {
      const year = this.selectedDate.getFullYear()
      const month = this.selectedDate.getMonth()
      const totalCalendarList = []
      // 计算每月第一天是周几，用作计算应该显示的上月日期
      const preNum = new Date(year, month, 1).getDay()
      if (preNum > 0) {
        // 计算上个月的日期
        for (let i = 0; i < preNum; i++) {
          const preMonthDate = new Date(year, month, 1)
          preMonthDate.setDate(preMonthDate.getDate() - preNum + i)
          const obj = {
            type: 'pre',
            content: preMonthDate.getDate(),
            bottomText: this.getNLDateStr(preMonthDate),
            class: 'pre-month',
            _date: preMonthDate
          }
          totalCalendarList.push(obj)
        }
      }
      // 计算当月日期
      for (let i = 0; i < this.getMonthMaxDays(year, month); i++) {
        const _date = new Date(year, month, i + 1)
        const NLStr = this.getNLDateStr(_date)
        let contentStr = i + 1
        let classStr = ''
        const nowDate = new Date()
        if (
          dayjs(_date).format('YYYY-MM-DD') ===
          dayjs(nowDate).format('YYYY-MM-DD')
        ) {
          // 判断“今天”
          contentStr = '今'
          classStr += ' today'
        }
        const obj = {
          type: 'normal',
          content: contentStr,
          class: classStr,
          bottomText: NLStr,
          disabled: false,
          _date
        }
        totalCalendarList.push(obj)
      }

      // 计算下个月的日期
      const nextNum = 6 - new Date(year, month + 1, 0).getDay()
      for (let i = 0; i < nextNum; i++) {
        const nextMonthDate = new Date(year, month + 1, 1)
        nextMonthDate.setDate(i + 1)
        const obj = {
          type: 'next',
          content: nextMonthDate.getDate(),
          class: 'next-month',
          bottomText: this.getNLDateStr(nextMonthDate),
          _date: nextMonthDate
        }
        totalCalendarList.push(obj)
      }

      this.totalCalendarList = totalCalendarList
      // 日历的开始日期
      const startDate = dayjs(this.totalCalendarList[0]._date).format('YYYY-MM-DD')
      // 日历的结束日期
      const endDate = dayjs(this.totalCalendarList[this.totalCalendarList.length - 1]._date).format('YYYY-MM-DD')
      this.$emit('startDateChange', startDate)
      this.$emit('endDateChange', endDate)
      this.getDateEvents(startDate, endDate)
      // console.log(startDate, endDate)
      // 不同月份的星期数可能不同，切换月份需要重新计算高度
      this.$nextTick(() => {
        this.computedMaxHeight()
      })
    },
    /**
     * 获取日期的农历时间
     */
    getNLDateStr (D) {
      const date = calendar.solar2lunar(
        D.getFullYear(),
        D.getMonth() + 1,
        D.getDate()
      )
      return date.IDayCn
    },
    /**
     * 日历左右切换
     * @param direction string 'right'|'left'
     */
    swipe (direction) {
      if (this.indexType === 2) {
        this.$emit('calendarChange', direction)
      }
      this.domChanged()
      let monthChangeNum = 1
      let weekChangeNum = 7
      if (direction === 'right') {
        monthChangeNum = -1
        weekChangeNum = -7
      }
      const _date = new Date(this.selectedDate)
      switch (this.type) {
        // 月份切换，月份变化，日期不变
        case 'month': {
          const date = _date.getDate()
          const maxDays = this.getMonthMaxDays(
            _date.getFullYear(),
            _date.getMonth() + monthChangeNum
          )
          // 切换的月份不存在当前日期则选择切换后的最后一天
          if (date > maxDays) {
            _date.setDate(maxDays)
          }
          _date.setMonth(_date.getMonth() + monthChangeNum)
          this.selectedDate = new Date(_date)
          this.getMonthDays()
          break
        }
        case 'week':
          // 星期切换，星期变化，周几不变
          _date.setDate(_date.getDate() + weekChangeNum)
          // 切换后还在同一个月
          if (this.selectedDate.getMonth() === _date.getMonth()) {
            if (weekChangeNum > 0) {
              // 下个星期
              this.newMargin -= this.minHeight
              this.calendarContentStyle.transform = `translateY(${
                this.newMargin + 2
              }px)`
            } else if (weekChangeNum < 0) {
              // 上个星期
              this.newMargin += this.minHeight
              this.calendarContentStyle.transform = `translateY(${
                this.newMargin + 2
              }px)`
            }
            this.selectedDate = new Date(_date)
          } else {
            // 切换后月份换了
            this.selectedDate = new Date(_date)
            this.getMonthDays()
          }
          break
      }
    },
    /*
     * 获取当月最大天数
     */
    getMonthMaxDays (year, month) {
      const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
      // 闰年二月为29天
      if ((year % 4 === 0 && year % 100 !== 0) || year % 400 === 0) {
        daysInMonth[1] = 29
      }
      return daysInMonth[month]
    },
    /**
     * 计算日历最高高度
     */
    computedMaxHeight () {
      try {
        const dateELs = Array.from(
          document.querySelectorAll('.calendar-main>div')
        )
        const selectedEl = document.querySelector('.selected_date')
          .parentElement
        // 将选择的日期dom高度赋值给日历的最小高度
        this.minHeight = selectedEl.offsetHeight
        // 通过日期dom数计算日历的行数从而计算日历的最大高度
        this.maxHeight = (dateELs.length / 7) * this.minHeight
        // 重新计算日历位置
        if (this.type === 'week') {
          // 通过被选择日期的位置计算应有的margin值
          this.newMargin =
            0 -
            (Math.ceil((dateELs.indexOf(selectedEl) + 1) / 7) - 1) *
              this.minHeight
          // 手机上有bug显示不全当前行，上下个补充2px
          this.calendarContentStyle.transform = `translateY(${
            this.newMargin + 2
          }px)`
          this.calendarContentStyle.height = this.minHeight + 4 + 'px'
          this.calendarInitHeight = this.minHeight
        } else {
          // 当前为月份展示的时候，日历直接最大化，margin也不需要
          this.newMargin = 0
          this.calendarContentStyle.transform = `translateY(0px)`
          this.calendarContentStyle.height = this.maxHeight + 'px'
          this.calendarInitHeight = this.maxHeight
        }
      } catch (e) {
        // console.log(e)
        throw new Error(e)
      }
    },
    // 判断是否显示日历下方日程标示
    showIcon (item, value) {
      const _date = dayjs(item._date).format('YYYY-MM-DD')
      const event = this.activeDateList.find((t) => t.eventDate === _date)
      let res = false
      if (event) {
        res = event[value]
      }
      return res
    },
    // 页面dom发生变化，通知外部
    domChanged () {
      this.$emit('domChanged')
    }
  }
}
</script>

<style lang="scss" scoped>
.calendar-component {
  background: white;
  padding: 12px 8px;
  margin-bottom: 10px;
  border-bottom: 1px solid #eef0f4;
}

.touch-line {
  font-size: 9px;
  text-align: center;
  display: block;
  color: #dbdcdd;
  padding: 10px 0;
}

.calendar {
  width: 100%;
  background-color: white;
  overflow: hidden;
  padding-bottom: 2px;

  .header-days {
    width: 100%;
    box-sizing: content-box;
    display: flex;
    justify-content: space-around;
    position: relative;
    z-index: 1;
    background: white;

    .main-block-head {
      width: 44px;
      height: 44px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 14px;
      color: #2c3135;
      &.active {
        color: #2c3135;
      }
    }
  }

  .calendar-main {
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;

    & > div {
      width: 100vw/7;
      padding-bottom: 5px;
    }

    .main-block {
      width: 32px;
      height: 32px;
      color: #191F24;
      font-weight: 500;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      flex-grow: 0;
      position: relative;
      flex-direction: column;
      font-size: 13px;
      line-height: 10px;
      box-sizing: border-box;
      border: 1px solid transparent;
      cursor: pointer;
      &.pre-month,
      &.next-month,
      &.disabled {
        color: rgba(25, 31, 36, 0.12)
      }
      &.next-month .icon-tag {
        opacity: 0.4;
      }

      .text {
        height: 18px;
        font-size: 10px;
      }
    }

    .selected_date {
      border-color: #1e89ff;
      border-radius: 50%;
    }

    .today {
      background: #1e89ff;
      border-radius: 50%;
      color: white;

      .icon-self {
        background: white;
      }
    }
  }
}

.main-block {
  position: relative;
}

.icon-tag {
  position: absolute;
  bottom: 1px;
  transform: scale(0.5);
  transform-origin: center center;
  & > span {
    margin-left: 8px;

    &:first-of-type {
      margin-left: 0;
    }
  }
}

.icon-shared,
.icon-self {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  transform: scale(2);
  // transform-origin: 0 center;
}

.icon-shared {
  background: #ff8200;
}

.icon-self {
  background: #1e89ff;
}
.calendar-header {
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  span {
    font-size: 16px;
    font-weight: 500;
    color: #191f24;
  }
  i {
    color: #999;
    font-size: 16px;
    border: 1px solid #f4f4f4;
    width: 24px;
    height: 24px;
    cursor: pointer;
    border-radius: 50%;
    text-align: center;
    line-height: 24px;
  }
}
</style>
