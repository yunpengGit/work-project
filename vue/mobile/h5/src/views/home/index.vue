<!--
 * @Author: pengpeng
 * @Date: 2020-10-13 14:15:09
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-10-30 16:19:06
 * @Description: file content
-->
<template>
  <div>
    <img :src="bg" alt="" class="bg-img">
    <div class="tag-year">{{year}}<svg-icon href="feiji" class="icon"></svg-icon></div>
    <div class="total">
      <div class="item">
        <span>飞行里程</span>
        <span>{{mileage}}公里</span>
      </div>
      <div class="item">
        <span>飞行时间</span>
        <span>{{minutesAndHoursAmountsStr===''?0:minutesAndHoursAmountsStr}}</span>
      </div>
      <div class="item">
        <span>飞行次数</span>
        <span>{{times}}次</span>
      </div>
      <div class="item">
        <span>城市/地区</span>
        <span>{{cityCounts}}个</span>
      </div>
    </div>
    <div class="list">
      <div class="item" v-for="item in airOrderCompanyFunctionModelList" :key="item.companyId" :class="{'gray': item.grayState === 1}">
        <div class="top">
          <span class="title">
            <img :src="checkLogo(item.companyName)" alt="" class="logo" @click="toComanyDetail(item.companyName)">
            <span class="name">{{item.companyName | NameMapping}}</span>
          </span>
          <span @click="callFn(item.phone)" v-if="item.grayState !== 1"><svg-icon href="kefu" class="phone"></svg-icon></span>
          <svg-icon href="kefu" class="phone" v-else></svg-icon>
        </div>
        <div class="info" v-if="item.latestFlightOrderDetailMap">
          <van-notice-bar left-icon="volume-o" :scrollable="false">
            <van-swipe
              vertical
              class="notice-swipe"
              :autoplay="3000"
              :show-indicators="false"
            >
              <van-swipe-item v-for="ele in item.latestFlightOrderDetailMap" :key="ele.ticketId">
                <span class="status">{{ele.ticket_stateName}}</span>
                <span class="content">{{ele.departureTime}}·{{ele.aircompanyName}}{{ele.flightno}}  {{ele.placeofdepartureName}}-{{ele.destinationName}}</span>
              </van-swipe-item>
            </van-swipe>
          </van-notice-bar>
        </div>
        <div class="bottom" v-if="item.grayState !== 1">
          <span class="details">
            <span class="item" @click="loginFn(item.companyName,{hxFunc: 'orderlist',
        serviceCode: serviceCodeMap.get(item.companyName)},{xcFunc: 'FlightOrder'})">
              <svg-icon href="wodedingdan" class="icon"></svg-icon>
              <span>我的订单</span>
            </span>
            <span class="item" @click="loginFn(item.companyName,{hxFunc: 'approvelist',
        serviceCode: serviceCodeMap.get(item.companyName)},{xcFunc: 'AccreditOrder'})">
              <svg-icon href="dingdanshenpi" class="icon"></svg-icon>
              <span>订单审批</span>
            </span>
          </span>
          <van-button type="info" class="button" @click="loginFn(item.companyName,{hxFunc: 'commonflight',
        serviceCode: serviceCodeMap.get(item.companyName)},{xcFunc: 'FlightSearch'})">立即订票</van-button>
        </div>
        <div class="bottom" v-else>
          <span class="details">
            <span class="item" >
              <svg-icon href="wodedingdan" class="icon"></svg-icon>
              <span>我的订单</span>
            </span>
            <span class="item">
              <svg-icon href="dingdanshenpi" class="icon"></svg-icon>
              <span>订单审批</span>
            </span>
          </span>
          <van-button type="info" class="button">立即订票</van-button>
        </div>
      </div>
    </div>
    <van-overlay :show="phoneOverlayShow" @click="phoneOverlayShow = false">
      <div class="phone-wrapper" @click.stop>
        <span class="item" @click="callPhoneFn"><span class="text">呼叫&nbsp;&nbsp;&nbsp;&nbsp;{{callNumber}}</span></span>
        <a :href="phoneFn" ref="call" style="display:none"></a>
        <div class="item" @click="phoneOverlayShow = false">取消</div>
      </div>
    </van-overlay>
    <submit-form ref="submitForm" :action="ctripData.url"/>
  </div>
</template>

<script>
import Vue from 'vue'
import {
  Swipe,
  SwipeItem,
  Overlay
} from 'vant'
import { getH5Token, getH5Permission, getOneYearFlightInfoDetail, loginHx, loginXc } from '@/api/home/index'
import { TOKEN, OBTUSERNAME, OBTCODE, CATEGORYID, PERSONNAME, PERSONH5INFOMODEL } from '@/store/mutation-types'
import submitForm from '@/components/submitForm'
import qs from 'qs'
import clonedeep from 'lodash.clonedeep'

Vue.use(Swipe).use(SwipeItem).use(Overlay)
const serviceCodeMap = new Map([
  ['机票酒店-中航服', 'zhf'],
  ['阳光之旅', 'ygzl'],
  ['华宇航服', 'hyhf'],
  ['机票酒店-携程', 'xc'],
  ['空港嘉华', 'kgjh']
])
export default {
  components: {
    submitForm
  },
  data () {
    return {
      serviceCodeMap,
      year: '',
      mileage: '',
      minutesAndHoursAmountsStr: '',
      times: '',
      cityCounts: '',
      bg: require('../../assets/images/home/bg.png'),
      xiecheng: require('../../assets/images/home/xiecheng.png'),
      huayuhangfu: require('../../assets/images/home/huayuhangfu.png'),
      yangguangzhilv: require('../../assets/images/home/yangguangzhilv.png'),
      zhonghangfu: require('../../assets/images/home/zhonghangfu.png'),
      konggangjiahua: require('../../assets/images/home/konggangjiahua.png'),
      phoneOverlayShow: false,
      callNumber: '',
      airOrderCompanyFunctionModelList: [],
      ctripData: {}
    }
  },
  computed: {
    phoneFn () {
      return `tel:${this.callNumber}`
    }
  },
  created () {
    // this.$changePageTitle('机票预订')
    const search = qs.parse(window.location.search.replace(/^\?/, ''))
    if (process.env.NODE_ENV === 'development') {
      search.ticket = 'ST-7574-urz5t-ErTJcsL3l86b7HrKFh7uY-iz2zeix2sgagsdunlcyfxjz'
    }
    if (!search || !search.ticket) {
      if (Vue.ls.get(OBTUSERNAME)) {
        this.initFn()
      } else {
        this.$store.dispatch('removeLoading')
        this.$router.push({
          name: 'errorPage',
          params: {
            msg: location.href,
            title: '错误提示',
            showHome: true
          }
        })
      }
    } else {
      this.getH5TokenFn(search.ticket)
    }
  },
  methods: {
    async getH5TokenFn (ticket) {
      const data = {
        ticket
      }
      await getH5Token(data).then(res => {
        const obj = res.CommonModel.model
        Vue.ls.set(TOKEN, obj.token)
        Vue.ls.set(OBTCODE, obj.obtCode)
        Vue.ls.set(OBTUSERNAME, obj.obtUserName)
      })
      this.initFn()
    },
    initFn () {
      const params = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        token: Vue.ls.get(TOKEN)
      }
      getOneYearFlightInfoDetail(params).then(res => {
        this.year = res.CommonModel.model.year
        this.mileage = res.CommonModel.model.mileage
        this.minutesAndHoursAmountsStr = res.CommonModel.model.minutesAndHoursAmountsStr
        this.times = res.CommonModel.model.times
        this.cityCounts = res.CommonModel.model.cityCounts
      })
      const data = {
        obtUserName: Vue.ls.get(OBTUSERNAME),
        obt_code: Vue.ls.get(OBTCODE),
        token: Vue.ls.get(TOKEN)
      }
      getH5Permission(data).then(res => {
        Vue.ls.set(CATEGORYID, res.CommonModel.model.personH5InfoModel.categoryId)
        Vue.ls.set(PERSONNAME, res.CommonModel.model.personH5InfoModel.userName)
        Vue.ls.set(PERSONH5INFOMODEL, res.CommonModel.model.personH5InfoModel)
        const obj = clonedeep(res.CommonModel.model)
        this.airOrderCompanyFunctionModelList = obj.airOrderCompanyFunctionModelList
        this.airOrderCompanyFunctionModelList.forEach(ele => {
          ele.latestFlightOrderDetailMap = obj.latestFlightOrderDetailMap[ele.companyId]
        })
      })
    },
    checkLogo (name) {
      const logoMmap = new Map(
        [
          ['机票酒店-中航服', this.zhonghangfu],
          ['阳光之旅', this.yangguangzhilv],
          ['华宇航服', this.huayuhangfu],
          ['机票酒店-携程', this.xiecheng],
          ['空港嘉华', this.konggangjiahua]
        ]
      )
      return logoMmap.get(name)
    },
    callFn (phone) {
      this.callNumber = phone
      this.phoneOverlayShow = true
    },
    callPhoneFn () {
      this.$refs.call.click()
      this.phoneOverlayShow = false
    },
    toComanyDetail (companyName) {
      this.$router.push(
        { path: '/home/detailCompany', query: { companyName } }
      )
    },
    loginFn (companyName, HXparams, XCparams) {
      this.$store.dispatch('addLoading')
      if (companyName === '机票酒店-携程') {
        this.loginXcFn(XCparams)
      } else {
        this.loginHxFn(HXparams)
      }
    },
    loginHxFn (params) {
      const data = {
        categoryId: Vue.ls.get(CATEGORYID),
        obtUserName: Vue.ls.get(OBTUSERNAME),
        hxFunc: 'approvelist',
        callBack: location.href,
        serviceCode: 'zhf'
      }
      Object.assign(
        data, params
      )
      loginHx(data).then(res => {
        this.ctripData = res.commonModel
        this.$refs.submitForm.submit(res.commonModel)
      }).catch(e => {
        console.error(e)
      })
    },
    loginXcFn (params) {
      const data = {
        categoryId: Vue.ls.get(CATEGORYID),
        obtUserName: Vue.ls.get(OBTUSERNAME),
        xcFunc: 'FlightOrder',
        callBack: location.href,
        orderType: 2
      }
      Object.assign(
        data, params
      )
      loginXc(data).then(res => {
        this.ctripData = res.commonModel
        this.$refs.submitForm.submit(res.commonModel)
      }).catch(e => {
        console.error(e)
      })
    }
  },
  filters: {
    NameMapping (value) {
      let str = value
      switch (value) {
        case '机票酒店-中航服':
          str = '中航服'
          break
        case '机票酒店-携程':
          str = '携程'
          break
      }
      return `${str}`
    }
  }
}
</script>

<style scoped lang="less">
.bg-img{
  width: 100vw;
  position: absolute;
  z-index: -1;
}
.tag-year{
  padding-left: 6px;
  width: 58px;
  height: 24px;
  font-size: 10px;
  color: #fff;
  display: flex;
  align-items: center;
  background: #5D8EFF;
  border-radius: 1px 1px 9px 1px;
  .icon{
    margin-left: 5px;
    width: 13px;
    height: 13px;
  }
}
.total{
  padding-top: 16px;
  display: flex;
  .item{
    width: 25%;
    display: flex;
    flex-direction: column;
    span{
      text-align: center;
      &:nth-child(1){
        line-height: 16px;
        font-size: 12px;
        color: rgba(255, 255, 255, 0.5);
      }
      &:nth-child(2){
        margin-top: 5px;
        line-height: 22px;
        font-size: 16px;
        color: #fff;
      }
    }
  }
}
.list{
  height: 510px;
  overflow: auto;
  margin-top: 20px;
  padding: 0 8px;
  & > .item{
    margin-bottom: 8px;
    padding: 8px 15px;
    background: #FFFFFF;
    box-shadow: 0px 0px 7px 0px rgba(101, 107, 121, 0.14);
    border-radius: 4px;
    .top{
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title{
        display: flex;
        align-items: center;
        .logo{
          margin-right: 5px;
          width: 27px;
          height: 27px;
        }
        .name{
          font-weight: bold;
          font-size: 15px;
          color: #13171C;
        }
      }
      .phone{
        width: 16px;
        height: 16px;
      }
    }
    .info{
      margin-top: 5px;
      display: flex;
      .status{
        margin-right: 8px;
        font-size: 12px;
        font-weight: bold;
        color: #75797D;
      }
      .content{
        flex: 1;
        font-size: 13px;
        color: #52585D;
        .range{
          margin-left: 8px;
        }
      }
    }
    .bottom{
      margin-top: 8px;
      display: flex;
      justify-content: space-between;
      .details{
        display: flex;
        align-items: center;
        .item{
          color: #2D6DFF;
          display: flex;
          align-items: center;
          &:nth-child(1){
            margin-right: 16px;
          }
          .icon{
            margin-right: 4px;
            width: 14px;
            height: 14px;
          }
        }
      }
      .button{
        border: 0;
        width: 106px;
        height: 32px;
        background: rgba(45, 109, 255, 0.09);
        border-radius: 8px;
        font-size: 12px;
        color: #2D6DFF;
      }
    }
  }
}
/deep/.van-notice-bar{
  background-color: #fff;
  padding: 0;
  height: 20px;
  width: 100%;
  // color: #52585D;
  // font-size: 13px;
  .van-notice-bar__wrap{
    .van-notice-bar__content{
      .notice-swipe{
        height: 20px;
      }
    }
  }
  .van-icon{
    display: none;
  }
}
.gray{
  filter: grayscale(100%);
  .van-button:active::before{
    opacity: 0;
  }
}
</style>
