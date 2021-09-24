
<template>
  <div class="trip-task">

    <!-- Tab栏 -->
    <van-tabs
      v-model="active"
      @change.once="$nextTick(() => initData())">
      <van-tab title="每日任务" />
      <van-tab title="全部任务" />
    </van-tabs>
    <div class="trip-content">
      <!-- 检索栏 -->
      <div
        class="select-calendar">
        <span v-if="active">{{ allDate }}</span>
        <span v-else @click="dateOpt.show = true">
          {{dailyText}}
          <img v-if="tabInfos[0].params.date" src="./icon/xiala.svg" class="icon"/>
        </span>
        <span @click="typeOpt.show = true">
          {{typeOpt.actions[activeTab.params.searchType].name}}
          <img src="./icon/xiala.svg" class="icon"/>
        </span>
      </div>
      <!-- 计数栏 -->
      <div class="num-count">
          <div class="total">
            <span>应{{textConfig.type[type]}}：</span>
            <span>{{activeTab.numCount.shouldBePickedUp}}人</span>
          </div>
          <div class="already">
            <span>已{{textConfig.type[type]}}：</span>
            <span>{{activeTab.numCount.receivedPickedUp}}人</span>
          </div>
          <div class="no">
            <span>未{{textConfig.type[type]}}：</span>
            <span>{{activeTab.numCount.missPickedUp}}人</span>
          </div>
      </div>
      <van-empty
        v-if="!dailyText || !activeTab.list.length"
        :image="dataNull"
        description="暂无接站/送站任务"
      />
      <!-- 任务列表 -->
      <div class="list" v-else>
          <div
            class="item"
            v-for="item in activeTab.list"
            :key="item.id"
            @click="goPage(item)">
            <p>{{ activeTab.params.searchType ? (item.title || item.title) : (item.arriveFlight || '无班次/车次信息')}}</p>
            <div class="item-bottom">
              <span>{{ item.arriveTime ? `预计 ${item.arriveTime} ${textConfig.t1[type]}` : '暂无'}}</span>
              <div>已{{textConfig.type[type]}}人数：<label>{{item.receivedPickedUp}}</label>/{{item.shouldBePickedUp}}人<van-icon name="arrow" /></div>
            </div>
          </div>
      </div>
    </div>
    <div class="btn" v-if="activeTab.list.length">
      <van-button
        type="info"
        block
        @click="goPage()"
        :disabled="!activeTab.numCount.shouldBePickedUp">
        查看 {{activeTab.numCount.shouldBePickedUp}} 位应{{textConfig.type[type]}}人员
      </van-button>
    </div>

    <!-- 日期选择数据 -->
     <SelectDate
      :title="dateOpt.title"
      :show="dateOpt.show"
      :list="dateOpt.list"
      :selected="dateOpt.selected"
      :label="dateOpt.label"
      @onCancel="onDateCancel"
      @onConfirm="onDateConfirm"
    />
    <!-- 检索类型 -->
    <van-action-sheet
      v-model="typeOpt.show"
      :actions="typeOpt.actions"
      cancel-text="取消"
      close-on-click-action
      @select="onTypeChange"
    />

  </div>
</template>

<script>
import dayjs from 'dayjs'
import SelectDate from './components/SelectDate.vue'
import dataNull from '@/assets/images/dataNull.png'

export default {
  components: {
    SelectDate
  },
  data() {
    return {
      dataNull,
      active: 0,
      type: '',
      conferenceId: '',
      activeTab: {},
      tabInfos: [
        {
          list: [],
          params: {
            date: '',
            searchType: 0
          },
          numCount: {
            shouldBePickedUp: 0,
            receivedPickedUp: 0,
            missPickedUp: 0
          }
        },
        {
          list: [],
          params: {
            searchType: 0
          },
          numCount: {
            shouldBePickedUp: 0,
            receivedPickedUp: 0,
            missPickedUp: 0
          }
        }
      ],
      dateOpt: {
        title: '选择日期',
        show: false,
        list: [],
        selected: {},
        label: 'dateStr'
      },
      typeOpt: {
        show: false,
        actions: [
          { name: '按班次/车次查看', value: 0 },
          { name: '按单位/部门查看', value: 1 }
        ]
      },
      textConfig: {
        type: {
          1: '接',
          2: '送'
        },
        t1: {
          1: '到达',
          2: '返程'
        }
      }
    }
  },
  computed: {
    allDate() {
      let str = ''
      const d = this.dateOpt.list
      if (d[0]) {
        str += dayjs(d[0].date).format('YYYY年MM月DD日')
      }
      if (d[1]) {
        str = str + ' 至 ' + dayjs(d[d.length - 1].date).format('YYYY年MM月DD日')
      }
      return str
    },
    dailyText() {
      const d = this.dateOpt.list.find(v => v.date === this.tabInfos[0].params.date)
      return d ? d.dateStr : ''
    }
  },
  watch: {
    active: {
      handler: function(n) {
        this.activeTab = this.tabInfos[n]
      },
      immediate: true
    }
  },
  async mounted() {
    this.type = this.$route.query.type
    document.title = this.type === '1' ? '接站任务' : '送站任务'
    this.conferenceId = this.$route.query.id
    this.getDateList()
  },
  methods: {
    // 页面数据初始化
    initData() {
      this.getNumCount()
      this.getList()
    },
    // 获取日期选择数据
    getDateList() {
      const data = {
        url: 'airportTransfer.getVechicleTaskDate',
        data: { type: this.type, conferenceId: this.conferenceId }
      }
      this.$api(data).then(res => {
        if (res.code === 2000) {
          const d = res.result
          this.dateOpt.list = d
          if (!d.length) return
          const defDate = d.find(v => v.selected)
          this.dateOpt.selected = defDate
          this.tabInfos[0].params.date = defDate.date
          this.initData()
        }
      })
    },

    /**
     * a.当前时间小于第一天，则加载第一天接站信息
     * b.当前时间大于最后一天，则加载最后一天接站信息
     * c.当前时间介于选项之间，加载顺序 今天 》未来》之前
     */
    getDefDate(d) {
      const today = dayjs().format('YYYY-MM-DD')
      if (dayjs(today).isBefore(dayjs(d[0].date))) {
        return d[0]
      }
      if (dayjs(today).isAfter(dayjs(d[d.length - 1].date))) {
        return d[d.length - 1]
      }
      for (let i = d.legth - 1; i >= 0; i--) {
        if (dayjs(d[i].date).isAfter(dayjs(today).subtract(1, 'second'))) {
          return d[i]
        }
      }
    },
    formatDate(v) {
      if (dayjs().isSame(dayjs(v))) {
        return `${v} （今天）`
      } else if (dayjs().add(1, 'day').isSame(dayjs(v))) {
        return `${v} （明天）`
      }
      return v ? dayjs(v).format('YYYY年MM月DD日') : ''
    },
    // 获取计数
    getNumCount() {
      this.$api({
        url: 'airportTransfer.statisticsNum',
        data: { ...this.activeTab.params, type: this.type, conferenceId: this.conferenceId }
      }).then(res => {
        if (res.code === 2000) {
          this.activeTab.numCount = res.result
        }
      })
    },
    // 获取任务列表
    getList() {
      this.$api({
        url: 'airportTransfer.list',
        data: { ...this.activeTab.params, type: this.type, conferenceId: this.conferenceId }
      }).then(res => {
        if (res.code === 2000) {
          this.activeTab.list = res.result
        }
      })
    },
    // 选择时间 --- 取消
    onDateCancel() {
      this.dateOpt.show = false
    },
    // 选择时间 --- 确定
    onDateConfirm(value) {
      this.tabInfos[0].params.date = value.date
      this.dateOpt.show = false
      this.initData()
    },
    // 切换类型
    onTypeChange(item) {
      this.activeTab.params.searchType = item.value
      this.initData()
    },
    /**
     * searchType // 0班次 1单位
     * 按班次/车次查看，则自动带入日期、班次/车次、时间
     * 按单位或部门查看，则自动带入日期、单位或部门
     * 查看全部应接人员，则自动带入日期
     */
    goPage(item) {
      const { searchType, date } = this.activeTab.params
      const query = {
        [this.$enc('date')]: this.$enc(date),
        [this.$enc('type')]: this.$enc(this.type),
        [this.$enc('pickStatus')]: this.$enc(0), // 默认显示未接站的
        [this.$enc('conferenceId')]: this.$enc(this.conferenceId)
      }
      if (item) {
        if (item.arriveFlight) {
          query[this.$enc('arriveFlight')] = this.$enc(searchType ? '' : item.arriveFlight)
        }
        if (item.startTime) {
          query[this.$enc('arriveTime')] = this.$enc(searchType ? '' : item.startTime || '')
        }
        if (item.title === (item.deptShortName || item.deptName)) {
          query[this.$enc('deptName')] = this.$enc(searchType ? (item.deptShortName || item.deptName || '') : '')
        } else if (item.title === (item.organizationSortName || item.organizationName)) {
          query[this.$enc('organizationName')] = this.$enc(searchType ? (item.organizationSortName || item.organizationName || '') : '')
        }
        query[this.$enc('vehicleTaskAttendeeIds')] = this.$enc(item.vehicleTaskAttendeeIds ? item.vehicleTaskAttendeeIds.join() : '')
      }

      this.$router.push({
        name: 'airportTransferPersonInfo',
        query
      })
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/mixin.scss';
.trip-task {
  min-height: 100%;
  background-color: #f8f8f8;
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
    }
  }

  .list {
    height: calc(100vh - 160px);
    overflow: auto;
    padding: 0 12px 50px 12px;
    .item {
      background: #FFFFFF;
      box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.08);
      border-radius: 12px;
      margin-top: 12px;
      padding: 16px;
      p {
        font-size: 17px;
        font-weight: 500;
        color: #191F24;
        line-height: 22px;
        margin-bottom: 16px;
      }
      .item-bottom {
        font-size: 15px;
        font-weight: 400;
        color: #6D7174;
        line-height: 20px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        label {
          font-weight: 500;
          color: #1E89FF;
          margin-right: 3px;
        }
        i {
          font-size: 16px;
          color: #A8B0B9;
          margin-left: 4px;
        }
        div {
          display: flex;
          align-items: center;
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
<style lang="scss" scoped>
.trip-task::v-deep {
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
