<template>
    <van-popup
      v-model="showFilter_"
      position="right"
      class="popup"
    >
    <div class="filter-box">
      <div class="list">
        <div class="item" v-for="(item, index) in list" :key="index">
          <!-- <div class="title">类型</div>
          <div class="list">
            <span>全部</span>
            <span>我的拟稿</span>
            <span>我的签收</span>
            <span>我的签收</span>
            <span>我的签收</span>
          </div> -->
          <div class="title">{{item.title}}</div>
          <div class="list">
            <span v-for="(item0, ind) in item.detailList" :key="ind" @click="checkFn(item0, item.title)" :class="{'check': isTrue(item.title, item0)}">{{item0.name}}</span>
            <div v-if="item.title === '创建时间'" class="date-box">
              <span class="date" @click="showDatefn('createTimeStart')">{{createTimeStart}}</span>
              <span class="line"></span>
              <span class="date" @click="showDatefn('createTimeEnd')">{{createTimeEnd}}</span>
            </div>
            <div v-else-if="item.title === '结束时间'" class="date-box">
              <span class="date" @click="showDatefn('finishTimeStart')">{{finishTimeStart}}</span>
              <span class="line"></span>
              <span class="date" @click="showDatefn('finishTimeEnd')">{{finishTimeEnd}}</span>
            </div>
          </div>
        </div>
      </div>
      <van-popup
        v-model="showDate"
        position="bottom"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          :max-date="maxDate"
          :formatter="formatter"
          @confirm="confirmDate"
          @cancel="cancelDate"
        />
      </van-popup>
      <div class="btn-box">
        <van-button type="default" class="btn" @click="reset">重置</van-button>
        <van-button type="info" class="btn" @click="confirm">确定</van-button>
      </div>
    </div>
    </van-popup>
</template>

<script>
import Vue from 'vue'
import { Button, Popup, Field, DatetimePicker } from 'vant'
import moment from 'moment'

Vue.use(Button)
  .use(Popup)
  .use(Field)
  .use(DatetimePicker)
const strMap = new Map(
  [
    ['类型', 'docType'],
    ['状态', 'docStatus'],
    ['创建时间', 'checkCreate'],
    ['结束时间', 'checkFinish']
  ]
)
export default {
  data () {
    return {
      strMap,
      docType: '',
      docStatus: '',
      createStart: '',
      createEnd: '',
      publishStart: '',
      publishEnd: '',
      checkCreate: '',
      checkFinish: '',
      dataType: '',
      createTimeStart: '请选择',
      createTimeEnd: '请选择',
      finishTimeStart: '请选择',
      finishTimeEnd: '请选择',
      minDate: new Date(2000, 0, 1),
      maxDate: new Date(2100, 11, 29),
      currentDate: new Date(),
      list: [
        { title: '类型', detailList: [{ name: '全部', num: -1 }, { name: '我的拟稿', num: 1 }, { name: '我的签收', num: 0 }] },
        { title: '状态', detailList: [{ name: '草稿', num: '10' }, { name: '驳回', num: '11' }, { name: '待审', num: '20' }, { name: '发布', num: '30' }, { name: '废弃', num: '40' }] },
        { title: '创建时间', detailList: [{ name: '近一周', num: 7 }, { name: '近一个月', num: 30 }, { name: '近三个月', num: 90 }, { name: '半年', num: 180 }, { name: '近一年', num: 360 }] },
        { title: '结束时间', detailList: [{ name: '近一周', num: 7 }, { name: '近一个月', num: 30 }, { name: '近三个月', num: 90 }, { name: '半年', num: 180 }, { name: '近一年', num: 360 }] }
      ],
      value: '',
      showDate: false
    }
  },
  computed: {
    showFilter_: {
      get () {
        if (this.active === 0) {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.list[1].detailList[2].name = '办理中'
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.list[1].detailList[3].name = '已办结'
        } else {
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.list[1].detailList[2].name = '待审'
          // eslint-disable-next-line vue/no-side-effects-in-computed-properties
          this.list[1].detailList[3].name = '发布'
        }
        return this.showFilter
      },
      set (val) {
        this.$emit('closeFn')
      }
    }
  },
  props: {
    showFilter: {
      type: Boolean
    },
    active: {
      type: Number
    }
  },
  methods: {
    isTrue (title, item) {
      return this[strMap.get(title)] === item.num
    },
    reset () {
      this.docType = ''
      this.docStatus = ''
      this.checkCreate = ''
      this.checkFinish = ''
      this.createTimeStart = '请选择'
      this.createTimeEnd = '请选择'
      this.finishTimeStart = '请选择'
      this.finishTimeEnd = '请选择'
    },
    confirm () {
      const today = moment().format('YYYY-MM-DD')
      const aWeekAgo = moment().subtract(7, 'days').format('YYYY-MM-DD')
      const aMonthsAgo = moment().subtract(1, 'months').format('YYYY-MM-DD')
      const threeMonthsAgo = moment().subtract(3, 'months').format('YYYY-MM-DD')
      const sixMonthsAgo = moment().subtract(6, 'months').format('YYYY-MM-DD')
      const aYearAgo = moment().subtract(1, 'years').format('YYYY-MM-DD')
      const timeMap = new Map(
        [
          [7, aWeekAgo],
          [30, aMonthsAgo],
          [90, threeMonthsAgo],
          [180, sixMonthsAgo],
          [360, aYearAgo]
        ]
      )
      let createStart = ''
      let createEnd = ''
      let publishStart = ''
      let publishEnd = ''
      if (this.checkCreate) {
        createStart = timeMap.get(this.checkCreate)
        createEnd = today
      }
      if (this.checkFinish) {
        publishStart = timeMap.get(this.checkFinish)
        publishEnd = today
      }
      let obj
      if (this.docType !== '') {
        obj = { 'q.mydoc': 'create' }
      }
      let param = {
        ...obj,
        'q.docStatus': this.docStatus,
        'q.createStart': createStart,
        'q.createEnd': createEnd,
        'q.publishStart': publishStart,
        'q.publishEnd': publishEnd
      }
      this.$store.dispatch('setFilterParamsData', param)
      this.$emit('filterFn', param, this.docType)
      this.$emit('closeFn')
    },
    checkFn (item, title) {
      if (title === '创建时间') {
        this.createTimeStart = '请选择'
        this.createTimeEnd = '请选择'
      } else if (title === '结束时间') {
        this.finishTimeStart = '请选择'
        this.finishTimeEnd = '请选择'
      }
      if (this[strMap.get(title)] === item.num) {
        this[strMap.get(title)] = ''
      } else {
        this[strMap.get(title)] = item.num
      }
      // this.$nextTick(() => {
      // })
    },
    showDatefn (type) {
      this.dataType = type
      // new Date('2020/01/01')
      // if (this[type.substring(0, 6) + 'TimeStart'] !== '请选择') {
      //   let date = this[type.substring(0, 6) + 'TimeStart']
      //   date = date.replace('-', '/')
      //   this.minDate = new Date(date)
      // } else if (this[type.substring(0, 6) + 'TimeEnd'] !== '请选择') {
      //   let date = this[type.substring(0, 6) + 'TimeEnd']
      //   date = date.replace('-', '/')
      //   this.MaxDate = new Date(date)
      // }
      this.showDate = true
    },
    confirmDate (val) {
      if (this.dataType === 'createTimeStart' || this.dataType === 'createTimeEnd') {
        this.checkCreate = ''
      } else if (this.dataType === 'finishTimeStart' || this.dataType === 'finishTimeEnd') {
        this.checkfinish = ''
      }
      this[this.dataType] = this.$formatDate(val, 'yyyy-mm-dd')
      this.showDate = false
    },
    cancelDate () {
      this.showDate = false
    },
    formatter (type, val) {
      if (type === 'year') {
        return `${val}年`
      } else if (type === 'month') {
        return `${val}月`
      } else if (type === 'day') {
        return `${val}日`
      }
      return val
    },
    closeFilter () {
      this.$emit('filterFn')
    }
  }
}
</script>

<style lang="less">
.van-overlay{
  background-color: rgba(0, 0, 0, 0.5);
}
</style>
<style scoped lang="less">
.popup{
  width: 334px;
}
.filter-box{
  height: 100vh;
  overflow: auto;
  & > .list{
    padding-bottom: 54px;
  }
  .item{
    padding:16px 28px 13px;
    border-bottom: 1px #E9E9E9 solid;
    .title{
      font-size:15px;
      color:rgba(4,15,30,1);
      line-height:18px;
    }
    .list{
      display: flex;
      justify-content: flex-start;
      flex-wrap: wrap;
      span{
        margin-top: 8px;
        margin-right: 16px;
        flex-shrink: 0;
        width:80px;
        height:36px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 13px;
        background:rgba(244,244,244,1);
        color:rgba(103,103,103,1);
        border-radius:8px;
        border:1px solid rgba(224,224,224,1);
        &:last-child{
          text-align: left;
        }
        &:nth-child(3n){
          margin-right: 0;
        }
        &.check{
          background:rgba(232,243,255,1);
          border-color: rgba(232,243,255,1);
          color:rgba(30,137,255,1);
        }
      }
      .date-box{
        margin-top: 8px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        /deep/.van-cell{
          padding: 0 16px;
          align-items: center;
        }
        .date{
          box-sizing: border-box;
          padding-left: 18px;
          justify-content: flex-start;
          width: 110px;
          height: 36px;
          font-size: 13px;
          background:rgba(244,244,244,1);
          color:rgba(103,103,103,1);
          border-radius:8px;
          border:1px solid rgba(224,224,224,1);
        }
        .line{
          width:20px;
          height:0;
          border: 0;
          border-top: 1px solid #cdcdcd;
        }
      }
    }
  }
  .btn-box{
    position: fixed;
    width: 334px;
    bottom: 0;
    right: 0;
    display: flex;
    z-index: 3;
    .btn{
      flex: 1;
    }
  }
}
</style>
