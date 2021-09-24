<!--
 * @Author: pengpeng
 * @Date: 2020-10-13 16:43:57
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 14:24:25
 * @Description: file content
-->
<template>
  <div>
    <van-sticky>
      <van-nav-bar class="nav-bar" @click-left="onClickLeft" @click-right="onClickRight">
        <template #left>
          <svg-icon :href="!isCheck?'piliang':'quxiaopiliang'" class="icon"/>
          <span class="text">{{!isCheck?'批量':'取消批量'}}</span>
        </template>
        <template #right>
          <svg-icon href="sousuo" class="icon"/>
        </template>
      </van-nav-bar>
    </van-sticky>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="getListFn"
      class="list"
      v-if="!empty&&!isCheck"
    >
      <div class="group" v-for="ele in ticketList" :key="ele.departuretime">
        <div class="date-info">
          <span class="dot"></span>
          <span class="date">{{ele.departuretime | day}}</span>
          <span class="week">{{ele.departuretime | week}}</span>
        </div>
        <div class="item" v-for="item in ele.list" :key="item.id" @click="detailFn(item.id)">
          <div class="top">
            <div class="range">
              <span class="start">
                <span class="name">{{item.placeofdeparture}}</span>
                <span class="time">{{item.departuretime | hour}}</span>
              </span>
              <svg-icon href="hangchengfeiji" class="icon"/>
              <span class="arrivals">
                <span class="name">{{item.destination}}</span>
                <span class="time">{{item.arrivingTime | hour}}</span>
              </span>
            </div>
            <div class="content">
              <div class="left">
                <span class="passenger">
                  <span class="name">{{item.passengername}}</span>
                  <span class="phone">{{item.phoneNumber}}</span>
                </span>
                <span class="airliner-info">{{item.physic_farebasis}}({{item.farebasis}}舱) · {{item.flightno}} · {{item.company}}</span>
                <span class="ticket">票号：{{item.ticket_id}}</span>
              </div>
              <div class="right">
                <span class="status" v-if="item.ticketstate == 1"><svg-icon href="zhengpiao" class="icon"/>正票</span>
                <span class="status" v-if="item.ticketstate == 2"><svg-icon href="gaiqian" class="icon"/>改签</span>
                <span class="status" v-if="item.ticketstate == 3"><svg-icon href="tuipiao" class="icon"/>退票</span>
                <span class="price"><span class="RMB">¥</span>{{item.sumparpriceandtax}}</span>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <span class="status-confirm">
                {{item.user_confirm_state | userConfirmState}}
              </span>
              <span class="status-reimbursement">
                {{item.journey_expense_state | journeyExpenseState}}
              </span>
            </div>
            <div class="right">
              <van-button plain type="info" class="confirmation" v-if="item.user_confirm_state !== 1" @click.stop="tipShowFn('confirmationFn',item.id)">确认函</van-button>
              <van-button plain type="info" class="confirmation" v-else @click.stop="confirmationFn(item.id)">确认函</van-button>
              <van-button plain type="info" class="confirm-btn" v-if="item.user_confirm_state !== 1" @click.stop="tipShowFn('confirmJourneyFn',item.id)">确认</van-button>
              <van-button plain type="info" class="cancel-confirm-btn" v-else @click.stop="confirmJourneyQXFn(item.id)">取消确认</van-button>
            </div>
          </div>
        </div>
        <!-- <div class="item">
          <div class="top">
            <div class="range">
              <span class="start">
                <span class="name">北京</span>
                <span class="time">10:30</span>
              </span>
              <svg-icon href="hangchengfeiji" class="icon"/>
              <span class="arrivals">
                <span class="name">哈尔滨</span>
                <span class="time">13:50</span>
              </span>
            </div>
            <div class="content">
              <div class="left">
                <span class="passenger">
                  <span class="name">詹晓明</span>
                  <span class="phone">13621214506</span>
                </span>
                <span class="airliner-info">经济舱(P舱) · CA1611 · 空港嘉华</span>
                <span class="ticket">票号：4836064047</span>
              </div>
              <div class="right">
                <span class="status"><svg-icon href="zhengpiao" class="icon"/>正票</span>
                <span class="price"><span class="RMB">¥</span>600.0</span>
              </div>
            </div>
          </div>
          <div class="bottom">
            <div class="left">
              <span class="status-confirm">已确认</span>
              <span class="status-reimbursement">未报销</span>
            </div>
            <div class="right">
              <van-button plain type="info" class="confirmation">确认函</van-button>
              <van-button plain type="info" class="confirm-btn">确认</van-button>
            </div>
          </div>
        </div> -->
      </div>
    </van-list>
    <van-checkbox-group v-model="journeyIds" ref="checkboxGroup" class="list" v-if="!empty&&isCheck">
      <div class="group" v-for="ele in ticketList" :key="'check' + ele.departuretime">
        <div class="date-info">
          <span class="dot"></span>
          <span class="date">{{ele.departuretime | day}}</span>
          <span class="week">{{ele.departuretime | week}}</span>
        </div>
        <van-checkbox :name="item.id" v-for="item in ele.list" :key="'check' + item.id">
          <div class="item">
            <div class="top">
              <div class="range">
                <span class="start">
                  <span class="name">{{item.placeofdeparture}}</span>
                  <span class="time">{{item.departuretime | hour}}</span>
                </span>
                <svg-icon href="hangchengfeiji" class="icon"/>
                <span class="arrivals">
                  <span class="name">{{item.destination}}</span>
                  <span class="time">{{item.arrivingTime | hour}}</span>
                </span>
              </div>
              <div class="content">
                <div class="left">
                  <span class="passenger">
                    <span class="name">{{item.passengername}}</span>
                    <span class="phone">{{item.phoneNumber}}</span>
                  </span>
                  <span class="airliner-info">{{item.physic_farebasis}}({{item.farebasis}}舱) · {{item.flightno}} · {{item.company}}</span>
                  <span class="ticket">票号：{{item.ticket_id}}</span>
                </div>
                <div class="right">
                  <span class="status" v-if="item.ticketstate == 1"><svg-icon href="zhengpiao" class="icon"/>正票</span>
                  <span class="status" v-if="item.ticketstate == 2"><svg-icon href="gaiqian" class="icon"/>改签</span>
                  <span class="status" v-if="item.ticketstate == 3"><svg-icon href="tuipiao" class="icon"/>退票</span>
                  <span class="price"><span class="RMB">¥</span>{{item.sumparpriceandtax}}</span>
                </div>
              </div>
            </div>
            <div class="bottom">
              <div class="left">
                <span class="status-confirm">
                  {{item.user_confirm_state | userConfirmState}}
                </span>
                <span class="status-reimbursement">
                  {{item.journey_expense_state | journeyExpenseState}}
                </span>
              </div>
              <div class="right">
                <van-button plain type="info" class="confirmation" v-if="item.user_confirm_state !== 1" @click.stop="tipShowFn('confirmationFn',item.id)">确认函</van-button>
                <van-button plain type="info" class="confirmation" v-else @click.stop="confirmationFn(item.id)">确认函</van-button>
                <van-button plain type="info" class="confirm-btn" v-if="item.user_confirm_state !== 1" @click.stop="tipShowFn('confirmJourneyFn',item.id)">确认</van-button>
                <van-button plain type="info" class="cancel-confirm-btn" v-else @click.stop="confirmJourneyQXFn(item.id)">取消确认</van-button>
                <!-- <van-button plain type="info" class="confirmation" @click.stop="confirmationFn(item.id)">确认函</van-button>
                <van-button plain type="info" class="confirm-btn" v-if="item.user_confirm_state !== 1" @click.stop="confirmJourneyFn(item.id)">确认</van-button>
                <van-button plain type="info" class="cancel-confirm-btn" v-else @click.stop="confirmJourneyQXFn(item.id)">取消确认</van-button> -->
              </div>
            </div>
          </div>
        </van-checkbox>
      </div>
    </van-checkbox-group>
    <div class="check-all-btn-box" v-if="!empty&&isCheck">
      <div class="top">
        <van-checkbox v-model="checkAll" @click="checkAllFn">全选</van-checkbox>
        <span class="total-check">共勾选{{journeyIds&&journeyIds.length}}/{{list&&list.length}}条</span>
      </div>
      <div class="bottom">
        <van-button plain type="info" @click="batchTipShowFn('batchConfirmationForMobilePhoneFn')">下载</van-button>
        <van-button plain type="info" @click="batchConfirmJourneyQXFn">取消确认</van-button>
        <van-button type="info" @click="batchTipShowFn('batchConfirmJourneyFn')">确认</van-button>
      </div>
    </div>
    <van-action-sheet v-model="actionSheetShow" title="查询行程" @cancel="showCalendar = false">
      <van-form>
        <div class="item">
          <div class="item-text">起飞日期</div>
          <div class="content">
            <div class="left">
              <span class="label-text">起始日期:</span>
              <van-field
                class="date-icon"
                readonly
                clickable
                name="calendar"
                :value="searchFormData.startPreDate"
                placeholder="点击选择日期"
                @click="showCalendarFn('startPreDate')"
              />
              <!-- <van-calendar v-model="showCalendar" @confirm="calendarFn" :min-date="minDate" :max-date="maxDate"/> -->
            </div>
            <div class="right">
              <span class="label-text">结束日期:</span>
              <van-field
                class="date-icon"
                readonly
                clickable
                name="calendar"
                :value="searchFormData.endPreDate"
                placeholder="点击选择日期"
                @click="showCalendarFn('endPreDate')"
              />
            </div>
          </div>
        </div>
        <div class="item">
          <div class="item-text">乘机信息</div>
            <van-field
              v-model="searchFormData.passengerName"
              name="passengerName"
              label="乘机人:"
              placeholder="请输入乘机人"
            />
            <van-field
              v-model="searchFormData.flightno"
              name="flightno"
              label="航班号:"
              placeholder="请输入航班号"
            />
            <van-field
              v-model="searchFormData.ticketNo"
              name="ticketNo"
              label="票号:"
              placeholder="请输入票号"
            />
        </div>
        <div class="item">
          <div class="item-text">机票状态</div>
          <ul class="ticket-status-list">
            <li v-for="(item, indexItem) in statusList" :key="item.key">
              <span class="label-text">{{item.labelText}}:</span>
              <div class="status-list">
                <span v-for="(ele, indexEle) in item.list" :key="item.key + indexEle" :class="{'active': ele.isCheck}" @click="activeFn(item.key,indexItem,indexEle)">{{ele.text}}</span>
              </div>
            </li>
            <!-- <li>
              <span class="label-text">确认状态:</span>
              <div class="status-list">
                <span class="active">全选</span>
                <span>未确认</span>
                <span>已确认</span>
              </div>
            </li> -->
          </ul>
        </div>
      </van-form>
      <div class="btn-box">
        <van-button plain type="info" @click="resetSearchForm">重置</van-button>
        <van-button type="info" @click="searchFormSubmit">查询</van-button>
      </div>
    </van-action-sheet>
    <van-dialog v-model="tipShow" show-cancel-button @confirm="tipConfirm">
      <div class="title">确认本次行程将用于报销，请确认以下信息是否属实</div>
      <div class="item">本次行程已实际使用</div>
      <div class="item">本次行程是因公出行</div>
    </van-dialog>
    <div class="datetime-picker-box" v-if="showCalendar">
      <van-datetime-picker
        v-model="currentDate"
        type="date"
        title="选择年月日"
        :min-date="minDate"
        :max-date="maxDate"
        @confirm="calendarFn"
        @cancel="showCalendar = false"
      />
    </div>
    <div class="empty" v-if="empty">
      <img src="./../../assets/images/tripRecord/kong.png" class="img">
      <div class="tip-text">当前没有行程记录</div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import dayjs from 'dayjs'
import {
  Cell,
  Dialog,
  List,
  Notify,
  DatetimePicker,
  Toast
} from 'vant'
import cloneDeep from 'lodash.clonedeep'
import { getList, confirmJourney, confirmJourneyQX, batchConfirmJourney, batchConfirmJourneyQX } from '@/api/tripRecord/index'
import {
  TOKEN,
  OBTUSERNAME,
  CATEGORYID,
  PERSONNAME
} from '@/store/mutation-types'
import arrayToGroup from '@/utils/arrayToGroup'
const statusListMock = [
  {
    labelText: '行程状态',
    key: 'ticketstate',
    list: [
      {
        id: '',
        text: '全部',
        isCheck: true
      },
      {
        id: '1',
        text: '正票',
        isCheck: false
      },
      {
        id: '2',
        text: '改签',
        isCheck: false
      },
      {
        id: '3',
        text: '退票',
        isCheck: false
      }
    ]
  },
  {
    labelText: '确认状态',
    key: 'user_confirm_state',
    list: [
      {
        id: '',
        text: '全部',
        isCheck: true
      },
      {
        id: '0',
        text: '未确认',
        isCheck: false
      },
      {
        id: '1',
        text: '已确认',
        isCheck: false
      },
      {
        id: '2',
        text: '部分确认',
        isCheck: false
      }
    ]
  },
  {
    labelText: '报销状态',
    key: 'journey_expense_state',
    list: [
      {
        id: '',
        text: '全部',
        isCheck: true
      },
      {
        id: '0',
        text: '未报销',
        isCheck: false
      },
      {
        id: '1',
        text: '已报销',
        isCheck: false
      }
    ]
  },
  {
    labelText: '下载状态',
    key: 'customer_is_download',
    list: [
      {
        id: '',
        text: '全部',
        isCheck: true
      },
      {
        id: '0',
        text: '未下载',
        isCheck: false
      },
      {
        id: '1',
        text: '已下载',
        isCheck: false
      }
    ]
  }
]
Vue.use(Cell)
  .use(Dialog)
  .use(List)
  .use(DatetimePicker)
  .use(Notify)
export default {
  name: 'index',
  components: {
  },
  data () {
    return {
      tipShow: false,
      tipConfirmExecutionFunctionName: '',
      tipConfirmExecutionFunctionNameParam: '',
      piliang: 'piliang',
      statusList: cloneDeep(statusListMock),
      list: [],
      loading: false,
      finished: false,
      checkedResult: [],
      pageNum: 1,
      isCheck: false,
      actionSheetShow: false,
      value: '',
      currentDate: new Date(),
      showCalendar: false,
      dateKey: '',
      minDate: new Date(1970, 0, 1),
      maxDate: new Date(2100, 0, 1),
      searchFormData: {
        startPreDate: '',
        endPreDate: ''
      },
      searchParams: '',
      empty: false
    }
  },
  created () {
    // this.$changePageTitle('行程记录')
    // this.getListFn();
    Toast.setDefaultOptions({ duration: 2000 })
  },
  computed: {
    journeyIds: {
      get () {
        return this.checkedResult
      },
      set (val) {
        this.checkedResult = val
        return val
      }
    },
    checkAll: {
      get () {
        return this.journeyIds.length === this.list.length
      },
      set (val) {
        return val
      }
    },
    ticketList () {
      const arr = this.list.map(item => {
        const obj = item
        obj.groupId = `${dayjs(obj.departuretime).year()}年${dayjs(obj.departuretime).month() + 1}月${dayjs(obj.departuretime).date()}日`
        return obj
      })
      return arrayToGroup(arr, 'groupId', 'departuretime')
    }
  },
  methods: {
    tipConfirm () {
      this.tipShow = false
      this[this.tipConfirmExecutionFunctionName](this.tipConfirmExecutionFunctionNameParam)
    },
    batchTipShowFn (name, param) {
      if (this.checkedResult.length === 0) {
        Toast('请选择操作项!!!')
        return false
      }
      this.tipShow = true
      this.tipConfirmExecutionFunctionName = name
      this.tipConfirmExecutionFunctionNameParam = param
    },
    tipShowFn (name, param) {
      this.tipShow = true
      this.tipConfirmExecutionFunctionName = name
      this.tipConfirmExecutionFunctionNameParam = param
    },
    onClickLeft () {
      this.isCheck = !this.isCheck
    },
    onClickRight () {
      this.actionSheetShow = !this.actionSheetShow
    },
    checkAllFn () {
      this.$refs.checkboxGroup.toggleAll(!this.checkAll)
    },
    showCalendarFn (key) {
      if (key === 'endPreDate') {
        if (this.searchFormData.startPreDate) {
          this.minDate = new Date(this.searchFormData.startPreDate)
          this.maxDate = new Date(2100, 0, 1)
        } else {
          this.minDate = new Date(1970, 0, 1)
          this.maxDate = new Date(2100, 0, 1)
        }
      } else if (key === 'startPreDate') {
        if (this.searchFormData.endPreDate) {
          this.minDate = new Date(1970, 0, 1)
          this.maxDate = new Date(this.searchFormData.endPreDate)
        } else {
          this.minDate = new Date(1970, 0, 1)
          this.maxDate = new Date(2100, 0, 1)
        }
      }
      this.showCalendar = true
      this.dateKey = key
    },
    calendarFn (date) {
      this.searchFormData[this.dateKey] = `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`
      this.showCalendar = false
    },
    activeFn (key, indexItem, indexEle) {
      this.statusList[indexItem].list.forEach((item, index) => {
        if (index === indexEle) {
          item.isCheck = true
        } else {
          item.isCheck = false
        }
      })
    },
    getListFn (params) {
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        personName: Vue.ls.get(PERSONNAME),
        pageNum: this.pageNum,
        pageSize: 10
      }
      if (params) {
        Object.assign(data, params)
        data.pageNum = 1
        this.pageNum = 1
        this.finished = false
      }
      if (this.searchParams) {
        Object.assign(data, this.searchParams)
      }
      getList(data).then(res => {
        if (res.page.list.length === 0) {
          if (this.pageNum === 1) {
            this.list = []
            this.finished = true
          } else {
            this.finished = true
          }
        } else {
          if (this.pageNum !== 1) {
            this.list = [...this.list, ...res.page.list]
          } else {
            this.list = res.page.list
          }
          this.pageNum = ++this.pageNum
        }
        // 加载状态结束
        this.loading = false
        if (this.pageNum > res.page.totalRow) {
          this.finished = true
        }
      })
    },
    detailFn (journeyId) {
      this.$router.push({
        path: '/tripRecord/detail',
        query: {
          journeyId
        }
      })
    },
    confirmationFn (journeyId) {
      this.$router.push(
        {
          path: '/tripRecord/confirmation',
          query: { journeyId }
        }
      )
    },
    confirmJourneyFn (journeyId) {
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        journeyId
      }
      confirmJourney(data).then(res => {
        this.list.find(item => {
          if (item.id === journeyId) {
            item.user_confirm_state = 1
          }
        })
        Notify({
          type: 'success',
          message: res.CommonModel.resultStr
        })
      })
    },
    confirmJourneyQXFn (journeyId) {
      Dialog.confirm({
        title: '温馨提示',
        message: '是否取消该订单的确认状态'
      })
        .then(() => {
          // on confirm
          const data = {
            obtUserName: Vue.ls.get(OBTUSERNAME),
            categoryId: Vue.ls.get(CATEGORYID),
            token: Vue.ls.get(TOKEN),
            journeyId
          }
          confirmJourneyQX(data).then(res => {
            this.list.find(item => {
              if (item.id === journeyId) {
                item.user_confirm_state = 0
              }
            })
            Notify({
              type: 'success',
              message: res.CommonModel.resultStr
            })
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    initPage () {
      this.pageNum = 1
      this.isCheck = false
      this.checkedResult = []
      this.getListFn()
    },
    batchConfirmJourneyFn () {
      if (this.journeyIds.length === 0) {
        Toast('请选择操项')
        return false
      }
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        journeyIds: this.journeyIds.join()
      }
      batchConfirmJourney(data).then(res => {
        Notify({
          type: 'success',
          message: res.CommonModel.resultStr
        })
        this.initPage()
      })
    },
    batchConfirmJourneyQXFn () {
      if (this.journeyIds.length === 0) {
        Toast('请选择操作项')
        return false
      }
      Dialog.confirm({
        title: '温馨提示',
        message: '是否取消选中订单的确认状态'
      })
        .then(() => {
          // on confirm
          const data = {
            obtUserName: Vue.ls.get(OBTUSERNAME),
            categoryId: Vue.ls.get(CATEGORYID),
            token: Vue.ls.get(TOKEN),
            journeyIds: this.journeyIds.join()
          }
          batchConfirmJourneyQX(data).then(res => {
            Notify({
              type: 'success',
              message: res.CommonModel.resultStr
            })
            this.initPage()
            Notify({
              type: 'success',
              message: res.CommonModel.resultStr
            })
          })
        })
        .catch(() => {
          // on cancel
        })
    },
    batchConfirmationForMobilePhoneFn () {
      if (this.journeyIds.length === 0) {
        Toast('请选择操作对象')
        return false
      }
      this.$router.push(
        {
          path: '/tripRecord/confirmation/sendEmail',
          query: {
            journeyIds: this.journeyIds.join()
          }
        }
      )
    },
    resetSearchForm () {
      this.statusList = cloneDeep(statusListMock)
      this.searchFormData = {}
      this.pageNum = 1
      this.searchParams = ''
      // this.getListFn()
    },
    searchFormSubmit () {
      const data = {}
      this.statusList.forEach(item => {
        item.list.forEach(ele => {
          if (ele.isCheck) {
            data[item.key] = ele.id
          }
        })
      })
      this.searchParams = Object.assign(data, this.searchFormData)
      this.searchParams.startPreDate = this.searchParams.startPreDate ? new Date(this.searchParams.startPreDate) : ''
      this.searchParams.endPreDate = this.searchParams.endPreDate ? new Date(this.searchParams.endPreDate) : ''
      this.actionSheetShow = !this.actionSheetShow
      this.pageNum = 1
      document.body.scrollTop = 0
      document.documentElement.scrollTop = 0
      // window.pageYOffset = 0;
      this.getListFn(this.searchParams)
    }
  },
  filters: {
    hour (value) {
      return dayjs(value).format('HH:mm')
    },
    day (value) {
      return `${dayjs(value).year()}年${dayjs(value).month() + 1}月${dayjs(value).date()}日`
    },
    Week (value) {
      let str = ''
      switch (dayjs(value).day()) {
        case 0:
          str = '一'
          break
        case 1:
          str = '二'
          break
        case 2:
          str = '三'
          break
        case 3:
          str = '四'
          break
        case 4:
          str = '五'
          break
        case 5:
          str = '六'
          break
        case 6:
          str = '天'
          break
      }
      return `星期${str}`
    },
    userConfirmState (value) {
      let str = ''
      switch (value) {
        case 0:
          str = '未'
          break
        case 1:
          str = '已'
          break
        case 2:
          str = '部分'
          break
      }
      return `${str}确认`
    },
    journeyExpenseState (value) {
      let str = ''
      switch (value) {
        case 0:
          str = '未'
          break
        case 1:
          str = '已'
          break
      }
      return `${str}报销`
    }
  },
  watch: {
    list: {
      handler () {
        if (this.list.length === 0) {
          this.empty = true
        } else {
          this.empty = false
        }
      },
      deep: true
    }
  }
}
</script>
<style lang="less">
  .van-dialog__confirm, .van-dialog__confirm:active{
    color: #2D6DFF;
  }
</style>
<style scoped lang="less">
@import './../../styles/border.less';
/deep/.nav-bar{
  height: 44px;
  .van-nav-bar__left{
    padding-left: 16px;
  }
  .van-nav-bar__right{
    padding-right: 16px;
  }
  .text{
    margin-left: 5px;
    font-size: 15px;
    color: #0F1011;
  }
  .icon{
    width: 20px;
    height: 20px;
  }
}
.list{
  padding: 0 8px;
  margin-bottom: 130px;
  .group{
    position: relative;
    overflow: hidden;
    &:before{
      position: absolute;
      top: 20px;
      left: 13.5px;
      content: '';
      display: flex;
      width: 3px;
      background: #09111F;
      opacity: 0.1;
      height: 99%;
      z-index: -1;
    }
    .date-info{
      padding: 10px 0;
      display: flex;
      align-items: center;
      .dot{
        margin-left: 11px;
        width: 8px;
        height: 8px;
        background: #2D2E2F;
        border-radius: 50%;
      }
      .date{
        margin-left: 8px;
        font-size: 15px;
        font-weight: bold;
        color: #2D2E2F;
      }
      .week{
        margin-left: 8px;
        font-size: 15px;
        color: #2D2E2F;
      }
    }
    .van-checkbox__label{
      .item{
        margin-top: 0;
      }
    }
    .item{
      margin-top: 10px;
      box-shadow: 0px 2px 14px 0px rgba(101, 107, 121, 0.2);
      border-radius: 8px;
      &:nth-child(2){
        margin-top: 0;
      }
      .top{
        padding: 10px 15px;
        background-color: #FDFBED;
        .range{
          padding-bottom: 8px;
          .border-1px( #B1B6BA, bottom);
          display: flex;
          justify-content: space-between;
          .icon{
            align-self: start;
            width: 150px;
            height: 28px;
          }
          .start,
          .arrivals{
            display: flex;
            flex-direction: column;
            .name{
              font-size: 17px;
              font-weight: bolder;
              color: #13171C;
            }
            .time{
              margin-top: 3px;
              font-size: 14px;
              color: #52585D;
            }
          }
          .start{
            span{
              display: flex;
              justify-content: flex-start;
            }
          }
          .arrivals{
            span{
              display: flex;
              justify-content: flex-end;
            }
          }
        }
        .content{
          padding-top: 8px;
          display: flex;
          justify-content: space-between;
          .left{
            display: flex;
            flex-direction: column;
            .passenger{
              line-height: 21px;
              font-size: 15px;
              font-weight: bold;
              color: #13171C;
              .phone{
                margin-left: 8px;
              }
            }
            .airliner-info{
              margin-top: 6px;
              font-size: 12px;
              color: #81878E;
              line-height: 17px;
            }
            .ticket{
              margin-top: 4px;
              font-size: 12px;
              color: #81878E;
              line-height: 17px;
            }
          }
          .right{
            padding: 3px 0;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            .status{
              display: flex;
              align-items: center;
              font-size: 15px;
              font-weight: bold;
              color: #13171C;
              .icon{
                margin-right: 3px;
                width: 20px;
                height: 20px;
              }
            }
            .price{
              font-size: 18px;
              font-weight: bold;
              color: #FF372D;
              .RMB{
                font-size: 14px;
              }
            }
          }
        }
      }
      .bottom{
        background-color: #fff;
        height: 44px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .left{
          padding-left: 15px;
          font-size: 12px;
          color: #81878E;
          .status-reimbursement{
            margin-left: 8px;
          }
        }
        .right{
          color: #2D6DFF;
          .confirmation,
          .confirm-btn,
          .cancel-confirm-btn{
            border: 0;
          }
          .van-button{
            padding: 0 15px;
            height: 44px;
            font-size: 15px;
            &:first-child{
              padding-right: 7.5px;
            }
            &:nth-child(n + 1) {
              padding-left: 7.5px;
            }
          }
          .confirm-btn{
            padding: 0 15px;
          }
          .cancel-confirm-btn{
            color: #52585D;
          }
        }
      }
    }
  }
}
/deep/.van-checkbox-group{
  .van-checkbox{
    background-color: #fff;
    box-shadow: 0px 0px 7px 0px rgba(101, 107, 121, 0.14);
    border-radius: 8px;
    &:nth-child(n+3){
      margin-top: 10px;
    }
    .van-checkbox__icon{
      width: 60px;
      display: flex;
      justify-content: center;
      font-size: 22px;
      .van-icon{
        border: 1px solid #c8c9cc;
      }
    }
    .van-checkbox__label{
      flex: 1;
      line-height: normal;
      .item{
        box-shadow: none;
        border-radius: 0;
      }
    }
    .van-checkbox__icon--checked{
      .van-icon{
        border: 0;
      }
    }
  }
}
.check-all-btn-box{
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 15px;
  width: 100vw;
  height: 110px;
  background-color: #fff;
  box-shadow: 0px -2px 7px 0px rgba(134, 152, 194, 0.15);
  z-index: 10;
  .top{
    display: flex;
    justify-content: space-between;
    height: 50px;
    align-items: center;
    .total-check{
      font-size: 15px;
      color: #81878E;
    }
  }
  .bottom{
    border-top: 1px solid rgba(177, 182, 186, 0.28);
    display: flex;
    justify-content: flex-end;
    height: 60px;
    align-items: center;
    .van-button{
      padding: 0 20px;
      height: 32px;
      margin-right: 15px;
      border-radius: 4px;
      font-size: 16px;
      &:last-child{
        margin-right: 0;
      }
    }
  }
}
/deep/.van-action-sheet{
  max-height: 504px;
  .van-action-sheet__header{
    padding: 0;
    font-size: 17px;
    font-weight: bold;
    color: #13171C;
    .van-icon{
      padding: 0 15px;
      color: #13171C;
      font-size: 18px;
    }
  }
  .van-action-sheet__content{
    .van-form{
      height: 400px;
      overflow: auto;
      padding: 0 15px;
      .item{
        &:nth-child(n+2){
          margin-top: 25px;
        }
        .item-text{
          margin-bottom: 12px;
          padding-left: 12px;
          position: relative;
          height: 24px;
          font-size: 17px;
          font-weight: bolder;
          color: #13171C;
          line-height: 24px;
          &:before{
            position: absolute;
            left: 0;
            top: 3px;
            content: '';
            display: flex;
            width: 4px;
            height: 15px;
            background-color: #2D6DFF;
            border-radius: 2px;
          }
        }
        .content{
          display: flex;
          .label-text{
            font-size: 14px;
            color: #81878E;
          }
          .left, .right{
            width: 50%;
            .van-cell{
              padding-right: 8px;
              margin-top: 12px;
              width: 160px;
              height: 36px;
              border-radius: 4px;
              background: #F5F7F9;
              .van-cell__value{
                padding-right: 10px;
                background-size: 22px;
                background-image: url('./../../assets/images/tripRecord/riqi.png');
                background-position-x: right;
                background-position-y: center;
                background-repeat: no-repeat;
              }
              .van-field__body{
                height: 100%;
                .van-field__control{
                  width: 100px;
                  height: 21px;
                  font-size: 15px;
                  color: #13171C;
                }
              }
            }
          }
        }
        .van-cell{
          margin-top: 12px;
          padding: 0;
          &:after{
            border: 0;
          }
          .van-field__label{
            width: 56px;
            height: 36px;
            font-size: 14px;
            color: #81878E;
            line-height: 36px;
          }
          .van-cell__value{
            width: 279px;
            height: 36px;
            background: #F5F7F9;
            border-radius: 4px;
            .van-field__body{
              padding-left: 8px;
              padding-right: 8px;
              height: 100%;
              input{
                box-shadow: 0 0 0 0 #F5F7F9 inset;
              }
            }
          }
        }
        .ticket-status-list{
          li{
            display: flex;
            margin-top: 15px;
            &:first-child{
              margin-top: 0;
            }
          }
          .label-text{
            display: flex;
            justify-content: center;
            align-items: center;
            font-size: 14px;
            color: #81878E;
          }
          .status-list{
            display: flex;
            span{
              display: flex;
              justify-content: center;
              align-items: center;
              margin-left: 15px;
              width: 55px;
              height: 28px;
              background: #F5F7F9;
              border-radius: 3px;
              font-size: 12px;
              color: #52585D;
              &.active{
                background: rgba(45, 109, 255, 0.09);
                border: 1px solid #2D6DFF;
                color: #2D6DFF;
              }
            }
          }
        }
      }
    }
    .btn-box{
      padding-right: 15px;
      width: 100vw;
      background-color: #fff;
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .van-button{
        width: 72px;
        height: 32px;
        border-radius: 4px;
        font-size: 16px;
        &:nth-child(2){
          margin-left: 15px;
        }
      }
    }
  }
}
/deep/.van-calendar__selected-day{
  background-color: #2D6DFF;
}
/deep/.van-calendar__footer{
  .van-button--danger {
    color: #fff;
    background-color: #2D6DFF;
    border: 0.02667rem solid #2D6DFF;
}
}
/deep/.van-dialog{
  .van-dialog__content{
    padding: 20px 15px 28px;
    .title{
      font-size: 15px;
      font-weight: bold;
      color: #13171C;
      line-height: 21px;
    }
    .item{
      position: relative;
      padding-left: 12px;
      margin-top: 8px;
      font-size: 13px;
      color: #52585D;
      display: flex;
      align-items: center;
      &::before{
        position: absolute;
        left: 0;
        content: '';
        display: flex;
        width: 4px;
        height: 4px;
        border-radius: 50%;
        background-color: #2D6DFF;
      }
      &:first-child{
        margin-top: 12px;
      }
    }
  }
  .van-dialog__confirm, .van-dialog__confirm:active{
    color: #2D6DFF;
  }
}
.datetime-picker-box{
  width: 100vw;
  position: fixed;
  bottom: 0;
  z-index: 9999;
  box-shadow: 0 -4px 10px -2px #000;
}
.empty{
  position: absolute;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  flex-direction: column;
  .img{
    margin-top: 200px;
    width: 148px;
    height: 92px;
  }
  .tip-text{
    display: flex;
    align-items: center;
    margin-top: 13px;
    font-size: 14px;
    color: #81878E;
  }
}
</style>
