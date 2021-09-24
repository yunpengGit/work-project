<!--
 * @Author: your name
 * @Date: 2020-10-16 13:53:52
 * @LastEditTime: 2020-10-29 19:23:59
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\views\tripRecord\detail.vue
-->
<template>
  <div>
    <img :src="bg" alt="" class="bg-img">
    <div class="trip-text">{{detailData.placeofdeparture}}飞往{{detailData.destination}}</div>
    <div class="content">
      <div class="status-list">
        <span v-if="detailData.user_confirm_state === 0">未确认</span>
        <span v-if="detailData.user_confirm_state === 1">已确认</span>
        <span v-if="detailData.user_confirm_state === 2">部分确认</span>
        <span v-if="detailData.customer_is_download === 0">未下载</span>
        <span v-if="detailData.customer_is_download === 1">已下载</span>
        <span v-if="detailData.journey_expense_state === 0">未报销</span>
        <span v-if="detailData.journey_expense_state === 1">已报销</span>
      </div>
      <van-collapse v-model="activeName">
        <van-collapse-item title="实付明细" name="1">
          <ul class="actual-payment-details">
            <li>
              <span class="label-text">票面价（含税）合计</span>
              <span class="price">{{detailData.sumparpriceandtax}}元</span>
            </li>
            <li>
              <span class="label-text">服务费合计</span>
              <span class="price">{{detailData.sumservicefee}}元</span>
            </li>
            <li>
              <span class="label-text">保险费合计</span>
              <span class="price">{{detailData.insurance}}元</span>
            </li>
            <li>
              <span class="label-text">优惠券合计</span>
              <span class="price">{{detailData.coupon}}元</span>
            </li>
            <li>
              <span class="label-text">退票费合计</span>
              <span class="price">{{detailData.sumbackrealprice}}元</span>
            </li>
          </ul>
        </van-collapse-item>
      </van-collapse>
      <div class="total">
        <div class="left">
          <span>折扣:{{detailData.discount_cn}}</span>
          <span>全价合计: {{detailData.sumtotalprice}}</span>
        </div>
        <div class="right">
          <span>实付合计</span>
          <span class="red"><span class="RMB">¥</span>{{detailData.sumrealprice}}</span>
        </div>
      </div>
      <div class="passenger-info">
        <div class="item">
          <svg-icon href="chengjiren" class="icon"/>
          <div class="text">
            <span>乘机人：{{detailData.passengername}}（{{detailData.phoneNumber}}）</span>
            <span>{{detailData.deptment}}</span>
          </div>
        </div>
        <div class="item">
          <svg-icon href="yudingren" class="icon"/>
          <div class="text">
            <span>预订人：{{detailData.booking_name}}</span>
            <span v-if="detailData.reservation_mode === 1">APP预订</span>
            <span v-if="detailData.reservation_mode === 2">电话预订</span>
          </div>
        </div>
        <div class="item">
          <svg-icon href="yudingshijian" class="icon"/>
          <div class="text">
            <span>预订时间：{{detailData.predate | day}}</span>
          </div>
        </div>
        <div class="item">
          <svg-icon href="fuwushanglianxiren" class="icon"/>
          <div class="text">
            <span>服务商紧急联系人：{{detailData.tmcEmergencyPerson}}<span @click="callFn(detailData.tmcEmergencyPhone)" class="phone">（{{detailData.tmcEmergencyPhone}}）</span></span>
          </div>
        </div>
      </div>
    </div>
    <div class="cost-center">
      <span class="label-text">{{costCenterText}}</span><span @click="goCostCenter(detailData.id)"><svg-icon href="jinru" class="icon"/></span>
    </div>
    <div class="ticket-list">
      <div class="item" v-for="item in list" :key="item.id" @click="goOrderDetail(item.id)">
        <div class="top">
          <div class="range">
            <span class="start">
              <span class="name">{{item.ch_start}}</span>
              <span class="time">{{item.departuretime | hour}}</span>
            </span>
            <svg-icon href="hangchengfeiji" class="icon"/>
            <span class="arrivals">
              <span class="name">{{item.ch_end}}</span>
              <span class="time">{{item.arrivingTime | hour}}</span>
            </span>
          </div>
          <div class="content-ino">
            <div class="left">
              <span class="ticketNo">票号：{{item.ticketNo}}</span>
              <span class="time">时间：{{item.departuretime | day}}</span>
              <span class="data-bill" v-if="item.billCategoryModel.c_create_time">
                账单日期：{{item.billCategoryModel.c_create_time | day}}
                <span v-if="item.billCategoryModel.c_pay_state === 0">（未支付）</span>
                <span v-if="item.billCategoryModel.c_pay_state === 1">（支付中）</span>
                <span v-if="item.billCategoryModel.c_pay_state === 2">（已支付）</span>
              </span>
            </div>
            <div class="right">
              <span class="status" v-if="item.ticketstate === 0"><svg-icon href="tuipiao" class="icon"/>退票</span>
              <span class="status" v-if="item.ticketstate === 1"><svg-icon href="zhengpiao" class="icon"/>正票</span>
              <span class="status" v-if="item.ticketstate === 2"><svg-icon href="gaiqian" class="icon"/>改签</span>
              <span class="cockpit">{{item.physic_farebasis}}({{item.farebasis}}舱) .{{item.flightno}}</span>
              <span class="mileage">{{item.mileage}}公里</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="btn-box">
      <van-button plain type="info" @click="confirmJourneyQXFn" v-if="detailData.user_confirm_state === 1">取消确认</van-button>
      <van-button plain type="info" @click="tipShowFn('confirmJourneyFn')" v-else>确认</van-button>
      <van-button type="info" @click="confirmationFn" v-if="detailData.user_confirm_state === 1">确认函</van-button>
      <van-button type="info" @click="tipShowFn('confirmationFn')" v-else>确认函</van-button>
    </div>
    <van-dialog v-model="tipShow" show-cancel-button @confirm="tipConfirm">
      <div class="title">确认本次行程将用于报销，请确认以下信息是否属实</div>
      <div class="item">本次行程已实际使用</div>
      <div class="item">本次行程是因公出行</div>
    </van-dialog>
    <van-overlay :show="phoneOverlayShow" @click="phoneOverlayShow = false">
      <div class="phone-wrapper" @click.stop>
         <span class="item" @click="callPhoneFn"><span class="text">呼叫&nbsp;&nbsp;&nbsp;&nbsp;{{callNumber}}</span></span>
        <a :href="phoneFn" ref="call" style="display:none"></a>
        <div class="item" @click="phoneOverlayShow = false">取消</div>
      </div>
    </van-overlay>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  Dialog,
  Notify
} from 'vant'
import dayjs from 'dayjs'
import { confirmJourney, confirmJourneyQX } from '@/api/tripRecord/index'
import { getJourney, getList } from '@/api/tripRecord/detail'
import { TOKEN, OBTUSERNAME, CATEGORYID } from '@/store/mutation-types'
Vue.use(Dialog)
  .use(Notify)
export default {
  name: 'detail',
  data () {
    return {
      tipShow: false,
      tipConfirmExecutionFunctionName: '',
      tipConfirmExecutionFunctionNameParam: '',
      bg: require('../../assets/images/tripRecord/bg-detail.png'),
      activeName: ['1'],
      detailData: {},
      list: [],
      phoneOverlayShow: false,
      callNumber: ''
    }
  },
  computed: {
    costCenterText () {
      let str = '成本中心（请选择）'
      if (this.detailData.costcenter_name) {
        str = this.detailData.costcenter_name
      }
      return str
    },
    phoneFn () {
      return `tel:${this.callNumber}`
    }
  },
  created () {
    // this.$changePageTitle('行程详情')
    this.initFn()
  },
  methods: {
    initFn () {
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        journeyId: this.$route.query.journeyId
      }
      getJourney(data).then(res => {
        this.detailData = res.journeyModel.model
      })
      getList(data).then(res => {
        this.list = res.page.list
      })
    },
    callFn (phone) {
      this.callNumber = phone
      this.phoneOverlayShow = true
    },
    callPhoneFn () {
      this.$refs.call.click()
      this.phoneOverlayShow = false
    },
    goCostCenter (journeyId) {
      this.$router.push(
        {
          path: '/tripRecord/detail/costCenter',
          query: {
            journeyId
          }
        }
      )
    },
    goOrderDetail (orderId) {
      this.$router.push(
        {
          path: '/tripRecord/detail/orderDetail',
          query: {
            orderId
          }
        }
      )
    },
    tipConfirm () {
      this.tipShow = false
      this[this.tipConfirmExecutionFunctionName]()
    },
    tipShowFn (FnName) {
      console.log(FnName)
      this.tipConfirmExecutionFunctionName = FnName
      this.tipShow = true
    },
    confirmationFn () {
      this.$router.push(
        {
          path: '/tripRecord/confirmation',
          query: { journeyId: this.detailData.id }
        }
      )
    },
    confirmJourneyFn () {
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        categoryId: Vue.ls.get(CATEGORYID),
        token: Vue.ls.get(TOKEN),
        journeyId: this.detailData.id
      }
      confirmJourney(data).then(res => {
        this.initFn()
        Notify({
          type: 'success',
          message: res.CommonModel.resultStr
        })
      })
    },
    confirmJourneyQXFn () {
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
            journeyId: this.detailData.id
          }
          confirmJourneyQX(data).then(res => {
            this.initFn()
            Notify({
              type: 'success',
              message: res.CommonModel.resultStr
            })
          })
        })
        .catch(() => {
          // on cancel
        })
    }
  },
  filters: {
    hour (value) {
      return dayjs(value).format('HH:mm')
    },
    day (value) {
      return `${dayjs(value).year()}-${dayjs(value).month() + 1}-${dayjs(value).date()}`
    }
  }
}
</script>

<style scoped lang="less">
@import './../../styles/border.less';
.bg-img{
  width: 100vw;
  position: absolute;
  z-index: -1;
}
.trip-text{
  padding-top: 15px;
  padding-left: 13px;
  font-size: 20px;
  font-weight: bold;
  color: #FFFFFF;
}
.content{
  margin: 15px 8px 10px 8px;
  background: #FFFFFF;
  border-radius: 4px;
  box-shadow: 0px 0px 7px 0px rgba(101, 107, 121, 0.14);
  .status-list{
    padding: 15px;
    font-size: 14px;
    color: #52585D;
    span{
      display: inline-block;
      padding: 0 8px;
      position: relative;
      &::after{
        position: absolute;
        top: 4px;
        right: 0;
        content: '';
        display: inline-block;
        width: 1PX;
        height: 12px;
        background: #B1B6BA;
      }
      &:last-child::after{
        background: #ffffff;;
      }
    }
  }
  .van-hairline--top-bottom{
    &::after{
      border: 0;
    }
  }
  /deep/.van-collapse-item{
    .van-collapse-item__title
    .van-cell__right-icon{
      &::before{
        content: '';
      }
      &::after{
        content: '';
        display: inline-block;
        position: absolute;
        right: 4px;
        top: 6px;
        width: 0;
        height: 0;
        border-style: solid;
        border-width: 0 5PX 8PX 5PX;
        border-color: transparent transparent #81878e transparent;

        transition: transform .3s,-webkit-transform .3s;
      }
    }
    .van-collapse-item__title--expanded .van-cell__right-icon::after{
      transform: rotate(-180deg);
    }
    .van-collapse-item__content{
      padding: 0;
      padding-top: 12px;
      padding-bottom: 14px;
      .actual-payment-details{
        padding: 15px;
        background: #FDFBED;
        li{
          position: relative;
          &::before{
            position: absolute;
            left: 0;
            content: '·';
          }
          padding-left: 15px;
          margin-top: 10px;
          display: flex;
          justify-content: space-between;
          line-height: 20px;
          font-size: 14px;
          color: #81878E;
          &:first-child{
            margin-top: 0;
          }
          .price{
            font-weight: bold;
          }
        }
      }
    }
  }

  /deep/.van-cell{
    padding: 0 15px;
    font-size: 15px;
    font-weight: bold;
    color: #13171C;
    &::after{
      border: 0;
    }
  }
  .total{
    display: flex;
    justify-content: space-between;
    padding: 6px 15px 15px;
    .left,
    .right{
      display: flex;
      flex-direction: column;
      span{
        font-size: 14px;
        font-weight: bold;
        color: #52585D;
        &:nth-child(2){
          margin-top: 6px;
        }
      }
      .red{
        display: flex;
        justify-content: flex-end;
        font-size: 18px;
        font-weight: bold;
        color: #FF372D;
        .RMB{
          display: flex;
          align-items: flex-end;
          color: #FF372D;
        }
      }
    }
  }
  .passenger-info{
    position: relative;
    padding: 15px;
    border-top: 1PX dashed #B1B6BA;
    &::before,
    &::after{
      position: absolute;
      top: -4px;
      left: -4px;
      content: '';
      display: block;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: #F5F8FD;
    }
    &::after{
      right: -4px;
      left: auto;
    }
    .item{
      display: flex;
      margin-top: 8px;
      &:first-child{
        margin-top: 0;
      }
      .icon{
        margin-top: 2px;
        margin-right: 12px;
        align-self: start;
        width: 16px;
        height: 16px;
      }
      .text{
        flex: 1;
        display: flex;
        flex-direction: column;
        span{
          span.phone{
            color: #2D6DFF;
          }
          &:nth-child(1){
            font-size: 14px;
            color: #52585D;
          }
          &:nth-child(2){
            margin-top: 2px;
            font-size: 12px;
            color: #B1B6BA;
          }
        }
      }
    }
  }
}
.cost-center{
  margin: 0 8px;
  padding-left: 15px;
  padding-right: 5px;
  height: 50px;
  background: #FFFFFF;
  box-shadow: 0px 0px 7px 0px rgba(101, 107, 121, 0.14);
  display: flex;
  align-items: center;
  .label-text{
    flex-grow: 1;
    font-size: 15px;
    color: #52585D;
  }
  .icon{
    display: flex;
    align-items: center;
    padding: 10px;
    width: 14px;
    height: 14px;
    box-sizing: content-box;
  }
}
.ticket-list{
  margin: 10px 8px 65px 8px;
  .item{
    margin-top: 10px;
    box-shadow: 0px 0px 7px 0px rgba(101, 107, 121, 0.14);
    border-radius: 4px;
    &:first-child{
      margin-top: 0;
    }
    &:nth-child(n+3){
      margin-top: 10px;
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
          height: 30px;
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
          .name,
          .time{
            display: flex;
            justify-content: flex-end;
          }
        }
        .start{
          .name,
          .time{
            display: flex;
            justify-content: flex-start;
          }
        }
      }
      .content-ino{
        padding-top: 8px;
        display: flex;
        justify-content: space-between;
        .left{
          display: flex;
          flex-direction: column;
          .ticketNo,
          .time,
          .data-bill{
            margin-top: 5px;
            font-size: 12px;
            color: #52585D;
          }
          .ticketNo{
            margin-top: 0;
          }
        }
        .right{
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: flex-end;
          .status{
            display: flex;
            align-items: center;
            font-size: 15px;
            font-weight: bold;
            color: #13171C;
            .icon{
              margin-right: 3px;
              width: 18px;
              height: 18px;
            }
          }
          .cockpit,
          .mileage{
            font-size: 12px;
            color: #81878E;
          }
        }
      }
    }
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
.btn-box{
  position: fixed;
  bottom: 0;
  left: 0;
  padding: 0 16px;
  width: 100vw;
  background-color: #fff;
  box-shadow: 0px -2px 7px 0px rgba(134, 152, 194, 0.15);
  z-index: 10;
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
</style>
