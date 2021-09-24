<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-16 11:57:20
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <van-cell-group>
        <van-field
          readonly
          v-model="attendeeName"
          label="参会人"
          placeholder="请输入姓名"
          input-align="right"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.typeStr"
          label="请假类型"
          placeholder="请选择请假类型"
          input-align="right"
          right-icon="arrow"
          @click="sheetChoice"
        />
      </van-cell-group>
    </van-form>
    <van-form v-if="leaveIndex === '3'">
      <h3>请假时间段</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="params.leaveTime"
          label="离会开始时间"
          placeholder="请选择开始时间"
          input-align="right"
          right-icon="arrow"
          @click="startTimeChoice"
        />
        <van-field
          v-if="dateEndChoiceShow"
          readonly
          required
          v-model="params.returnTime"
          label="离会结束时间"
          placeholder="请选择结束时间"
          input-align="right"
          right-icon="arrow"
          @click="endTimeChoice"
        />
      </van-cell-group>
    </van-form>
    <van-form  v-if="leaveIndex === '4'">
      <h3>请假时间段</h3>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="params.leaveTime"
          label="离会时间"
          placeholder="请选择离会时间"
          input-align="right"
          right-icon="arrow"
          @click="leaveTimeChoice"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3>请假事由</h3>
      <textarea v-model="params.reason" placeholder="请填写请假事由"></textarea>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      close-on-click-action
      @select="onSelect"
    />
    <van-popup v-model="dateStartShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择离会开始时间" :columns="columnsStart" @confirm="startChoice" @cancel="dateStartShow = false"/>
    </van-popup>
    <van-popup v-model="dateEndShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择离会结束时间" :columns="columnsEnd" @confirm="endChoice" @cancel="dateEndShow = false"/>
    </van-popup>
    <van-popup v-model="dateShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择离会时间" :columns="columnsLeave" @confirm="leaveChoice" @cancel="dateShow = false"/>
    </van-popup>
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="submit"
      >提交</van-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      default: Object
    }
  },
  data() {
    return {
      dateShow: false,
      dateStartShow: false,
      dateEndShow: false,
      // 选择的开始时间
      choiceStartTime: '',
      // 选择的结束时间
      choiceEndTime: '',
      // 是否显示结束时间的选择
      dateEndChoiceShow: false,
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
      columnsLeave: [
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
      // 参会人姓名
      attendeeName: '',
      // paramsVal做展示用，当选择sheet时候动态改变params的id值，考虑用户网速慢提交不成功时候的再次提交，舍弃delete key方法改为分开赋值
      paramsVal: {
        typeStr: ''
      },
      params: {
        conferenceId: '',
        attendeeId: '',
        // 开始时间
        leaveTime: '',
        // 结束时间
        returnTime: '',
        // 请假类型
        type: '3',
        // 请假理由
        reason: ''
      },
      actionShow: false,
      actions: [],
      // 当前选择的是哪个请假类型
      leaveIndex: '3',
      leaveType: [
        { name: '离会外出', id: '3' },
        { name: '提前离会', id: '4' }
      ],
      // 会议开始时间
      startTime: '',
      // 会议结束时间
      endTime: ''
    }
  },
  created() {
    console.log(this.routeParams)
    const conferenceId = this.routeParams.conferenceId
    const attendeeId = this.routeParams.attendeeId
    const attendeeName = this.routeParams.attendeeName
    this.params.conferenceId = conferenceId
    this.params.attendeeId = attendeeId
    this.attendeeName = attendeeName
    // 获取
    this.$api({
      url: 'desk.getDetail',
      data: {
        id: conferenceId
      }
    }).then(res => {
      if (res.code === 2000) {
        const data = res.result
        this.startTime = data.startTime
        this.endTime = data.endTime
        this.getAgendaDate()
        this.getLeaveDate()
      }
    })
  },
  methods: {
    startTimeChoice() {
      this.dateStartShow = true
    },
    endTimeChoice() {
      this.dateEndShow = true
    },
    leaveTimeChoice() {
      this.dateShow = true
    },
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
      this.params.returnTime = this.choiceEndTime
      // this.filterDate = `${this.choiceStartTime} - ${this.choiceEndTime}`
      // 请求接口
      this.dateEndShow = false
    },
    // 开始日期选择
    startChoice(val) {
      this.dateStartShow = false
      const choiceStartTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.choiceStartTime = choiceStartTime
      if (new Date(this.choiceEndTime).getTime() < new Date(this.choiceStartTime).getTime()) {
        this.$toast({
          message: '结束时间不得大于开始时间',
          duration: 3000
        })
        return
      }
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
      const startTime = this.startTime
      const endTime = this.endTime
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
      // const filterStartDate = this.formatCode(new Date(endDay))
      const filterStartDate = this.formatCode(new Date(this.choiceStartTime))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsEnd[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === endHour)
      this.columnsEnd[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === endMinute)
      this.columnsEnd[2].defaultIndex = minuteIndex
      this.params.leaveTime = this.choiceStartTime
      this.dateEndShow = true
      this.dateEndChoiceShow = true
      // choiceStartTime
    },
    // 离会时间选择
    leaveChoice(val) {
      const choiceEndTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.params.leaveTime = choiceEndTime
      this.dateShow = false
    },
    // 开始日期渲染
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
      const startTime = this.startTime
      const endTime = this.endTime
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
    // 离会日期渲染
    getLeaveDate() {
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this.columnsLeave[2].values.push(`${minute}分`)
      }
      const calendarYear = this.columnsLeave[0].values
      const calendarHour = this.columnsLeave[1].values
      const calendarMinute = this.columnsLeave[2].values
      const startTime = this.startTime
      const endTime = this.endTime
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
        this.columnsLeave[0].values.unshift(prevYearMonthDay[i])
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
        this.columnsLeave[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.columnsLeave[0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(startDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsLeave[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === startHour)
      this.columnsLeave[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === startMinute)
      this.columnsLeave[2].defaultIndex = minuteIndex
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
      const finalStartDate = `${paramsYearMonthDay} ${paramsHour}:${choiceMinute}`
      return finalStartDate
    },
    // 计算两个日期之间相差的天数
    getDaysBetween(startTime, endTime) {
      const startDate = Date.parse(startTime)
      const endDate = Date.parse(endTime)
      const days = (endDate - startDate) / (1 * 24 * 60 * 60 * 1000)
      return days
    },
    submit() {
      // 不需要展示秒，调用接口时需要加上
      if (this.params.leaveTime) {
        this.params.leaveTime = this.params.leaveTime + ':00'
      }
      if (this.params.returnTime) {
        this.params.returnTime = this.params.returnTime + ':00'
      }
      const params = this.params
      console.log(Boolean(params.reason))
      if (!this.paramsVal.typeStr) {
        this.$toast('请选择请假类型')
        return
      } else if (params.type === '3') {
        if (!params.leaveTime) {
          this.$toast('请选择离会开始时间')
          return
        } else if (!params.returnTime) {
          this.$toast('请选择离会结束时间')
          return
        }
      } else if (params.type === '4') {
        if (!params.leaveTime) {
          this.$toast('请选择离会时间')
          return
        }
      }
      if (!params.reason) {
        this.$toast('请填写请假事由')
        return
      }
      this.$api({
        url: 'attendee.addLeave',
        data: params
      }).then(res => {
        if (res.code === 2000) {
          this.$dialog.alert({
            message: '请假已提交，请等待审核'
          }).then(() => {
            this.$router.back(-1)
          })
        }
      })
    },
    // sheet弹窗打开事件
    sheetChoice() {
      this.actions = this.leaveType
      this.actionShow = true
    },
    // sheet弹窗内容选择事件
    onSelect(item) {
      if (item.id !== this.params.type) {
        this.params.leaveTime = ''
        this.params.returnTime = ''
      }
      this.params.type = item.id
      this.paramsVal.typeStr = item.name
      this.leaveIndex = item.id
    }
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/css/core.scss';
.add-driver-container::v-deep {
  padding: 16px 0 64px;
  min-height: 100%;
  background-color: #f8f8f8;
  .van-form {
    padding: 0 12px;
     > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
      font-size: 13px;
      color: rgba(25, 31, 36, 0.64);
      background-color: transparent;
    }
    .van-cell-group {
      border-radius: 8px;
      overflow: hidden;
      background: #fff;
      .van-cell {
        height: 56px;
        line-height: 56px;
        padding-top: 0;
        padding-bottom: 0;
        // border-bottom: 1px solid #f0f0f1;
      }
    }
  }
  .van-cell--required {
    &::before {
      content: '';
    }
    .van-cell__title {
      width: auto;
      flex: none;
      span {
        position: relative;
        white-space: nowrap;
        &:before {
          position: absolute;
          right: -10px;
          color: #ee0a24;
          font-size: 14px;
          content: '*';
        }
      }
    }
  }
  .form-item {
    padding: 0 12px;
    > h3 {
      width: 100%;
      height: 44px;
      line-height: 44px;
      padding: 0 4px;
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
  }
}
</style>
