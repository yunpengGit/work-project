
<template>
  <div class="trip-task">

    <!-- 查询栏 -->
    <div class="select-calendar">
      <span v-if="!peopleParams.date">{{ dataStr }}</span>
      <span v-else @click="selectCalendar">{{ dataStr }}<img src="./icon/xiala.svg" class="icon"/></span>
      <span @click="fliterShow">
        <img src="./icon/shaixuan.svg" class="icon" />筛选
      </span>
    </div>

    <!-- 计数栏 -->
    <div class="num-count">
      <div class="total"><span>应{{textConfig.type[type]}}：</span><span>{{numCount.shouldBePickedUp}}人</span></div>
      <div class="already"><span>已{{textConfig.type[type]}}：</span><span>{{numCount.receivedPickedUp}}人</span></div>
      <div class="no"><span>未{{textConfig.type[type]}}：</span><span>{{numCount.missPickedUp}}人</span></div>
    </div>

    <!-- 人员列表 -->
    <div class="list" v-if="peopleList.length">
      <van-pull-refresh v-model="refreshing" @refresh="getList()">
        <van-list
          v-model="loading"
          :finished="finished"
          :immediate-check="false"
          finished-text="没有更多了"
          @load="getList(null)"
        >
          <div
            class="item"
            v-for="(item,index) in peopleList"
            :key="index"
            @click="onClickItem(item)">
            <van-checkbox v-model="item.check" v-if="selecteActive" />
            <div class="top" :style="{'padding-left':selecteActive?'42px':''}">
              <div class="photo-wrap">
                <img :src="item.photoUrl ? item.photoUrl : item.sex === '2' ? femaleSex : male"  />
                <span>{{item.pickStatus ? `已${textConfig.type[type]}站` : `未${textConfig.type[type]}站`}}</span>
              </div>
              <div class="info">
                  <div class="name-wrap">
                    <p>
                        <span class="attendeeName">{{item.attendeeName}}</span>
                        <span v-if="item.position" class="position">{{item.position}}</span>
                    </p>
                    <van-icon v-if="!selecteActive" name="arrow" />
                    <van-checkbox v-else v-model="item.check" />
                  </div>
                  <p class="org-name">{{item.organizationName}}</p>
                  <p class="phone">
                    <span>{{item.close ? '***********' : item.contactPhone}}</span>
                    <van-icon v-if="item.close" name="closed-eye" @click.stop="$set(item,'close', false)"/>
                    <van-icon v-else name="browsing-history-o"  @click.stop="$set(item,'close', true)"/>
                  </p>
              </div>
            </div>
            <div class="bottom" :style="{'padding-left':selecteActive?'42px':''}">
              <span v-for="t in formatText(item)" :key="t">{{t}}</span>
            </div>
          </div>
        </van-list>
      </van-pull-refresh>
    </div>
    <van-empty
      v-if="!peopleList.length"
      :image="dataNull"
      :description="`暂无${nullText}人员信息`"
    />
    <div class="btn">
      <van-button
        v-if="!selecteActive"
        type="info"
        block
        :disabled="!numCount.missPickedUp"
        @click="selecteActive = true">已{{textConfig.t2[type]}}乘客</van-button>

      <template v-else>
        <van-checkbox
        :value="selecteAll"
        @click="onSelectAll">全选</van-checkbox>
        <div class="btn-wrap">
          <van-button
          type="info"
          plain
          @click="onExitHandel">退出选择</van-button>
          <van-button
          type="info"
          :disabled="!selectedNumber"
          @click="onSureHandel">已{{textConfig.t2[type]}} {{selectedNumber}} 乘客</van-button>
        </div>
      </template>

    </div>

    <SelectDate
      :title="selectDateData.title"
      :show="selectDateData.show"
      :list="selectDateData.list"
      :selected="selectDateData.selected"
      :label="selectDateData.label"
      @onCancel="onSelectDateCancel"
      @onConfirm="onSelectDateConfirm"
    />
    <Fliter
      :show="fliterData.show"
      :defParams="fliterData.params"
      @getLabel="getLabel"
      @onConfirm="onFliterConfirm"
      @onCancel="onFliterCancel" />
  </div>
</template>

<script>
import SelectDate from './components/SelectDate.vue'
import Fliter from './components/Fliter.vue'
import dayjs from 'dayjs'
import male from '@/assets/images/male.png'
import femaleSex from '@/assets/images/femaleSex.png'
import dataNull from '@/assets/images/dataNull.png'

export default {
  name: 'Index',
  components: {
    SelectDate,
    Fliter
  },
  data() {
    return {
      nullText: '',
      male, femaleSex, dataNull,
      loading: false,
      finished: false,
      refreshing: false,
      dataStr: '',
      allDateStr: '',
      peopleList: [],
      type: '',
      conferenceId: '',
      peopleParams: {
        date: '',
        pageNum: 1,
        pageSize: 10
      },
      selectDateData: {
        title: '选择日期',
        label: 'dateStr',
        show: false,
        list: [],
        selected: {}
      },
      fliterData: {
        show: false,
        params: {}
      },
      numCount: {
        shouldBePickedUp: '',
        receivedPickedUp: '',
        missPickedUp: ''
      },
      dateList: [
        { startTime: '00:00', endTime: '08:59', dateShow: '9:00 前' },
        { startTime: '09:00', endTime: '11:59', dateShow: '9:00 - 12:00' },
        { startTime: '12:00', endTime: '16:59', dateShow: '12:00 - 17:00' },
        { startTime: '17:00', endTime: '23:59', dateShow: '17:00 后' }
      ],
      selectedNumber: 0,
      selecteActive: false,
      selecteAll: false,
      textConfig: {
        type: {
          1: '接',
          2: '送'
        },
        t1: {
          1: '到达',
          2: '返程'
        },
        t2: {
          1: '接到',
          2: '送出'
        }
      }
    }
  },
  watch: {
    'peopleList': {
      handler(n) {
        if (this.selecteActive) {
          this.selectedNumber = n.filter(d => d.check).length
          this.selecteAll = this.selectedNumber === n.length && n.length
        }
      },
      deep: true
    }
  },
  mounted() {
    this.type = this.$route.query.type // 接机 or 送机
    this.conferenceId = this.$route.query.conferenceId // 1519
    this.formatParams()
    this.getDateList()
    this.initData()
  },
  computed: {},
  methods: {
    getLabel(data) {
      this.nullText = data
    },
    formatParams() {
      const {
        arriveFlight = '',
        deptName = '',
        arriveTime = '',
        organizationName = '',
        date = '',
        platNum = '',
        pickStatus = '',
        vehicleTaskId,
        vehicleTaskAttendeeIds } = this.$route.query
      this.peopleParams.date = date ? dayjs(date).format('YYYY-MM-DD') : date // 查询参数
      const timeOpt = this.formatTime(arriveTime)
      this.fliterData.params = {
        platNum,
        deptName,
        arriveFlight,
        organizationName,
        pickStatus: pickStatus,
        dateShow: timeOpt ? timeOpt.dateShow : '',
        arriveTimeStart: timeOpt ? timeOpt.startTime : '',
        arriveTimeEnd: timeOpt ? timeOpt.endTime : ''
      }
      this.peopleParams = {
        type: this.type,
        conferenceId: this.conferenceId,
        taskIds: vehicleTaskId ? [vehicleTaskId] : [],
        vehicleTaskAttendeeIds: vehicleTaskAttendeeIds ? vehicleTaskAttendeeIds.split(',') : [],
        ...this.peopleParams,
        ...this.fliterData.params
      }
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
          this.selectDateData.list = d // 时间面板数据
          if (this.peopleParams.date) {
            this.selectDateData.selected = d.find(v => v.date === this.peopleParams.date)
          }
          this.allDateStr = !d.length ? '' : (d[0].dateStr + (d.length > 1 ? ` 至 ${d[d.length - 1].dateStr}` : ''))
          this.dataStr = this.peopleParams.date ? this.formatDate(this.peopleParams.date) : this.allDateStr // 页面时间显示
        }
      })
    },
    // 页面数据初始化
    initData() {
      this.getList(true)
      this.getNumCount()
    },
    // 获取对应日期的接送站数据
    getNumCount() {
      const req = JSON.parse(JSON.stringify(this.peopleParams))
      delete req.pickStatus
      this.$api({
        url: 'airportTransfer.statisticsNum',
        data: req
      }).then(res => {
        if (res.code === 2000) {
          this.numCount = res.result
        }
      })
    },
    // 获取人员列表
    getList(isrefresh) {
      if (this.refreshing || isrefresh) {
        this.peopleParams.pageNum = 1
        this.peopleList = []
      }
      if (this.refreshing) {
        this.refreshing = false
      }
      this.$api({
        url: 'airportTransfer.peopleList',
        data: this.peopleParams
      }).then(res => {
        if (res.code === 2000) {
          this.peopleList.push(...res.result.list)
          this.peopleParams.pageNum += 1
          this.finished = this.peopleList.length >= res.result.total // 数据全部加载完成
        }
      })
    },
    formatDate(v) {
      if (dayjs().isSame(dayjs(v))) {
        return `${v} （今天）`
      } else if (dayjs().add(1, 'day').isSame(dayjs(v))) {
        return `${v} （明天）`
      }
      return dayjs(v).format('YYYY年MM月DD日')
    },
    formatTime(time) {
      if (!time) return
      const num = dayjs(time).hour()
      let index = ''
      if (num < 9) {
        index = 0
      } else if (num >= 9 && num < 12) {
        index = 1
      } else if (num >= 12 && num < 17) {
        index = 2
      } else if (index > 17) {
        index = 3
      }
      return this.dateList[index]
    },
    /**
     * 如航班则回显 ”航班号“、火车则回显 ”车次“、其他则回显 ”班次/车次
     * 如无航班号或车次信息，显示为 ”无“
     * 如无航班号或车次信息，且没有达到时间，则显示文案 ”暂无到达时间及班次/车次信息“
     */
    formatText(item) {
      const { arriveFlight, arriveTime } = item
      const time = (arriveTime || '').substr(11, 5)
      if (!arriveFlight && !arriveTime) {
        return ['暂无到达时间及班次/车次信息']
      }
      if (!item.arriveFlight) {
        return ['班次/车次：无', `预计 ${time} ${this.textConfig.t1[this.type]}`]
      }
      return [`班次/车次：${arriveFlight}`, `预计 ${time} ${this.textConfig.t1[this.type]}`]
    },
    onClickItem(item) {
      if (this.selecteActive) {
        item.check = this.$set(item, 'check', !item.check)
      } else {
        localStorage.setItem('airportTransPeopelInfo', JSON.stringify({ ...item, type: this.$route.query.type }))
        this.$router.push({
          name: 'airportTransferTaskDetail',
          query: {
            [this.$enc('type')]: this.$enc(this.type),
            [this.$enc('conferenceId')]: this.$enc(this.conferenceId)
          }
        })
      }
    },
    // 显示时间选择
    selectCalendar() {
      this.selectDateData.show = true
    },
    // 时间选择 -- 取消
    onSelectDateCancel() {
      this.selectDateData.show = false
    },
    // 时间选择 -- 确定
    onSelectDateConfirm({ date }) {
      this.peopleParams.date = date
      this.peopleParams.pageNum = 1
      this.dataStr = this.formatDate(date)
      this.selectDateData.show = false
      this.initData()
    },
    // 显示右侧检索项
    fliterShow() {
      this.fliterData.show = true
    },
    // 右侧检索项 -- 取消
    onFliterCancel() {
      this.fliterData.show = false
    },
    // 右侧检索项 -- 确定
    onFliterConfirm(params) {
      this.fliterData.show = false
      this.peopleParams.pageNum = 1
      this.peopleParams = { ...this.peopleParams, ...params }
      this.initData()
    },
    // 确定接到、送走乘客
    onSureHandel() {
      this.$dialog.confirm({
        title: `${this.textConfig.type[this.type]}站提醒`,
        message: `请确认是否已${this.textConfig.t2[this.type]}乘客`,
        className: 'customDialog'
      }).then(() => {
        const query = []
        this.peopleList.map(d => {
          if (d.check) {
            query.push({
              attendeeId: d.vehicleTaskAttendeeId,
              vehicleTaskId: d.vehicleTaskId
            })
          }
        })
        this.$api({
          url: 'airportTransfer.updateStatus',
          data: query
        }).then(res => {
          this.$toast(res.message)
          if (res.code === 2000) {
            this.initData()
          }
        })
      })
    },
    // 全选
    onSelectAll() {
      this.peopleList.map(d => { this.$set(d, 'check', !this.selecteAll) })
    },
    // 退出选择
    onExitHandel() {
      this.selecteActive = false
      if (this.selectedNumber) {
        this.peopleList.map(d => { this.$set(d, 'check', false) })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@import './style/mixin.scss';
.trip-task::v-deep {
  min-height: 100%;
  background-color: #f8f8f8;
  .list {
    padding: 0;
    height: calc(100vh - 120px);
    overflow: scroll;
    ::v-deep .van-pull-refresh {
      min-height: 100%;
    }
    .item {
      margin-top: 12px;
      background: #FFFFFF;
      position: relative;
      // box-shadow: 0px 3px 20px 0px rgba(0, 0, 0, 0.08);
      // border-radius: 12px;
      .van-checkbox__icon {
        position: absolute;
        left: 16px;
        top: 18px;
      }
      .top {
        padding: 16px;
        box-shadow: 0px 1px 0px 0px #EEEEEF;
        display: flex;
        .photo-wrap {
          flex-shrink: 0;
          width: 56px;
          height: 56px;
          border-radius: 4px;
          overflow: hidden;
          position: relative;
          margin-right: 16px;
          background: #ECEDED;
          overflow: hidden;
          img {
            height: 100%;
            width: 100%;
            margin: 0 auto;
          }
          span {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 20px;
            line-height: 20px;
            text-align: center;
            background: rgba(0, 0, 0, 0.32);
            font-size: 12px;
            font-weight: 400;
            color: #FFFFFF;
            &.active {
              background: rgba(30, 137, 255, 0.72);
            }
          }
        }
        .info {
          width: 100%;
          .name-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .attendeeName {
              font-size: 17px;
              font-weight: 500;
              color: #191F24;
              line-height: 22px;
              margin-right: 24px;
            }
            .position {
              font-size: 15px;
              font-weight: 400;
              color: #191F24;
              position: relative;
              &::before {
                content: '';
                width: 1Px;
                height: 16px;
                background: #ECEDED;
                position: absolute;
                top: 2px;
                left: -12px;
              }
            }
            i {
              font-size: 16px;
            }
          }
          .org-name {
            font-size: 15px;
            font-weight: 400;
            color: #191F24;
            line-height: 20px;
            margin: 8px 0;
          }
          .phone {
            display: flex;
            align-items: center;
            span {
              font-size: 15px;
              font-weight: 400;
              color: #191F24;
              line-height: 20px;
            }
            i {
              font-size: 16px;
              font-weight: 500;
              margin-left: 8px;
            }
          }
        }
      }
      .bottom {
        padding: 0 16px;
        font-size: 15px;
        font-weight: 400;
        color: #6D7174;
        height: 48px;
        line-height: 48px;
        display: flex;
        justify-content: space-between;
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
    display: flex;
    justify-content: space-between;
    .van-button {
      border-radius: 8px;
      &.van-button--normal {
        font-size: 18px;
        font-weight: 500;
      }
      &:not(:last-child){
        margin-right: 8px;
      }
    }
  }
  .van-empty__image {
    width: 176px;
    height: 103px;
  }
}
</style>
