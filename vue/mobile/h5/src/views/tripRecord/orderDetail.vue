<!--
 * @Author: your name
 * @Date: 2020-10-19 21:30:06
 * @LastEditTime: 2020-10-29 16:53:33
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \h5\src\views\tripRecord\orderDetail.vue
-->
<template>
  <div style="
    display: flex;
    flex-direction: column;
    height: 100vh;
">
    <div class="ticket-list">
      <div class="item">
        <div class="top">
          <div class="range">
            <span class="start">
              <span class="name">{{detailData.ch_start}}</span>
              <span class="time">{{detailData.departuretime | hour}}</span>
            </span>
            <svg-icon href="hangchengfeiji" class="icon"/>
            <span class="arrivals">
              <span class="name">{{detailData.ch_end}}</span>
              <span class="time">{{detailData.arrivingTime | hour}}</span>
            </span>
          </div>
          <div class="content-ino">
            <div class="left">
              <span class="ticketNo">票号：{{detailData.ticketNo}}</span>
              <span class="time">时间：{{detailData.departuretime | day}}</span>
              <span class="data-bill" v-if="detailData.billCategoryModel.c_create_time">
                账单日期：{{detailData.billCategoryModel.c_create_time | day}}
                <span v-if="detailData.billCategoryModel.c_pay_state === 0">（未支付）</span>
                <span v-if="detailData.billCategoryModel.c_pay_state === 1">（支付中）</span>
                <span v-if="detailData.billCategoryModel.c_pay_state === 2">（已支付）</span>
              </span>
            </div>
            <div class="right">
              <span class="status" v-if="detailData.ticketstate === 0"><svg-icon href="tuipiao" class="icon"/>退票</span>
              <span class="status" v-if="detailData.ticketstate === 1"><svg-icon href="zhengpiao" class="icon"/>正票</span>
              <span class="status" v-if="detailData.ticketstate === 2"><svg-icon href="gaiqian" class="icon"/>改签</span>
              <span class="cockpit">{{detailData.physic_farebasis}}({{detailData.farebasis}}舱) .{{detailData.flightno}}</span>
              <span class="mileage">{{detailData.mileage}}公里</span>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="panel">
      <div class="title">实付明细</div>
      <ul class="actual-payment-details">
        <li>
          <span class="label-text">票面价（含税）合计</span>
          <span class="price">{{detailData.parprice}}元</span>
        </li>
        <li>
          <span class="label-text">服务费合计</span>
          <span class="price">{{detailData.travelservicecost}}元</span>
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
          <span class="price">{{detailData.bouncecoursefee}}元</span>
        </li>
      </ul>
      <div class="total">
        <div class="left">
          <span>折扣:{{detailData.discount}}</span>
          <span>全价合计: {{detailData.fullPrice}}</span>
        </div>
        <div class="right">
          <span>实付合计</span>
          <span class="red"><span class="RMB">¥</span>{{detailData.totalprice}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import dayjs from 'dayjs'
import { getOrderModel } from '@/api/tripRecord/orderDetail'
import { TOKEN, OBTUSERNAME, CATEGORYID } from '@/store/mutation-types'
export default {
  name: 'titckDetail',
  data () {
    return {
      detailData: {
        billCategoryModel: {}
      }
    }
  },
  created () {
    // this.$changePageTitle('订单详情')
    const data = {
      obtUserName: Vue.ls.get(OBTUSERNAME),
      categoryId: Vue.ls.get(CATEGORYID),
      token: Vue.ls.get(TOKEN),
      orderId: this.$route.query.orderId
    }
    getOrderModel(data).then(res => {
      this.detailData = res.CommonModel.model
    })
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
.ticket-list{
  padding-top: 10px;
  .item{
    margin-left: 8px;
    margin-right: 8px;
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
          height: 25px;
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
        .start .time{
          text-align: left;
        }
        .arrivals .time{
          text-align: right;
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
              width: 15px;
              height: 15px;
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
.panel{
  flex-grow: 1;
  margin-top: 10px;
  background-color: #fff;
  .title{
    padding: 10px 15px;
    font-size: 15px;
    font-weight: bold;
    color: #13171C;
  }
  .actual-payment-details{
      padding: 0 15px;
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
  .total{
    display: flex;
    justify-content: space-between;
    padding: 15px;
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
}
</style>
