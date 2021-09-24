<template>
    <div>
      <van-sticky>
        <van-nav-bar left-arrow title="订单详情" @click-left="$router.back(-1)" />
      </van-sticky>
      <div class="list-box">
        <div>
          <div>{{ticketState(data.ticketstate)}}</div>
          <div>
            <div>
              <span>票号 {{data.ticketNo}}</span>
              <span>{{data.departuretime.substr(0,10)}}</span>
              <span><span>{{data.ch_start}}</span>-<span>{{data.ch_end}}</span></span>
            </div>
            <div>
              <span>{{data.physic_farebasis}}({{data.farebasis}}舱)</span>
              <span><span>{{data.flightno}}</span>{{data.mileage}}公里</span>
            </div>
          </div>
        </div>
      </div>
      <div class="info">
        <div class="pay-detail" flex="">
          <div class="label-text">实付明细</div>
          <div class="num-list">
            <div flex="main:between">
              <label>票面价(含税)合计</label><span>{{data.parprice}}元</span>
            </div>
            <div flex="main:between">
              <label>服务费合计</label><span>{{data.travelservicecost}}元</span>
            </div>
            <div flex="main:between">
              <label>保险费合计</label><span>{{data.insurance}}元</span>
            </div>
            <div flex="main:between">
              <label>优惠券合计</label><span>{{data.coupon}}元</span>
            </div>
            <div flex="main:between">
              <label>退票费合计</label><span>{{data.bouncecoursefee}}元</span>
            </div>
          </div>
        </div>
        <div class="pay-total" flex="main:between">
          <div flex="dir:column">
            <span>折扣：{{data.discount}}</span>
            <span>全价：{{data.fullPrice}}元</span>
          </div>
          <div flex="dir:column">
            <span>实付合计</span>
            <span>{{data.totalprice}}<span class="unit">元</span></span>
          </div>
        </div>
      </div>
    </div>
</template>
<script>
import Vue from 'vue'
import api from '@/api/journey'
import { Sticky, NavBar, Divider, Button } from 'vant'

Vue.use(Sticky).use(NavBar).use(Divider).use(Button)
export default {
  data () {
    return {
      data: {
        departuretime: ''
      }
    }
  },
  computed: {

  },
  created () {
    api.orderModel(this.$route.query).then(res => {
      this.data = res.CommonModel.model
    }).catch(e => {
      console.error(e)
    })
  },
  methods: {
    ticketState (state) {
      if (state === 0) {
        return '退票'
      } else if (state === 1) {
        return '正票'
      } else {
        return '改签'
      }
    }
  }
}
</script>
<style lang="less" scoped>
  .info{
    padding: 0 16px;
    background-color: #fff;
    .pay-detail{
      padding-top: 16px;
      display: flex;
      padding-bottom: 16px;
      border-bottom: 1px solid #DAE3EA;
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
      border-bottom: 1px solid #DAE3EA;
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
  }
  .list-box{
    background-color: #F9FAFB;
    & > div{
      display: flex;
      padding: 2px 16px;
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
</style>
