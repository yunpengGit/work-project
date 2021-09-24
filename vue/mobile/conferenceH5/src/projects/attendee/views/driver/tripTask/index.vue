<!--
 * @Descripttion:
 * @Author: pengpeng
 * @Date: 2021-07-06 11:28:08
 * @LastEditors: peng
 * @LastEditTime: 2021-07-12 10:04:46
-->
<template>
  <div class="trip-task">
    <van-tabs v-model="active" color="#2063F8" @change="changeDayType">
      <van-tab title="每日任务">
        <div class="select-calendar">
          <span
@click="selectDateData.show = true"
            >{{ todayDate
            }}<span
              style="margin-left: 5px"
              v-if="todayOrtomo(todayDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, ''))"
              >({{ todayOrtomo(todayDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')) }})</span
            >
            <img
src="@/assets/images/arrowDown.svg"
class="icon"
          /></span>
          <span @click="fliterShow">
            <img src="@/assets/images/filter.svg" class="icon" />
            筛选
          </span>
        </div>
      </van-tab>
      <van-tab title="全部任务">
        <div class="select-calendar">
          <span>{{ allDate }}</span>
          <span @click="fliterShow">
            <img src="@/assets/images/filter.svg" class="icon" />
            筛选
          </span>
        </div>
      </van-tab>
    </van-tabs>
    <list
      class="task-content"
      :params="params"
      @onRefresh="onRefresh"
      @onLoad="onLoad"
      :clear="clear"
      @resetClear="resetClear"
    >
      <template v-slot:item="data">
        <div
          class="task-content-item"
          v-for="(ele, index) in data.data"
          :key="index"
          @click="linkDriverTaskDetail(ele)"
        >
          <div class="item-title">
            <div>
              <span v-if="todayOrtomo(ele.startTime)" style="margin-right: 5px">{{ todayOrtomo(ele.startTime) }}</span
              >{{ formatCode(ele.startTime) }}
            </div>
            <div>{{ ele.typeStr }} {{ ele.attendeeCount }}人</div>
          </div>
          <div class="content">
            <div class="info-item">
              <div class="label">送往</div>
              <div class="value">
                <span>{{ ele.endAddress }}</span>
              </div>
            </div>
            <div class="info-item">
              <div class="label">上车地点</div>
              <div class="value">
                <span
                  >{{ ele.startAddress
                  }}<span v-if="ele.getOnVehicleAddress.length">({{ ele.getOnVehicleAddress }})</span></span
                >
                <img src="../../conferenceHomePage/img/arrows.svg" alt="" />
              </div>
            </div>
          </div>
        </div>
      </template>
    </list>
    <SelectDate
      :title="selectDateData.title"
      :show="selectDateData.show"
      :list="selectDateData.list"
      :selected="selectDateData.selected"
      @onCancel="selectDateData.show = false"
      @onConfirm="onSelectDateConfirm"
    />
    <Fliter
      :date="todayDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')"
      :show="fliterData.show"
      :isAll="fliterData.isAll"
      @onConfirm="onFliterConfirm"
      @onCancel="onFliterCancel"
    />
    <div class="btn">
      <van-button type="info" block @click="linkTaskHistory">查看历史任务</van-button>
    </div>
  </div>
</template>

<script>
import list from '@/components/list.vue'
import SelectDate from './../components/SelectDate.vue'
import Fliter from './../components/Fliter.vue'
export default {
  name: 'Index',
  props: {
    routeParams: {
      type: Object
    }
  },
  components: {
    list,
    SelectDate,
    Fliter
  },
  data() {
    return {
      conferenceId: '',
      driverId: '',
      // 每日任务/全部任务tab
      active: 0,
      // 每日任务展示日期
      todayDate: '',
      // 全部任务展示日期
      allDate: '',
      // 默认参数
      params: {
        httpUrl: 'driver.list',
        type: 'up',
        httpParams: {
          conferenceId: '',
          driverId: '',
          statusList: '0,1', // 状态id集合
          pageNum: 1,
          pageSize: 10
        }
      },
      // 是否清空子组件数据
      clear: false,
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
  mounted() {
    this.conferenceId = this.routeParams.conferenceId
    this.driverId = this.routeParams.driverId

    // 初始化日期选择数据
    this.initSelectDate()
  },
  methods: {
    // 将 2020-01-02 00:00:00 处理为 2020年01月01日 00:00
    formatCode(start) {
      const startStr = start.replace('-', '年').replace('-', '月')
      const startNewStr = startStr.slice(0, 10) + '日 ' + startStr.slice(11, 16)
      return startNewStr
    },
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
          const data = res.result.list
          this.selectDateData.list = data
          if (data) {
            /* 格式化每日时间 */
            const newList = []
            data.forEach(item => {
              if (item.fromToday <= 0) {
                newList.push(item)
              }
            })
            if (newList.length) {
              this.selectDateData.selected = newList[0]
              this.todayDate = newList[0].dateShow
              // 获取初始化每日任务
              this.onSelectDateConfirm(this.selectDateData.selected)
            }

            /* 格式化全部时间 */
            const listLen = data.length
            let str = data[0].dateShow
            if (listLen > 1) {
              str += ` 至 ${data[listLen - 1].dateShow}`
            }
            this.allDate = str
          }
        }
      })
    },
    // 切换顶部每日任务/全部任务tab
    changeDayType() {
      if (this.active) {
        // 全部任务
        const list = this.selectDateData.list
        this.clear = true
        this.params.httpParams.conferenceId = this.conferenceId
        this.params.httpParams.driverId = this.driverId
        this.params.httpParams.statusList = '0,1'
        this.params.httpParams.startTime = list[0].date + ' 00:00:00'
        this.params.httpParams.endTime = list[list.length - 1].date + ' 23:59:59'
      } else {
        // 每日任务
        const selected = this.todayDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
        this.clear = true
        this.params.httpParams.startTime = selected + ' 00:00:00'
        this.params.httpParams.endTime = selected + ' 23:59:59'
      }
      this.params.httpParams.pageNum = 1
      this.params.httpParams.endAddressLike = ''
      this.params.httpParams.startAddressLike = ''
    },
    // 每日任务确定选择时间
    onSelectDateConfirm(value) {
      const paramsStart = this.params.httpParams.startTime
      const paramsEnd = this.params.httpParams.endTime
      this.todayDate = value.dateShow
      this.selectDateData.show = false
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.conferenceId,
        driverId: this.driverId,
        statusList: '0,1',
        pageNum: 1,
        pageSize: 10,
        startTime: value.date + (paramsStart ? paramsStart.slice(10, paramsStart.length) : ' 00:00:00'),
        endTime: value.date + (paramsEnd ? paramsEnd.slice(10, paramsEnd.length) : ' 23:59:59'),
        endAddressLike: this.params.httpParams.endAddressLike,
        startAddressLike: this.params.httpParams.startAddressLike
      }
    },
    // 显示筛选弹窗
    fliterShow() {
      if (this.active === 1) {
        this.fliterData.isAll = true
      } else {
        this.fliterData.isAll = false
      }
      this.fliterData.show = true
    },
    // 取消筛选
    onFliterCancel() {
      this.fliterData.show = false
    },
    // 确认筛选
    onFliterConfirm(params) {
      this.fliterData.show = false
      this.clear = true
      this.params.httpParams = {
        conferenceId: this.conferenceId,
        driverId: this.driverId,
        statusList: '0,1',
        pageNum: 1,
        pageSize: 10,
        startAddressLike: params.startAddressLike,
        endAddressLike: params.endAddressLike,
        startTime: params.startTime,
        endTime: params.endTime
      }
      if (!this.active && !params.startTime.length) {
        // 每日任务
        const selected = this.todayDate.replace(/年/g, '-').replace(/月/g, '-').replace(/日/g, '')
        this.params.httpParams.startTime = selected + ' 00:00:00'
        this.params.httpParams.endTime = selected + ' 23:59:59'
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
    // 跳转到历史记录
    linkTaskHistory() {
      this.$router.push({
        name: 'driverTaskHistory',
        query: {
          [this.$enc('conferenceId')]: this.$enc(this.conferenceId),
          [this.$enc('driverId')]: this.$enc(this.driverId)
        }
      })
    },
    // 我的出车任务-详情 跳转
    linkDriverTaskDetail(ele) {
      const conferenceId = this.conferenceId
      this.$router.push({
        name: 'driverTaskDetail',
        query: {
          [this.$enc('conferenceId')]: this.$enc(conferenceId),
          [this.$enc('id')]: this.$enc(ele.id)
        }
      })
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

<style lang="scss" scoped>
@import './../style/mixin.scss';

.trip-task {
  background: #f2f5fc;
  ::v-deep .list-container {
    height: calc(100% - 160px);
    top: 96px;
    background: #f2f5fc;
    padding: 0;
    .van-pull-refresh {
      padding-top: 0;
    }
  }
  ::v-deep {
    .van-tabs__wrap {
      height: 48px;
      padding-bottom: 7px;
    }
    .van-tabs {
      .van-tab {
        font-size: 18px;
        color: #191f24;
        position: relative;
      }
      .van-tab--active {
        font-weight: 500;
        color: #2063f8;
      }
      .van-tabs__line {
        width: 30px;
      }
      .list {
        height: calc(100vh - 152px);
        overflow: auto;
      }
    }
  }
  .select-calendar {
    padding: 0 16px;
    height: 48px;
    background-color: rgba(255, 255, 255, 0);
    font-size: 13px;
  }
  .task-content {
    .task-content-item {
      background: linear-gradient(180deg, #fdfdfe 0%, #ffffff 100%);
      box-shadow: 0px 0px 4px 0px rgba(0, 0, 0, 0.12);
      border-radius: 4px;
      margin: 0 16px 12px 16px;
      .item-title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        height: 52px;
        font-size: 16px;
        font-weight: 500;
        color: #102c70;
        line-height: 22px;
        padding: 0 14px;
      }
      .content {
        .info-item {
          font-size: 14px;
          display: flex;
          padding: 16px 10px 16px 14px;
          border-top: 1px solid #f1f1f2;
          .label {
            width: 80px;
            color: rgba(25, 31, 36, 0.64);
            margin-right: 20px;
          }
          .value {
            flex: 1;
            display: flex;
            justify-content: space-between;
            color: #191f24;
            span {
              line-height: 20px;
            }
          }
        }
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
      border-radius: 4px;
      &.van-button--normal {
        font-size: 18px;
        font-weight: 500;
        color: #ffffff;
      }
    }
  }
}
</style>
