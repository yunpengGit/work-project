<template>
  <div :class="['ctrip-content', { hotel: isHotel }]">
    <van-nav-bar v-if="showHead" title="携程" left-arrow @click-left="back"></van-nav-bar>
    <div class="banner" flex="main:around">
      <div flex="dir:column cross:center" @click="toFlightOrder">
        <div class="icon" flex="main:center cross:center">
          <svg-icon href="iconjiudiandingdan" />
        </div>
        <p>{{ isHotel ? "酒店" : "机票" }}订单</p>
      </div>
      <div flex="dir:column cross:center" @click="toApprove">
        <div class="icon" flex="main:center cross:center">
          <svg-icon href="iconshenpidingdan" />
        </div>
        <p>订单审批</p>
      </div>
    </div>
    <div class="content">
      <div class="air-order item flight" flex="main:between cross:center">
        <span flex="cross:center" flex-item="1">
          {{ isHotel ? "酒店" : "机票" }}预订
          <svg-icon v-if="isHotel" href="iconjiudianyuding" />
          <svg-icon v-else href="iconfeiji" />
        </span>
        <van-button plain type="info" size="small" @click="addOrder">
          立即预订
        </van-button>
      </div>
      <div class="footer-img" flex="main:center">
        <img src="../../image/xiecheng/xc_bottom_icon.png" alt="" />
      </div>
    </div>

    <!--对接中航服，不要删除-->
    <dy-form ref="HXForm" :action="ctripData.url" />
    <!--对接中航服，不要删除-->
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Icon, Button, Toast } from 'vant'
import DyForm from '@/components/DyForm'
import api from '@/api'

Vue.use(NavBar).use(Icon).use(Button).use(Toast)

export default {
  components: { DyForm },
  data () {
    return {
      showHead: process.env.VUE_APP_SHOW_HEDE === 'true',
      ctripData: {
        url: '',
        isHotel: false,
        param: {
          accessuserid: '',
          appid: '',
          callback: '',
          corppaytype: '',
          employeeid: '',
          initpage: '',
          token: ''
        }
      }
    }
  },
  created () {
    // this.$store.dispatch('removeLoading')
    this.isHotel = this.$route.query.type && this.$route.query.type === 'hotel'
  },
  methods: {
    back () {
      if (this.$route.query.orderType) {
        this.$router.replace('/private')
      } else {
        this.$router.replace('/')
      }
    },
    toFlightOrder () { // 获取机票订单
      this.getCtripInfo('orderlist')
    },
    toApprove () { // 获取订单审批
      this.getCtripInfo('approvelist')
    },
    addOrder () {
      this.getCtripInfo('commonflight')
    },
    // 获取携程信息接口
    getCtripInfo (hxFunc) {
      this.$store.dispatch('addLoading')
      let serviceCode = this.$route.params.serviceCode
      // console.log(serviceCode)
      api.loginHx({
        categoryId: JSON.parse(window.localStorage.getItem('userInfo')).categoryId,
        obtUserName: JSON.parse(window.localStorage.getItem('userInfo')).tel,
        hxFunc,
        businessType: 1, // 业务类型    1: 机票 2: 火车票
        callBack: location.href,
        serviceCode
      }).then(async res => {
        setTimeout(() => {
          this.$store.dispatch('removeLoading')
        }, 3000)
        this.ctripData = res.commonModel
        await this.$refs.HXForm.submit(res.commonModel.param)
        // this.$store.dispatch('removeLoading')
      }).catch(e => {
        console.error(e)
        this.$store.dispatch('removeLoading')
      })
    }
  }
}
</script>
<style lang="less" scoped>
@import "~vant/es/style/var";

.ctrip-content {
  width: 100vw;
  height: 100vh;
  background: white;
}

.banner {
  background-color: #0188cc;
  background-image: url("../../image/xiecheng/xc_ticket_bg.png");
  background-repeat: no-repeat;
  background-size: cover;
  color: white;
  padding: 30px 0 10px;
  font-size: 13px;
  .icon {
    background: white;
    width: 70px;
    height: 70px;
    border-radius: 50%;
    font-size: 28px;
  }
}

.content {
  padding: 8px 4px;
  color: white;

  .air-order {
    padding-top: 22px;
    padding-bottom: 22px;
    padding: 24px 8px;
    border-radius: 8px;
    font-size: 14px;
    background-color: #0188cc;
    background-image: url("../../image/xiecheng/xc_ticket_yuding.png");
    background-repeat: no-repeat;
    background-size: cover;

    button {
      border-radius: 8px;
    }
    .icon {
      width: 20px;
      height: 20px;
      margin-left: 10px;
    }
  }
}

.hotel {
  .air-order {
    background-image: url("../../image/xiecheng/xc_hotel_yuding.png");
  }
}
.footer-img {
  position: fixed;
  bottom: 80px;
  width: 100%;
  img {
    width: 150px;
    height: 61px;
  }
}
</style>
