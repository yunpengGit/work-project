<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-07-06 11:28:08
 * @LastEditors: peng
 * @LastEditTime: 2021-07-09 15:57:13
-->
<template>
  <div class="task-history">
    <div class="select-calendar">
      <span @click="selectCalendar">{{ date }}<img src="./../../icon/xiala.svg" class="icon"/></span>
      <span @click="fliterShow">
        <img src="./../../icon/shaixuan.svg" class="icon" />
        筛选
      </span>
    </div>
    <div class="list">
      <List :params="params"/>
    </div>
    <SelectDate
      :title="selectDateData.title"
      :show="selectDateData.show"
      :list="selectDateData.list"
      :selected="selectDateData.selected"
      @onCancel="onSelectDateCancel"
      @onConfirm="onSelectDateConfirm"
    />
    <Fliter :show="fliterData.show" @onConfirm="onFliterConfirm" @onCancel="onFliterCancel" />
  </div>
</template>

<script>
import List from './../../components/List.vue'
import SelectDate from './../../components/SelectDate.vue'
import Fliter from './../../components/Fliter.vue'
export default {
  name: 'Index',
  components: {
    List,
    SelectDate,
    Fliter
  },
  data() {
    return {
      conferenceId: '',
      driverId: '',
      show: false,
      type: 'single',
      date: '',
      params: {
        type: 12,
        statusList: '2',
        conferenceId: this.conferenceId,
        driverId: this.driverId
      },
      selectDateData: {
        title: '选择出车日期',
        show: false,
        list: [],
        selected: {}
      },
      fliterData: {
        show: false
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
  mounted() {
    this.conferenceId = 1519
    this.driverId = 447
    // this.init()
    this.initSelectDate()
  },
  methods: {
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
      this.fliterData.show = true
    },
    onFliterCancel() {
      this.fliterData.show = false
    },
    onFliterConfirm(params) {
      this.fliterData.show = false
      this.dailyTaskParams = { ...this.dailyTaskParams, ...params }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './../../style/mixin.scss';
.task-history {
  .select-calendar {
    display: flex;
    padding: 0 12px;
    display: flex;
    align-items: center;
    height: 44px;
    background: #ffffff;
    position: relative;
    @include border1px('top');
    .icon {
      margin-left: 4px;
      width: 16px;
      height: 16px;
    }
  }
  .list {
    height: calc(100vh - 44px);
    overflow: auto;
  }
}
</style>
