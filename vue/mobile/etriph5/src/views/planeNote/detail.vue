<template>
    <div>
      <van-sticky>
        <van-nav-bar left-arrow title="行程详情" @click-left="$router.push('/planeNote')" />
      </van-sticky>
      <div class="info">
        <div class="stroke">
          <span>{{data.placeofdeparture}}</span><svg-icon href="iconico" class="svg-icon"/><span>{{data.destination}}</span>
        </div>
        <div class="status">
          <span>{{userConfirmState.get(data.user_confirm_state)}}</span>
          <span>{{customerIsDownload.get(data.customer_is_download)}}</span>
          <span>{{journeyExpenseState.get(data.journey_expense_state)}}</span>
        </div>
        <div class="pay-detail" flex="">
          <div class="label-text">实付明细</div>
          <div class="num-list">
            <div flex="main:between">
              <label>票面价(含税)合计</label><span>{{data.sumparpriceandtax}}元</span>
            </div>
            <div flex="main:between">
              <label>服务费合计</label><span>{{data.sumservicefee}}元</span>
            </div>
            <div flex="main:between">
              <label>保险费合计</label><span>{{data.insurance}}元</span>
            </div>
            <div flex="main:between">
              <label>优惠券合计</label><span>{{data.coupon}}元</span>
            </div>
            <div flex="main:between">
              <label>退票费合计</label><span>{{data.sumbackrealprice}}元</span>
            </div>
          </div>
        </div>
        <div class="pay-total" flex="main:between">
          <div flex="dir:column">
            <span>折扣：{{data.discount_cn}}</span>
            <span>全价合计：{{data.sumtotalprice}}元</span>
          </div>
          <div flex="dir:column">
            <span>实付合计</span>
            <span>{{data.sumrealprice}}<span class="unit">元</span></span>
          </div>
        </div>
        <div class="user-info" flex="main:between">
          <div flex="dir:column">
            <span>乘机人：{{data.passengername}}<span v-if="data.phoneNumber">（{{data.phoneNumber}}）</span></span>
            <span>预订人：{{data.booking_name}}</span>
            <span>预订时间：{{data.predate?data.predate.substr(0,10):''}}</span>
            <span>服务商紧急联系人：{{data.tmcEmergencyPerson}}</span>
            <span>紧急联系电话：{{data.tmcEmergencyPhone}}</span>
          </div>
          <div flex="dir:column">
            <span>{{data.deptment}}</span>
            <span>{{bookingMethod}}</span>
          </div>
        </div>
        <div class="cost-center" v-if="data.costcenter_name">
          <div>成本中心：</div>
          <div @click="selectCostCenter">
            <div>{{data.costcenter_name}}</div>
            <svg-icon href="iconjiantouxia" class="svg-icon"></svg-icon>
          </div>
        </div>
        <!--<div class="approver" v-if="data.evectionSimpleModel">-->
        <div class="approver" v-if="false">
          <span>{{data.evectionSimpleModel.evectionName}}发起的出差审批</span>
          <span>{{data.evectionSimpleModel.createTime.substr(0,10)}}</span>
        </div>
      </div>
      <div class="list-box">
        <div @click="orderDetail(item)" v-for="(item, index) in list" :key="index">
          <div>{{ticketState(item.ticketstate)}}</div>
          <div>
            <div>
              <span>票号 {{item.ticketNo}}</span>
              <span>{{item.departuretime.substr(0,10)}}</span>
              <span><span>{{item.ch_start}}</span>-<span>{{item.ch_end}}</span></span>
            </div>
            <div>
              <span>{{item.physic_farebasis}}({{item.farebasis}}舱)</span>
              <span><span>{{item.flightno}}</span>{{item.mileage}}公里</span>
            </div>
          </div>
        </div>
      </div>
      <div class="btn-box">
        <!--<van-button round type="info">评价</van-button>-->
        <van-button size="small" round type="info" @click="confirmCancel">{{confirmOrCancel}}</van-button>
        <van-button size="small" round plain hairline type="info" @click="download">下载确认函</van-button>
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
import api from '@/api/journey'
import { Sticky, NavBar, Divider, Dialog, Button, Toast } from 'vant'

Vue.use(Sticky).use(NavBar).use(Divider).use(Dialog).use(Button).use(Toast)

const userConfirmState = new Map([
  [0, '未确认'],
  [1, '已确认'],
  [2, '部分确认']
])
const customerIsDownload = new Map([
  [0, '未下载'],
  [1, '已下载']
])
const journeyExpenseState = new Map([
  [0, '未报销'],
  [1, '已报销']
])
export default {
  data () {
    return {
      isConfirm: false,
      params: {
        journeyId: '',
        categoryId: '',
        obtUserName: ''
      },
      userConfirmState,
      journeyExpenseState,
      customerIsDownload,
      data: {
        placeofdeparture: '',
        userConfirmState: '',
        destination: '',
        predate: '',
        departuretime: '',
        evectionSimpleModel: {
          createTime: '',
          evectionName: ''
        }
      },
      list: [
        {
          departuretime: ''
        }
      ]
    }
  },
  computed: {
    bookingMethod () {
      let reservationMode = this.data.reservation_mode
      if (reservationMode === 1) {
        return 'App预订'
      } else if (reservationMode === 2) {
        return '400电话预订'
      } else {
        return ''
      }
    },
    confirmOrCancel () {
      let userConfirmState = this.data.user_confirm_state
      if (userConfirmState === 0) {
        return '确认'
      } else if (userConfirmState === 1) {
        return '取消'
      } else {
        return ''
      }
    }
  },
  created () {
    this.params.journeyId = this.$route.query.id
    this.params.categoryId = JSON.parse(window.localStorage.getItem('userInfo')).categoryId
    this.params.obtUserName = JSON.parse(window.localStorage.getItem('userInfo')).tel
    const {
      categoryId,
      obtUserName,
      journeyId
    } = this.params
    api.journeyDetail(
      {
        categoryId,
        obtUserName,
        journeyId
      }
    ).then(res => {
      this.data = res.journeyModel.model
    }).catch(e => {
      console.error(e)
    })
    // 标记当前是否为已确认
    this.$nextTick(() => {
      if (this.data.user_confirm_state === 1) {
        this.isConfirm = false
      }
    })
    // 列表
    api.orderlist({
      journeyId,
      categoryId,
      obtUserName
    }).then(res => {
      this.list = res.page.list
    }).catch(e => {
      console.error(e)
    })
  },
  methods: {
    download () {
      if (this.data.user_confirm_state === 1) {
        this.isConfirm = true
        this.downloadConfirmation()
      } else {
        this.toast(2)
      }
    },
    toast (type) { // 弹窗提示,0取消，1确认，2下载
      let title = '提示'
      let message = ''
      let className = ''
      let callback
      switch (type) {
        case 0:
          message = '是否取消本次行程？'
          callback = this.cancel
          break
        case 1:
          message = '确认本次行程将用于报销，请确认以下信息是否属实：\n1）本次行程已实际使用\n2）本次行程是因公出行'
          callback = this.confirm
          className = 'align-left'
          break
        case 2:
          message = '确认本次行程将用于报销，请确认以下信息是否属实：\n1）本次行程已实际使用\n2）本次行程是因公出行'
          callback = this.downloadConfirmation
          className = 'align-left'
      }
      Dialog.confirm({
        title,
        className,
        message
      }).then(() => {
        callback()
      }).catch(() => {})
    },
    selectCostCenter () {
      this.$router.push(`/CostCenter?id=${this.params.journeyId}`)
    },
    ticketState (state) {
      if (state === 0) {
        return '退票'
      } else if (state === 1) {
        return '正票'
      } else {
        return '改签'
      }
    },
    orderDetail (item) {
      const {
        categoryId,
        obtUserName
      } = this.params
      this.$router.push(`/planeNoteOrderDetail?id=${this.params.journeyId}&categoryId=${categoryId}&obtUserName=${obtUserName}&orderId=${item.id}`)
    },
    confirmCancel () {
      let userConfirmState = this.data.user_confirm_state
      if (userConfirmState === 0) {
        this.toast(1)
      } else if (userConfirmState === 1) {
        this.toast(0)
      }
    },
    confirm () {
      const {
        categoryId,
        obtUserName,
        journeyId
      } = this.params
      api.confirmJourney({
        categoryId,
        obtUserName,
        journeyId
      }).then(res => {
        Toast(res.CommonModel.resultStr)
        if (res.CommonModel.state === 1) {
          this.isConfirm = true
          this.$nextTick(() => {
            this.data.user_confirm_state = 1
          })
        }
      }).catch(e => {
        console.error(e)
      })
    },
    cancel () {
      const {
        categoryId,
        obtUserName,
        journeyId
      } = this.params
      api.cancelJourney({
        categoryId,
        obtUserName,
        journeyId
      }).then(res => {
        let data = res.CommonModel
        Toast(data.resultStr)
        if (data.state === 1) {
          this.$nextTick(() => {
            this.data.user_confirm_state = 0
          })
        }
      }).catch(e => {
        console.error(e)
      })
    },
    downloadConfirmation () {
      if (this.isConfirm) {
        this.$router.push(`/planeNoteDetailDownloadConfirmation?id=${this.params.journeyId}`)
      } else {
        const {
          categoryId,
          obtUserName,
          journeyId
        } = this.params
        api.confirmJourney({
          categoryId,
          obtUserName,
          journeyId
        }).then(res => {
          if (res.CommonModel.state !== 1) {
            Toast(res.CommonModel.resultStr)
          } else {
            this.$router.push(`/planeNoteDetailDownloadConfirmation?id=${this.params.journeyId}`)
          }
        }).catch(e => {
          console.error(e)
        })
      }
    }
  }
}
</script>
<style lang="less" scoped>
  /*重置*/
  .van-divider{
    margin: 0;
  }
  /deep/ .info{
    padding: 12px 16px 0;
    background-color: #fff;
    .stroke{
      display: flex;
      align-items: flex-start;
      font-size: 20px;
      color: #4A4A4A;
      .svg-icon{
        margin-left: 2px;
        width: 26px;
        height: 26px;
      }
    }
    .status{
      margin-top: 8px;
      &:after{
        content: '';
        clear: both;
        display: block;
      }
      & > span{
        float: left;
        padding: 0 10px;
        font-size: 12px;
        color: #9B9B9B;
        border-left: 1px solid #DAE3EA;
        &:nth-child(1){
          padding-left: 0;
          border-left: 0;
        }
      }
    }
    .pay-detail{
      padding-top: 16px;
      display: flex;
      padding-bottom: 16px;
      & > div{
        flex-grow: 1;
      }
      .label-text{
        color: #007EC8;
      }
      .num-list{
        font-size: 14px;
        color: #4A4A4A;
        & > div {
          height: 20px;
          line-height: 20px;
        }
      }
    }
    .pay-total{
      padding: 8px 0;
      border-top: 1px solid #DAE3EA;
      & > div{
        flex-grow: 1;
        &:nth-child(1){
          font-size: 14px;
          color: #4A4A4A;
          & > span:nth-child(1) {
            margin-bottom: 8px;
          }
        }
        &:nth-child(2){
          text-align: right;
          span:nth-child(1){
            font-size: 12px;
            color: #4A4A4A;
          }
          span:nth-child(2){
            font-size: 26px;
            color: #007EC8;
            & > span {
              font-size: 14px;
              color: #007EC8;
            }
          }
        }
      }
    }
    .user-info{
      padding: 12px 0;
      border-top: 1px solid #DAE3EA;
      & > div{
        flex-grow: 1;
        &:nth-child(1){
          font-size: 14px;
          color: #4A4A4A;
          letter-spacing: -0.34px;
          line-height: 26px;
        }
        &:nth-child(2){
          margin-right: 12px;
          text-align: right;
          font-size: 12px;
          color: #9B9B9B;
          letter-spacing: -0.29px;
        }
      }
    }
    .cost-center{
      padding: 12px 0;
      display: flex;
      border-top: 1px solid #DAE3EA;
      & > div {
        &:first-child{
          width: 64px;
        }
        &:nth-child(2){
          flex: 1;
          display: flex;
          & > div{
            flex: 1;
          }
          & > .svg-icon{
            width: 20px;
            height: 20px;
            transform: rotate(-90deg);
          }
        }
      }
    }
    .approver{
      padding: 12px 0;
      font-size: 12px;
      display: flex;
      border-top: 1px solid #DAE3EA;
      & > span{
        flex-grow: 1;
        &:nth-child(2){
          text-align: right;
        }
      }
    }
  }
  .list-box{
    background-color: #F9FAFB;
    & > div{
      display: flex;
      padding: 2px 16px;
      & + div {
        & > div:nth-child(2) {
          border-top: 1px solid #DAE3EA;
        }
      }
      & > div:nth-child(1) {
        font-size: 18px;
        width: 52px;
        line-height: 62px;
        color: #007EC8;
        letter-spacing: -0.43px;
      }
      & > div:nth-child(2) {
        display: flex;
        align-content: space-between;
        padding: 12px 0;
        flex:1;
        font-size: 14px;
        color: #4A4A4A;
        letter-spacing: -0.34px;
        &:first-child{
          border-top: 0;
        }
        & > div{
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          & > span{
            margin-bottom: 6px;
          }
          & > span:last-child{
            margin-bottom: 0;
          }
          &:nth-child(2){
            text-align: right;
            & > span > span{
              margin-right: 10px;
              padding-right: 10px;
              border-right: 1px solid #DAE3EA;
            }
          }
        }
      }
    }
  }
  .btn-box{
    padding-top: 22px;
    padding-bottom: 16px;
    display: flex;
    justify-content:space-around;
    & > * {
      width: 100px;
    }
  }
</style>
