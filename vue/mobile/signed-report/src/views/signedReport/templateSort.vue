<template>
    <div class="box">
      <div class="left">
        <span
          class="first-class"
          v-for="(item, index) in firstClassList"
          :key="item.value"
          :class="{'active': newIndex === index}"
          @click="detail(item, index)"
        >
          <span class="name">{{item.text}}</span>
          <SvgIcon href="youjiantou" class="icon"/>
        </span>
      </div>
      <div class="right">
        <van-radio-group v-model="chosen">
          <van-radio v-for="(item) in secondClassList" :key="item.value" :name="item.value">
            <span class="name">{{item.text}}</span>
          </van-radio>
        </van-radio-group>
      </div>
      <div class="btn-box">
        <van-button plain type="info" @click="cancle">取消</van-button>
        <van-button type="info" @click="newSort">确定</van-button>
      </div>
    </div>
</template>

<script>
import Vue from 'vue'
import { RadioGroup,
  Radio, Button } from 'vant'
import api from '@a/signedReport'

Vue.use(Radio)
  .use(RadioGroup)
  .use(Button)
export default {
  data () {
    return {
      isActive: false,
      newIndex: 0,
      chosen: '',
      firstClassList: [],
      secondClassList: []
    }
  },
  created () {
    this.init()
  },
  methods: {
    cancle () {
      this.chosen = ''
    },
    async init () {
      await this.initSort()
      this.initSortDetail()
    },
    async initSort () {
      const receivedOrPost = this.$store.state.signedReport.receivedOrPost
      let method = 'getReceivedSort'
      if (receivedOrPost === 'post') {
        method = 'getPostSort'
      }
      await api[method]({}).then((res) => {
        this.firstClassList = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    initSortDetail (categoryId) {
      const receivedOrPost = this.$store.state.signedReport.receivedOrPost
      let method = 'getReceivedSort'
      if (receivedOrPost === 'post') {
        method = 'getPostSort'
      }
      const isType = type => obj => Object.prototype.toString.call(obj) === `[object ${type}]`
      const isUndefined = isType('Undefined')
      if (isUndefined(categoryId)) {
        categoryId = this.firstClassList && this.firstClassList[0].value
      }
      api[method]({
        categoryId
      }).then((res) => {
        this.secondClassList = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    detail (item, index) {
      this.newIndex = index
      const categoryId = item.value
      this.initSortDetail(categoryId)
    },
    newSort () {
      if (this.chosen === '') {
        return
      }
      const receivedOrPost = this.$store.state.signedReport.receivedOrPost
      const fdTemplateId = this.chosen
      let link = '/km/imissive/km_imissive_receive_main/kmImissiveReceiveMain.do?method=add&mobile=true&fdTemplateId=' + fdTemplateId
      if (receivedOrPost === 'post') {
        link = '/km/imissive/km_imissive_send_main/kmImissiveSendMain.do?method=add&mobile=true&fdTemplateId=' + fdTemplateId
      }
      // window.open(link, '_blank')
      window.location.href = link
    }
  }
}
</script>

<style scoped lang="less">
* {
  box-sizing: border-box;
}
.box{
  display: flex;
  background-color: #fff;
  .left{
    width: 144px;
    min-height: 100vh;
    flex-shrink: 0;
    background:rgba(250,255,255,1);
    background:linear-gradient(270deg,rgba(194,239,239,0.3) 0%,rgba(253,255,255,0) 100%);
    display: flex;
    flex-direction: column;
    .first-class{
      padding: 0 12px;
      height: 48px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name{
        width: 105px;
        font-size:15px;
        color:rgba(4,16,31,1);
        line-height:18px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
      }
      .icon{
        width:12px;
        height:18px;
      }
      &.active{
        background:rgba(236,249,255,1);
      }
    }
  }
  .right{
    flex: 1;
    min-height: 100vh;
    /deep/.van-radio{
      padding-left: 14px;
      height: 58px;
      &:last-child{
        .van-radio__label{
          .name{
            border-bottom: 0;
          }
        }
      }
      .van-radio__label{
        flex: 1;
        height: 100%;
        .name{
          padding-right: 14px;
          height: 100%;
          display: flex;
          align-items: center;
          font-size:17px;
          color:rgba(4,16,31,1);
          line-height:20px;
          border-bottom: 1px #C5CED8 solid;
        }
      }
    }
  }
  .btn-box{
    width: 100vw;
    height: 64px;
    background-color: #fff;
    position: fixed;
    left: 0;
    bottom: 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    .van-button{
      width:175px;
      height:44px;
      border-radius:8px;
    }
  }
}
</style>
