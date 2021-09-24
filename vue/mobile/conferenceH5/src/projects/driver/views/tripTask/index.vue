<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-07-06 11:28:08
 * @LastEditors: peng
 * @LastEditTime: 2021-07-09 15:51:27
-->
<template>
  <div class="trip-task">
    <van-tabs v-model="active">
      <van-tab title="每日任务">
        <div class="select-calendar">
          <span @click="selectCalendar">{{ date }}<img src="./../../icon/xiala.svg" class="icon" /></span>
          <span @click="fliterShow">
            <img src="./../../icon/shaixuan.svg" class="icon" />
            筛选
          </span>
        </div>
        <div class="list">
          <List :taskList="taskList" :params="dailyTaskParams" />
        </div>
      </van-tab>
      <van-tab title="全部任务">
        <div class="select-calendar">
          <span>{{ allDate }}</span>
          <span @click="fliterShow">
            <img src="./../../icon/shaixuan.svg" class="icon" />
            筛选
          </span>
        </div>
        <div class="list">
          <List :taskList="taskList" :params="allTaskParams" />
        </div>
      </van-tab>
    </van-tabs>
    <SelectDate
      :title="selectDateData.title"
      :show="selectDateData.show"
      :list="selectDateData.list"
      :selected="selectDateData.selected"
      @onCancel="onSelectDateCancel"
      @onConfirm="onSelectDateConfirm"
    />
    <Fliter :show="fliterData.show" :isAll="fliterData.isAll" @onConfirm="onFliterConfirm" @onCancel="onFliterCancel" />
    <div class="btn">
      <van-button type="info" block @click="$router.push('/taskHistory')">查看历史任务</van-button>
    </div>
  </div>
</template>

<script>
import List from './../../components/List.vue'
import SelectDate from './../../components/SelectDate.vue'
import Fliter from './../../components/Fliter.vue'
export default {
  name: 'Index',
  props: {
    routeParams: {
      type: Object
    }
  },
  components: {
    List,
    SelectDate,
    Fliter
  },
  data() {
    return {
      conferenceId: '',
      driverId: '',
      active: 0,
      show: false,
      type: 'single',
      taskList: [],
      date: '',
      allDate: '',
      pageNum: 1,
      pageSize: 10,
      defaultParams: {
        type: 12,
        statusList: '0,1',
        conferenceId: this.conferenceId,
        driverId: this.driverId
      },
      dailyTaskParams: {
        ...this.defaultParams
      },
      allTaskParams: {
        ...this.defaultParams
      },
      selectDateData: {
        title: '选择出车日期',
        show: false,
        list: [],
        selected: {}
      },
      fliterData: {
        show: false,
        isAll: false
      }
    }
  },
  watch: {
    selectDateData: {
      deep: true,
      handler(n) {
        console.log(n)
        let str = ''
        const list = this.selectDateData.list
        if (list) {
          this.selectDateData.selected = list[0]
          str = list[0].dateShow
          this.date = str
          const listLen = list.length
          str = list[0].dateShow
          if (listLen > 1) {
            str += ` 至 ${list[listLen - 1].dateShow}`
          }
        }
        this.allDate = str
      }
    }
  },
  created() {
    const { conferenceId, driverId } = this.routeParams
    this.conferenceId = conferenceId
    this.driverId = driverId
    this.initSelectDate()
  },
  methods: {
    // init(params) {
    //   const defaultParams = {
    //     type: 12,
    //     statusList: '0,1'
    //   }
    //   params = {
    //     ...params,
    //     conferenceId: this.conferenceId,
    //     driverId: this.driverId,
    //     ...defaultParams
    //   }
    //   const data = {
    //     url: 'driver.list',
    //     data: params
    //   }
    //   this.$api(data).then(res => {
    //     if (res.code === 2000) {
    //       this.taskList = res.result.list
    //     }
    //   })
    // },
    // 初始化日期选择数据
    initSelectDate(params) {
      const defaultParams = {
        statusList: '0,1'
      }
      params = {
        ...params,
        conferenceId: this.conferenceId,
        driverId: this.driverId,
        ...defaultParams
      }
      const data = {
        url: 'driver.getVechicleTaskDate',
        data: params
      }
      this.$api(data).then(res => {
        if (res.code === 2000) {
          this.selectDateData.list = res.result.list
        }
      })
    },
    selectCalendar() {
      this.selectDateData.show = true
    },
    onSelectDateCancel() {
      this.selectDateData.show = false
    },
    onSelectDateConfirm(value) {
      this.date = value.dateShow
      this.selectDateData.show = false
      // console.log(value.Date)
      const params = {
        startTime: value.date + ' 00:00:00',
        endTime: value.date + ' 23:59:59'
      }
      this.dailyTaskParams = { ...this.dailyTaskParams, ...params }
    },
    fliterShow() {
      if (this.active === 1) {
        this.fliterData.isAll = true
      } else {
        this.fliterData.isAll = false
      }
      this.fliterData.show = true
    },
    onFliterCancel() {
      this.fliterData.show = false
    },
    onFliterConfirm(params) {
      this.fliterData.show = false
      this.dailyTaskParams = { ...this.dailyTaskParams, ...params }
    },
    formatDate(date) {
      const now = new Date()
      const today = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`
      const selectDay = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
      // console.log(today, selectDay)
      // console.log(today === selectDay)
      let str = `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`
      if (today === selectDay) {
        str += '（今天）'
      }
      // console.log(str)
      return str
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../style/mixin.scss';
.trip-task {
  background-color: #f6f6f6;
  ::v-deep {
    .van-tabs {
      .van-tab {
        line-height: 48px;
        font-size: 15px;
        color: #191f24;
        position: relative;
        &:nth-child(n + 2) {
          &::after {
            position: absolute;
            box-sizing: border-box;
            content: ' ';
            pointer-events: none;
            top: 10px;
            bottom: 10px;
            left: 0;
            transform: scaleX(0.5);
            border-left: 1px solid rgba($color: #191f24, $alpha: 0.08);
          }
        }
      }
      .van-tab--active {
        font-weight: 500;
        color: #1e89ff;
      }
      .van-tabs__line {
        bottom: 20px;
        background: linear-gradient(270deg, #40beff 0%, #1e89ff 100%);
      }
      .list {
        height: calc(100vh - 152px);
        overflow: auto;
      }
    }
  }
  .btn {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    height: 64px;
    background: #ffffff;
    box-shadow: 0px -2px 8px 0px rgba(25, 31, 36, 0.08);
    padding: 10px 16px;
    .van-button {
      border-radius: 8px;
      &.van-button--normal {
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>
