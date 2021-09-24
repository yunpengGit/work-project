<!--
* @Descripttion:
* @Author: wanghz
* @Date: 2021-07-20 15:44:00
* @LastEditors: Please set LastEditors
* @LastEditTime:
-->
<template>
  <div>
    <van-form @submit="onSubmit">
      <div class="top">
        <div class="leave-info">
          <!-- 选择申请人 -->
          <van-cell
            title="申请人"
            is-link
            :value="applicantName"
            @click="showApplicantPop = true"
            class="applicant-cell"
          />
          <van-popup
            class="applicant-pop"
            v-model="showApplicantPop"
            position="bottom"
            round
            :style="{ minHeight: '40%', maxHeight: '60%' }"
          >
            <div class="applicant-pop-title">请选择申请人</div>
            <van-picker
              show-toolbar
              toolbar-position="bottom"
              title=" "
              :columns="passAttendeeList"
              @confirm="applicantConfirm"
              @cancel="showApplicantPop = false"
            />
          </van-popup>
          <!-- 选择请假类型 -->
          <van-cell
            title="请假类型"
            is-link
            :value="leaveType"
            @click="showLeaveTypePop = true"
            class="leave-type-cell"
          />
          <van-popup
            class="applicant-pop"
            v-model="showLeaveTypePop"
            position="bottom"
            round
            :style="{ minHeight: '40%', maxHeight: '60%' }"
          >
            <div class="applicant-pop-title">请选择请假类型</div>
            <van-picker
              show-toolbar
              toolbar-position="bottom"
              title=" "
              :columns="leaveTypecolumns"
              @confirm="leaveTypeConfirm"
              @cancel="showLeaveTypePop = false"
            />
          </van-popup>
        </div>
        <h3>请假时间段</h3>
        <div class="leave-time">
          <van-cell
            title="离开时间"
            is-link
            :value="leaveTime"
            @click="showLeaveTimePop = true"
            :style="{ 'border-radius': leaveType === '离会外出' ? '8px 8px 0 0' : '8px' }"
          />

          <van-popup v-model="showLeaveTimePop" round position="bottom" :style="{ minHeight: '40%', maxHeight: '60%' }">
            <van-picker show-toolbar title="请选择离开时间" :columns="columnsLeave" @confirm="leaveTimeConfirm" @cancel="showLeaveTimePop = false"/>
          </van-popup>
          <van-cell
            v-if="leaveType === '离会外出'"
            title="返回时间"
            is-link
            :value="backTime"
            @click="showBackTimePop = true"
            class="back-time-cell"
          />
          <van-popup v-model="showBackTimePop" round position="bottom" :style="{ minHeight: '40%', maxHeight: '60%' }">
            <van-picker show-toolbar title="请选择返回时间" :columns="columnsBack" @confirm="backTimeConfirm" @cancel="showBackTimePop = false"/>
          </van-popup>
        </div>
        <h3>请假事由</h3>
        <van-field
          class="leave-reason"
          v-model="leaveReason"
          rows="4"
          autosize
          type="textarea"
          maxlength="300"
          placeholder="请输入请假事由"
          show-word-limit
        />
      </div>
      <div class="bottom">
        <van-button block type="info" native-type="submit">提交申请</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
export default {
  props: {
    routeParams: {
      type: Object
    }
  },
  data() {
    return {
      /* 申请人/请假类型 */
      applicantName: '请选择',
      applicantId: '',
      showApplicantPop: false,
      leaveType: '请选择',
      leaveId: '',
      showLeaveTypePop: false,
      leaveTypecolumns: [
        { text: '离会外出', id: '3' },
        { text: '提前离会', id: '4' }
      ],
      /* 请假时间段 */
      leaveTime: '请选择',
      backTime: '请选择',
      showLeaveTimePop: false,
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
      showBackTimePop: false,
      columnsBack: [
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
      /* 请假事由 */
      leaveReason: '',
      /* 申请人列表(审核通过状态) */
      passAttendeeList: [],
      /* 会议详情 */
      conferenceDetailData: {}
    }
  },
  created() {
    this.conferenceDetailData = JSON.parse(this.routeParams.conferenceDetailData)
    // 获取申请人列表(审核通过状态)
    this.getApplicantList()
    // 离开时间渲染
    this.getLeaveDate()
    // 返回时间渲染
    this.getBackDate()
  },
  mounted() {},
  methods: {
    // 离开时间渲染
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
      const startTime = this.conferenceDetailData.startTime
      const endTime = this.conferenceDetailData.endTime
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
    // 返回时间渲染
    getBackDate() {
      for (let i = 0; i < 60; i++) {
        let minute = i
        if (i < 10) {
          minute = `0${i}`
        }
        this.columnsBack[2].values.push(`${minute}分`)
      }
      const calendarYear = this.columnsBack[0].values
      const calendarHour = this.columnsBack[1].values
      const calendarMinute = this.columnsBack[2].values
      const startTime = this.conferenceDetailData.startTime
      const endTime = this.conferenceDetailData.endTime
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
        this.columnsBack[0].values.unshift(prevYearMonthDay[i])
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
        this.columnsBack[0].values.push(nowYearMonthDay[i])
      }
      // 根据会议结束向后推两个月
      const NextYearMonthDay = []
      for (let i = 0; i < 61; i++) {
        const now = new Date(endDay)
        const tomorrow = new Date(now.setDate(now.getDate() + i))
        NextYearMonthDay.push(this.formatCode(tomorrow))
      }
      for (let i = 0; i < NextYearMonthDay.length; i++) {
        this.columnsBack[0].values.push(NextYearMonthDay[i])
      }
      const filterStartDate = this.formatCode(new Date(startDay))
      const yearIndex = calendarYear.findIndex(ele => ele === filterStartDate)
      this.columnsBack[0].defaultIndex = yearIndex
      const hourIndex = calendarHour.findIndex(ele => ele === startHour)
      this.columnsBack[1].defaultIndex = hourIndex
      const minuteIndex = calendarMinute.findIndex(ele => ele === startMinute)
      this.columnsBack[2].defaultIndex = minuteIndex
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
    // 提交申请
    onSubmit() {
      if (this.applicantName === '请选择') {
        this.$toast('请选择申请人')
        return false
      }
      if (this.leaveType === '请选择') {
        this.$toast('请选择请假类型')
        return false
      }
      if (this.leaveTime === '请选择') {
        this.$toast('请选择离开时间')
        return false
      }
      if (this.leaveType === '离会外出' && this.backTime === '请选择') {
        this.$toast('请选择返回时间')
        return false
      }
      if (this.leaveReason === '') {
        this.$toast('请输入请假事由')
        return false
      }
      const paramsData = {}
      paramsData.attendeeId = this.applicantId
      paramsData.conferenceId = Number(this.routeParams.conferenceId)
      paramsData.leaveTime = this.leaveTime + ':00'
      if (this.leaveType === '离会外出') {
        paramsData.returnTime = this.backTime + ':00'
      }
      paramsData.reason = this.leaveReason
      paramsData.type = this.leaveId

      this.$api({
        url: 'attendeeApi.submitLeave',
        data: paramsData
      }).then(res => {
        if (res.code === 2000) {
          this.$dialog.alert({
            message: '请假已提交，请等待审核',
            className: 'attendeeDialog'
          }).then(() => {
            this.$router.back()
          })
        }
      })
    },
    // 获取申请人列表(审核通过状态)
    getApplicantList() {
      console.log(this.routeParams, 'this.routeParams')
      const conferenceId = this.routeParams.conferenceId
      this.$api({
        url: 'attendeeApi.getAttendeeList',
        data: {
          conferenceId,
          signStatusEqual: 3,
          signStatusNotIn: '0,1,2,-1,-2,-3',
          attendeeRoleFlagEqual: '0,1,2,3,4',
          roleId: 2
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          const newData = []
          if (data && data.length) {
            data.forEach(item => {
              const obj = {}
              const name = item.fixAttributeCommonVO.attendeeName
              const position = item.fixAttributeCommonVO.position ? '(' + item.fixAttributeCommonVO.position + ')' : ''
              obj.text = name + position
              obj.id = item.id
              newData.push(obj)
            })
            this.passAttendeeList = newData
            if (this.passAttendeeList.length === 1) {
              this.applicantName = this.passAttendeeList[0].text
              this.applicantId = this.passAttendeeList[0].id
            }
          }
        }
      })
    },
    // 选择申请人
    applicantConfirm(value, index) {
      this.applicantName = value.text
      this.applicantId = value.id
      this.showApplicantPop = false
    },
    // 选择申请理由
    leaveTypeConfirm(value) {
      this.leaveType = value.text
      this.leaveId = value.id
      this.showLeaveTypePop = false
    },
    // 选择离开时间
    leaveTimeConfirm(val) {
      this.leaveTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.showLeaveTimePop = false
    },
    // 选择返回时间
    backTimeConfirm(val) {
      this.backTime = this.formatCodeSymbol(val[0], val[1], val[2])
      this.showBackTimePop = false
    }
  }
}
</script>

<style scoped lang="scss">
.van-form {
  .van-cell {
    height: 53px;
    line-height: 33px;
    .van-cell__title {
      font-size: 15px;
      font-family: PingFangSC-Regular, PingFang SC;
      font-weight: 400;
      color: rgba(25, 31, 36, 0.64);
    }
    .van-cell__right-icon {
      line-height: 33px;
    }
  }
}
.top {
  padding: 12px;
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
  .leave-info {
    .applicant-cell {
      border-radius: 8px 8px 0 0;
    }
    .leave-type-cell {
      border-radius: 0 0 8px 8px;
    }
  }
  .leave-time {
    .back-time-cell {
      border-radius: 0 0 8px 8px;
    }
  }
  h3 {
    height: 18px;
    font-size: 13px;
    color: rgba(25, 31, 36, 0.64);
    line-height: 18px;
    font-family: PingFangSC-Regular, PingFang SC;
    font-weight: 400;
    margin: 20px 0 15px 0;
  }
  .leave-reason {
    border-radius: 8px;
    height: 200px;
  }
}
.bottom {
  padding: 10px 16px;
  position: fixed;
  bottom: 0;
  background-color: #fff;
  position: fixed;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  .van-button {
    border-radius: 4px;
    font-size: 18px
  }
}
.van-popup .van-picker-column__wrapper {
  margin-top: -100px !important;
}
</style>
