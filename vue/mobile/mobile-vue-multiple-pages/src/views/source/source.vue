<template>
    <div>
      <div class="tip">*您可前往会员中心 >> 公开寻源商机进行报价</div>
      <van-list
        v-model="loading"
        :finished="finished"
        finished-text="没有更多数据了"
        @load="onLoad"
        :error.sync="error"
        error-text="请求失败，点击重新加载"
      >
        <div class="list" v-for="(item, index) in data" :key="index">
          <div class="title">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#qi"></use>
            </svg>
            <span class="name">{{item.openSourceAskDetailBOS[0].purchaserName}}</span>
          </div>
          <div class="content">
            <div class="project" v-for="(projectItem, projectInd) in item.openSourceAskDetailBOS" :key="projectInd">
              <div class="name-box">
                <span><span class="name">{{projectItem.prodSiginstName}}</span><span class="num">（{{projectItem.buyNum}}{{projectItem.measureName}}）</span></span><span :class="[askSheetStatusClassMap.get(projectItem.askSheetStatus)]" class="state">{{askSheetStatusMap.get(projectItem.askSheetStatus)}}</span>
              </div>
              <div class="item doc">
                <div>规格描述：</div><div>{{projectItem.prodSiginstPropDesc}}</div>
              </div>
              <div class="item start-time">
                <div>发布时间：</div><div>{{projectItem.crtTime | formatDate}}</div>
              </div>
              <div class="item stop-time">
                <div>报价截止时间：</div><div>{{projectItem.answerEndTime | formatDate}}</div>
              </div>
            </div>
          </div>
        </div>
      </van-list>
    </div>
</template>

<script>
import Vue from 'vue'
import { List, Toast } from 'vant'
import 'lib-flexible'
if (process.env.NODE_ENV === 'development') {
  require('./../../../mock/data.js')
}
Vue.use(List).use(Toast)

const askSheetStatusMap = new Map([
  [0, '询价中'],
  [1, '未成交'],
  [2, '已成交'],
  [3, '已取消'],
  [4, '询价结束']
])
const askSheetStatusClassMap = new Map([
  [0, 'green'],
  [1, 'orange'],
  [2, 'blue'],
  [3, 'gray'],
  [4, 'red']
])
export default {
  data () {
    return {
      baseUrl: '',
      randomCode: '',
      origin: '',
      pageNo: 1,
      pageSize: 10,
      recordsTotal: '',
      askSheetStatusMap,
      askSheetStatusClassMap,
      loading: false,
      finished: false,
      error: false,
      data: []
    }
  },
  methods: {
    onLoad () {
      if (this.pageNo > 1 && this.recordsTotal <= 10) {
        this.loading = false
        return
      }
      this.randomCode = location.href.split('?')[1]
      this.origin = location.href.split('/rest')[0]
      if (process.env.NODE_ENV !== 'development') {
        this.url = this.origin
      }
      this.$http({
        url: this.url + '/rest/inquirePrice/viewSource',
        method: 'POST',
        data: {
          randomCode: this.randomCode,
          pageNo: this.pageNo,
          pageSize: this.pageSize
        }
      }).then((res) => {
        console.log(res)
        if (res.respCode === '0000') {
          this.recordsTotal = res.recordsTotal
          this.dataList(res.data)
          if (res.recordsFiltered < this.pageSize) {
            this.finished = true
          }
          this.loading = false
          this.pageNo += 1
        } else {
          this.loading = false
          this.error = true
          Toast(res.respDesc)
        }
      }).catch((e) => {
        this.loading = false
        this.error = true
        console.error(e)
      })
    },
    dataList (data) {
      this.$nextTick(() => {
        if (this.data.length === 0) {
          this.data = data
        } else {
          let lastIndex = this.data.length - 1
          data.forEach((item, index) => {
            if (index === 0 && item.purchaserId === this.data[lastIndex].purchaserId) {
              this.data[lastIndex].openSourceAskDetailBOS = [
                ...this.data[lastIndex].openSourceAskDetailBOS,
                ...item.openSourceAskDetailBOS
              ]
            } else {
              this.data = [
                ...this.data,
                item
              ]
            }
          })
        }
      })
    }
  },
  created () {
    this.randomCode = location.href.split('?')[1]
    this.origin = location.href.split('/rest')[0]
    if (process.env.NODE_ENV !== 'development') {
      this.url = this.origin
    }
    this.$http({
      url: this.url + '/rest/inquirePrice/checkStatistics',
      method: 'post',
      data: {
        randomCode: this.randomCode
      }
    }).then((res) => {
      if (JSON.parse(res.mdata)) {
        let hm = document.createElement('script')
        hm.src = 'https://hm.baidu.com/hm.js?36da93c0d6913be8eb77c50f23df7e18'
        let s = document.getElementsByTagName('script')[0]
        s.parentNode.insertBefore(hm, s)
      }
    }).catch((e) => {
      console.error(e)
    })
  },
  filters: {
    formatDate: function (value) {
      let date = new Date(value)
      let y = date.getFullYear()
      let MM = date.getMonth() + 1
      MM = MM < 10 ? ('0' + MM) : MM
      let d = date.getDate()
      d = d < 10 ? ('0' + d) : d
      let h = date.getHours()
      h = h < 10 ? ('0' + h) : h
      let m = date.getMinutes()
      m = m < 10 ? ('0' + m) : m
      let s = date.getSeconds()
      s = s < 10 ? ('0' + s) : s
      return y + '-' + MM + '-' + d + ' ' + h + ':' + m + ':' + s
    }
  }
}
</script>

<style scoped lang="scss">
.tip{
  height:68px;
  background:rgba(50,118,255,0.87);
  font-size:22px;
  font-weight:400;
  color:rgba(255,255,255,1);
  line-height:68px;
  text-align: center;
}
.list{
  & + & {
    margin-top: 22px;
  }
  .title{
    padding: 24px 36px;
    background:rgba(255,255,255,1);
    box-shadow:0px 4px 12px 0px rgba(50,118,255,0.14);
    position: relative;
    z-index: 1;
    .icon{
      padding-top: 2px;
      width:42px;
      height:40px;
      vertical-align: top;
    }
    .name{
      margin-left: 12px;
      height:42px;
      font-size:32px;
      max-width: 600px;
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color:#4A4A4A;
      line-height:42px;
      vertical-align: top;
    }
  }
  .content{
    .project{
      padding: 23px 32px 22px 34px ;
      background-color: #fff;
      & + &{
        margin-top: 1px;
      }
      & > .name-box{
        display: flex;
        height:42px;
        font-size:30px;
        font-weight:500;
        color:#333333;
        line-height:42px;
        justify-content: space-between;
        .name{
          font-weight: bold;
          display: inline-block;
          max-width: 400px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          vertical-align: top;
        }
        .num{
          font-weight: bold;
        }
        .state{
          height:33px;
          font-size:24px;
          line-height:33px;
        }
        .green{
          color:#34CF50;
        }
        .orange{
          color:#F5A623;
        }
        .blue{
          color:#377AF7;
        }
        .red{
          color:#EB5A2F;
        }
        .gray{
          color:#9B9B9B;
        }
      }
      .item{
        display: flex;
        padding-right: 138px;
        & > div:first-child{
          width: 170px;
          flex-shrink: 0;
          color:#ACACAC;
        }
      }
      .doc{
        margin-top: 30px;
        font-size:26px;
        line-height:37px;
        & > div:nth-child(2){
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
          color:#333333;
        }
      }
      .start-time{
        margin-top: 27px;
        font-size:22px;
        line-height:24px;
          & > div:nth-child(2){
            color:#4A4A4A;
            line-height:24px;
          }
      }
      .stop-time{
        margin-top: 14px;
        font-size:22px;
        line-height:24px;
        & > div:nth-child(2){
          font-size:22px;
          color:#EB5A2F;
          line-height:24px;
        }
      }
    }
  }
}
</style>
