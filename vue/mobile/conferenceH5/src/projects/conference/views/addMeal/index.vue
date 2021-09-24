<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-07-04 20:09:53
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-08-26 16:15:16
-->
<template>
  <div class="add-driver-container">
    <van-form>
      <van-cell-group>
        <van-field
          readonly
          required
          v-model="paramsVal.date"
          label="用餐日期"
          placeholder="请选择用餐日期"
          input-align="right"
          right-icon="arrow"
          @click="dateShow = true"
        />
        <van-field
          readonly
          required
          v-model="params.typeCode"
          label="用餐类型"
          placeholder="请选择用餐类型"
          input-align="right"
          right-icon="arrow"
          @click="sheetChoice('mealTypeData')"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.diningName"
          label="餐厅名称"
          placeholder="请选择餐厅名称"
          input-align="right"
          right-icon="arrow"
          @click="sheetChoice('restaurantListData')"
        />
        <van-field
          readonly
          v-model="paramsVal.diningAddress"
          label="餐厅位置"
          input-align="right"
        />
        <van-field
          readonly
          v-model="paramsVal.seatNum"
          label="总餐位（人）"
          input-align="right"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.startTimeVal"
          label="用餐开始时间"
          placeholder="请选择用餐开始时间"
          input-align="right"
          right-icon="arrow"
          @click="startTimeShowHandler"
        />
        <van-field
          readonly
          required
          v-model="paramsVal.endTimeVal"
          label="用餐结束时间"
          placeholder="请选择用餐结束时间"
          input-align="right"
          right-icon="arrow"
          @click="endTimeShowHandler"
        />
      </van-cell-group>
    </van-form>
    <div class="form-item">
      <h3>备注</h3>
      <textarea v-model="params.description" placeholder="请填写备注信息"></textarea>
    </div>
    <van-action-sheet
      v-model="actionShow"
      :actions="actions"
      cancel-text="取消"
      @select="onSelect"
    />
    <van-calendar
      v-model="dateShow"
      type="range"
      title="选择用餐时间"
      color="#1989fa"
      :default-date="defaultDate"
      :min-date="prevMonth"
      :max-date="nextMonth"
      @confirm="dateConfirm"
    />
    <van-popup v-model="startTimeShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择开始时间" :columns="startTimeData" @confirm="startChoice" @cancel="startTimeShow = false"/>
    </van-popup>
    <van-popup v-model="endTimeShow" position="bottom" :style="{ width: '100%' }" round>
      <van-picker show-toolbar title="选择结束时间" :columns="endTimeData" @confirm="endChoice"  @cancel="endTimeShow = false"/>
    </van-popup>
    <van-dialog v-model="customDinnerShow" title="自定义用餐" show-cancel-button :beforeClose="beforeClose">
      <van-field required v-model="customDinnerVal" placeholder="请输入用餐类型名称" class="customInput"/>
    </van-dialog>
    <div class="single-btn-bottom">
      <van-button
        type="info"
        @click="submit"
      >保存</van-button>
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
      // 自定义用餐弹窗
      customDinnerShow: false,
      // 自定义用餐
      customDinnerVal: '',
      // 是否第一次添加自定义用餐类型
      customDinnerFlag: false,
      startTimeShow: false,
      endTimeShow: false,
      startTimeData: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: [],
          defaultIndex: 2
        }
      ],
      endTimeData: [
        {
          values: [],
          defaultIndex: 2
        },
        {
          values: [],
          defaultIndex: 2
        }
      ],
      // 用餐日期选择
      dateShow: false,
      // 默认选中的用餐日期
      defaultDate: [],
      paramsVal: {
        // 用餐日期
        date: '',
        // 总餐位
        seatNum: '',
        // 餐厅名称
        diningName: '',
        // 餐厅位置
        diningAddress: '',
        // 用餐开始时间
        startTimeVal: '',
        // 用餐结束时间
        endTimeVal: ''
      },
      params: {
        conferenceId: '',
        // 备注
        description: '',
        // 餐厅id
        diningId: '',
        // 用餐开始日期 格式 2021-02-02
        dinnerStartDate: '',
        // 用餐结束日期 格式 2021-02-02
        dinnerEndDate: '',
        // 用餐开始时间 格式 07:00:00
        startTime: '',
        // 用餐结束时间 格式 07:00:00
        endTime: '',
        // 用餐类型
        typeCode: '',
        // 是否自动发布，true自动发布，false不自动发布
        publish: 0
      },
      // 用餐类型为自定义时需要将 paramsCustom 与 params 合并提交
      paramsCustom: {
        typeCode1: '自定义',
        // 自定义的名称
        typeCode2: '',
        zidingyiFlag: true
      },
      actionShow: false,
      actions: [],
      // 用餐类型
      mealTypeData: [],
      // 餐厅列表
      restaurantListData: [],
      // 当前选择的是用餐类型还是餐厅列表
      type: ''
    }
  },
  computed: {
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
    const conferenceId = this.routeParams.conferenceId
    this.params.conferenceId = conferenceId
    this.getMealType(conferenceId)
    this.getRestaurantList(conferenceId)
    // 初始化时间选择
    this.timeInit()
  },
  methods: {
    beforeClose(action, done) {
      if (action === 'confirm') {
        if (!this.customDinnerVal.trim().length) {
          this.$toast('请输入用餐类型名称')
          done(false)
          return false
        }
        if (this.customDinnerFlag) {
          this.mealTypeData.splice(this.mealTypeData.length - 2, 1, { name: this.customDinnerVal })
        } else {
          this.mealTypeData.splice(this.mealTypeData.length - 1, 0, { name: this.customDinnerVal })
          this.customDinnerFlag = true
        }
        this.params.typeCode = this.customDinnerVal
        this.paramsCustom.typeCode2 = this.customDinnerVal
        this.customDinnerVal = ''
        this.actionShow = false
        done()
      } else {
        done()
      }
    },
    addCustomDinner() {
    },
    startChoice(val) {
      const hours = val[0].slice(0, 2)
      const minutes = val[1].slice(0, 2)
      this.paramsVal.startTimeVal = `${hours}:${minutes}`
      this.params.startTime = `${hours}:${minutes}:00`
      this.startTimeShow = false
    },
    endChoice(val) {
      const hours = val[0].slice(0, 2)
      const minutes = val[1].slice(0, 2)
      this.paramsVal.endTimeVal = `${hours}:${minutes}`
      this.params.endTime = `${hours}:${minutes}:00`
      this.endTimeShow = false
    },
    startTimeShowHandler() {
      this.startTimeShow = true
      if (this.paramsVal.startTimeVal) {
        // 如果之前选择过 优先将选中值渲染为当前选中
        const hours = `${this.paramsVal.startTimeVal.slice(0, 2)}时`
        const minutes = `${this.paramsVal.startTimeVal.slice(-2)}分`
        const startTimeHours = this.startTimeData[0].values
        const startTimeMinutes = this.startTimeData[1].values
        this.startTimeData[0].defaultIndex = startTimeHours.findIndex(ele => ele === hours)
        this.startTimeData[1].defaultIndex = startTimeMinutes.findIndex(ele => ele === minutes)
        return
      }
      const now = new Date()
      const hours = now.getHours() < 10 ? `0${now.getHours()}时` : `${now.getHours()}时`
      const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}分` : `${now.getMinutes()}分`
      const startTimeHours = this.startTimeData[0].values
      const startTimeMinutes = this.startTimeData[1].values
      this.startTimeData[0].defaultIndex = startTimeHours.findIndex(ele => ele === hours)
      this.startTimeData[1].defaultIndex = startTimeMinutes.findIndex(ele => ele === minutes)
    },
    endTimeShowHandler() {
      this.endTimeShow = true
      if (this.paramsVal.endTimeVal) {
        // 如果之前选择过 优先将选中值渲染为当前选中
        const hours = `${this.paramsVal.endTimeVal.slice(0, 2)}时`
        const minutes = `${this.paramsVal.endTimeVal.slice(-2)}分`
        const startTimeHours = this.endTimeData[0].values
        const startTimeMinutes = this.endTimeData[1].values
        this.endTimeData[0].defaultIndex = startTimeHours.findIndex(ele => ele === hours)
        this.endTimeData[1].defaultIndex = startTimeMinutes.findIndex(ele => ele === minutes)
        return
      }
      if (!this.paramsVal.startTimeVal) {
        // 如果之前没有选择过用餐开始时间则 默认打开时间为当前时间
        const now = new Date()
        const hours = now.getHours() < 10 ? `0${now.getHours()}时` : `${now.getHours()}时`
        const minutes = now.getMinutes() < 10 ? `0${now.getMinutes()}分` : `${now.getMinutes()}分`
        const startTimeHours = this.endTimeData[0].values
        const startTimeMinutes = this.endTimeData[1].values
        this.endTimeData[0].defaultIndex = startTimeHours.findIndex(ele => ele === hours)
        this.endTimeData[1].defaultIndex = startTimeMinutes.findIndex(ele => ele === minutes)
      } else {
        // 如果之前选择过用餐时间则 默认打开时间为用餐开始时间往后推一个小时
        let hours = (this.paramsVal.startTimeVal.slice(0, 2)).replace(/\b(0)/gi, '')
        const minutes = `${this.paramsVal.startTimeVal.slice(-2)}分`
        if (hours === '23') {
          hours = '00时'
        } else {
          hours = `${Number(hours) + 1}时`
        }
        const startTimeHours = this.endTimeData[0].values
        const startTimeMinutes = this.endTimeData[1].values
        this.endTimeData[0].defaultIndex = startTimeHours.findIndex(ele => ele === hours)
        this.endTimeData[1].defaultIndex = startTimeMinutes.findIndex(ele => ele === minutes)
      }
    },
    // 用餐开始时间/用餐结束时间 格式化
    timeInit() {
      const hours = []
      const minutes = []
      for (let i = 0; i < 24; i++) {
        let num = i
        if (i < 10) {
          num = `0${i}`
        }
        hours.push(`${num}时`)
      }
      for (let i = 0; i < 60; i++) {
        let num = i
        if (i < 10) {
          num = `0${i}`
        }
        minutes.push(`${num}分`)
      }
      this.startTimeData[0].values = hours
      this.startTimeData[1].values = minutes
      this.endTimeData[0].values = hours
      this.endTimeData[1].values = minutes
    },
    // 用餐日期选择
    dateConfirm(val) {
      const startDate = this.dateCode(val[0])
      const endDate = this.dateCode(val[1])
      this.paramsVal.date = `${startDate} 至 ${endDate}`
      this.params.dinnerStartDate = startDate
      this.params.dinnerEndDate = endDate
      this.dateShow = false
    },
    // 将date转换为 2020-02-02格式
    dateCode(date) {
      const now = new Date(date)
      const year = now.getFullYear()
      const month = (now.getMonth() + 1) < 10 ? `0${now.getMonth() + 1}` : now.getMonth() + 1
      const day = (now.getDate()) < 10 ? `0${now.getDate()}` : now.getDate()
      return `${year}-${month}-${day}`
    },
    // sheet弹窗打开事件
    sheetChoice(type) {
      this.type = type
      this.actions = this[type]
      this.actionShow = true
    },
    // sheet弹窗内容选择事件
    onSelect(item) {
      const type = this.type
      const name = item.name
      this.actionShow = false
      if (type === 'mealTypeData') {
        // 用餐类型
        if (name === '早餐') {
          this.params.typeCode = name
          this.paramsVal.startTimeVal = '07:00'
          this.paramsVal.endTimeVal = '08:00'
          this.params.startTime = '07:00:00'
          this.params.endTime = '08:00:00'
        } else if (name === '午餐') {
          this.params.typeCode = name
          this.paramsVal.startTimeVal = '12:00'
          this.paramsVal.endTimeVal = '13:00'
          this.params.startTime = '12:00:00'
          this.params.endTime = '13:00:00'
        } else if (name === '晚餐') {
          this.params.typeCode = name
          this.paramsVal.startTimeVal = '18:00'
          this.paramsVal.endTimeVal = '19:00'
          this.params.startTime = '18:00:00'
          this.params.endTime = '19:00:00'
        } else if (name === '自定义') {
          this.customDinnerShow = true
          this.actionShow = true
        } else {
          this.params.typeCode = name
        }
      } else if (type === 'restaurantListData') {
        // 餐厅列表
        this.params.diningId = item.id
        this.paramsVal.diningName = name
        this.paramsVal.seatNum = item.seatNum
        this.paramsVal.diningAddress = item.diningAddress
      }
    },
    submit() {
      if (!this.paramsVal.date) {
        this.$toast('请选择用餐日期')
        return
      } else if (!this.params.typeCode) {
        this.$toast('请选择用餐类型')
        return
      } else if (!this.paramsVal.diningName) {
        this.$toast('请选择餐厅名称')
        return
      } else if (!this.paramsVal.startTimeVal) {
        this.$toast('请选择用餐开始时间')
        return
      } else if (!this.paramsVal.endTimeVal) {
        this.$toast('请选择用餐结束时间')
        return
      }
      const typeCode = this.params.typeCode
      const typeCodeId = this.mealTypeData.find(ele => ele.name === typeCode).id
      let params = {}
      if (!typeCodeId) {
        // 如果不存在id说明选择的是自定义的 需要将params和paramsCustom合并
        params = Object.assign({}, this.params, this.paramsCustom)
      } else {
        params = Object.assign({}, this.params)
      }
      this.$dialog.confirm({
        title: '新增用餐任务',
        message: '确认新增？',
        className: 'customDialog'
      }).then(() => {
        this.$api({
          url: 'desk.addMeal',
          data: params
        }).then(res => {
          if (res.code === 2000) {
            this.$toast('添加用餐成功')
            setTimeout(() => {
              this.$router.go(-1)
            }, 300)
          }
        })
      }).catch(() => {})
    },
    // 查询用餐类型
    getMealType(conferenceId) {
      this.$api({
        url: 'desk.getMealType',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result
          data.forEach(ele => {
            ele.name = ele.typeCode
          })
          data.push({ name: '自定义' })
          this.mealTypeData = data
        }
      })
    },
    // 查询餐厅列表
    getRestaurantList(conferenceId) {
      this.$api({
        url: 'desk.getRestaurantList',
        data: {
          conferenceId
        }
      }).then(res => {
        if (res.code === 2000) {
          const data = res.result.list
          data.forEach(ele => {
            ele.name = ele.dinnerRoom
          })
          this.restaurantListData = data
        }
      })
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
  .van-dialog__content {
    .van-cell {
      line-height: 44px;
    }
  }
  .van-dialog__confirm, .van-dialog__confirm:active {
    color: #1e89ff;
  }
}
</style>
