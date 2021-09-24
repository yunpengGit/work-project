<template>
  <div>
    <van-nav-bar left-arrow title="查询行程" @click-left="back" />
    <div class="header">
      <p class="title">起飞日期</p>
      <div flex="main:around cross:center">
        <div class="pointer" @click="showStartDatePicker=true">
          <p class="date">{{startPreDateString.substring(5,10)}}</p>
          <p class="year">{{startPreDateString.substring(0,4)}}</p>
        </div>
        <svg-icon class="icon-date" href="iconrili" />
        <div class="pointer" @click="showEndDatePicker=true">
          <p class="date">{{endPreDateString.substring(5,10)}}</p>
          <p class="year">{{endPreDateString.substring(0,4)}}</p>
        </div>
      </div>
    </div>
    <van-cell-group>
      <van-field v-model="params.passengerName" label="乘机人" placeholder="请输入乘机人" />
      <van-field v-model="params.flightno" label="航班号" placeholder="请输入航班号" />
      <van-field v-model="params.ticketNo" label="票号" placeholder="请输入票号" />
      <div class="cell-item" flex="cross:center">
        <span class="label">行程状态</span>
        <van-tabs v-model="params.ticketstate" type="card" color="#007EC8" flex-item="1">
          <van-tab :name="-1" title="全部" />
          <van-tab :name="1" title="正票" />
          <van-tab :name="2" title="改签" />
          <van-tab :name="3" title="退票" />
        </van-tabs>
      </div>
      <div class="cell-item" flex="cross:center">
        <span class="label">确认状态</span>
        <van-tabs v-model="params.user_confirm_state" type="card" color="#007EC8" flex-item="1">
          <van-tab :name="-1" title="全部" />
          <van-tab :name="0" title="未确认" />
          <van-tab :name="1" title="已确认" />
        </van-tabs>
      </div>
      <div class="cell-item" flex="cross:center">
        <span class="label">报销状态</span>
        <van-tabs v-model="params.journey_expense_state" type="card" color="#007EC8" flex-item="1">
          <van-tab :name="-1" title="全部" />
          <van-tab :name="0" title="未报销" />
          <van-tab :name="1" title="已报销" />
        </van-tabs>
      </div>
      <div class="cell-item" flex="cross:center">
        <span class="label">下载状态</span>
        <van-tabs v-model="params.customer_is_download" type="card" color="#007EC8" flex-item="1">
          <van-tab :name="-1" title="全部" />
          <van-tab :name="0" title="未下载" />
          <van-tab :name="1" title="已下载" />
        </van-tabs>
      </div>
    </van-cell-group>
    <van-popup
      :value="true"
      position="bottom"
      :overlay="false"
      class="btn-group"
      flex="main:around"
    >
      <van-button size="small" round plain type="info" @click="params = {...params_copy}">重置</van-button>
      <van-button size="small" round type="info" @click="submit">查询</van-button>
    </van-popup>
    <van-popup v-model="showStartDatePicker" position="bottom" class="popup">
      <van-datetime-picker
        v-model="params.startPreDate"
        type="date"
        @confirm="showStartDatePicker=false"
        @cancel="showStartDatePicker=false"
      />
    </van-popup>
    <van-popup v-model="showEndDatePicker" position="bottom" class="popup">
      <van-datetime-picker
        v-model="params.endPreDate"
        type="date"
        @confirm="showEndDatePicker=false"
        @cancel="showEndDatePicker=false"
      />
    </van-popup>
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, DatetimePicker, Popup, CellGroup, Field, Picker, Tabs, Tab, Button, Toast } from 'vant'

Vue.use(NavBar).use(DatetimePicker).use(Popup).use(CellGroup).use(Field).use(Picker).use(Tabs).use(Tab).use(Button)
export default {
  data () {
    return {
      showStartDatePicker: false,
      showEndDatePicker: false,
      params_copy: null,
      params: {
        startPreDate: new Date(),
        endPreDate: new Date(),
        passengerName: '',
        flightno: '',
        ticketNo: '',
        ticketstate: -1,
        user_confirm_state: -1,
        journey_expense_state: -1,
        customer_is_download: -1
      }
    }
  },
  created () {
    let now = new Date()
    this.params.startPreDate = new Date(now.setMonth(now.getMonth() - 1))
    this.params_copy = { ...this.params }
    let dataParams = {}
    if (this.$store.state.journeyList.listParams.startPreDate) {
      const { startPreDate, endPreDate } = this.$store.state.journeyList.listParams
      dataParams = {
        startPreDate: new Date(startPreDate),
        endPreDate: new Date(endPreDate)
      }
    }
    this.params = {
      ...this.params,
      ...this.$store.state.journeyList.listParams,
      ...dataParams
    }
  },
  computed: {
    endPreDateString () {
      let date = new Date(this.params.endPreDate)
      date.setHours(12)
      return date.toJSON()
    },
    startPreDateString () {
      let date = new Date(this.params.startPreDate)
      date.setHours(12)
      return date.toJSON()
    }
  },
  methods: {
    back () {
      this.$router.back()
    },
    submit () {
      if (this.params.endPreDate < this.params.startPreDate) {
        Toast('开始时间不可以大于结束时间')
        return
      }
      this.$store.dispatch('setListParams', {
        ...this.$store.state.journeyList.listParams,
        ...this.params,
        startPreDate: this.startPreDateString.substring(0, 10),
        endPreDate: this.endPreDateString.substring(0, 10)
      })
      this.$router.back()
    }
  }
}
</script>
<style lang="less" scoped>
.header {
  background: white;
  padding: 7.5px 0 18px;
  text-align: center;
  margin-bottom: 10px;
  p {
    margin: 0;
  }
  .icon-date {
    width: 16px;
    height: 16px;
  }
  .title {
    font-size: 13.5px;
    color: #007ec8;
    margin-bottom: 12px;
  }
}
.date {
  font-size: 21px;
  color: #007ec8;
  margin: 0;
}
.year {
  text-align: center;
  font-size: 12px;
  margin: 0;
  color: #007ec8;
}
.pointer {
  cursor: pointer;
}
.cell-item {
  height: 44px;
  padding: 0 16px;
  .label {
    width: 90px;
    font-size: 14px;
    color: #323233;
  }
}
.btn-group {
  z-index: 1;
  background: transparent;
  padding: 10px 0;
  button {
    width: 120px;
  }
}
</style>

<style scoped>
/deep/ .van-tabs__nav {
  margin: 0;
  border: 0;
  align-items: center;
}
/deep/ .van-tab {
  border: 0;
  border-radius: 15px;
  height: 24px;
  line-height: 24px;
  margin: 0 4px;
}
</style>
