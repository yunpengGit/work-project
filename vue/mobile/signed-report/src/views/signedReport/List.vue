<template>
  <van-list
    class="list"
    v-model="loading"
    :finished="finished"
    finished-text="没有更多了"
    :error.sync="error"
    error-text="请求失败，点击重新加载"
    @load="onload"
  >
    <div class="item" v-for="(item, index) in list" :key="index" @click="clickFn(item)">
      <div class="top">
          <span class="title"><span class='urgent'>{{item.level === '1'?'[紧急]':item.level === '2'?'[急]':''}}</span>{{item.subject}}</span>
        </div>
        <div class="bottom">
          <img :src="item.photo" alt="" class="header">
          <span class="name">{{item.name}}</span>
          <span class="date">{{item.time}}</span>
          <span class="approval">{{item.node}}</span>
        </div>
    </div>
  </van-list>
</template>

<script>
import Vue from 'vue'
import { List, Toast } from 'vant'
import api from '@a/signedReport'
// if (process.env.NODE_ENV === 'development') {
//   require('@m/signedReport')
// }
Vue.use(List)
export default {
  props: {
    config: {
      type: Object
    }
  },
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      pageno: 1
    }
  },
  created () { this.onload() },
  methods: {
    clickFn (item) {
      const link = item.link
      // this.$router.push({ path: '/' + link })
      window.location.href = link
    },
    onload (fdSubject) {
      let pageno = this.pageno
      if (fdSubject) {
        pageno = 1
      }
      let data = fdSubject ? { fdSubject } : { pageno }
      api[this.config.initFn](data).then((res) => {
        if (pageno > 1) {
          if (res.data && res.data.length > 0) {
            this.list = [...this.list, ...res.data]
          }
        } else {
          // this.finished = true
          if (res.data && res.data.length > 0) {
            this.list = res.data
          } else {
            this.list = []
            Toast('没有对应数据')
          }
        }
        this.loading = false
        this.pageno = ++this.pageno
        if (this.list.length >= res.totalrows) {
          this.finished = true
        }
      }).catch((e) => {
        this.error = true
      })
    },
    onloadInit () {
      this.pageno = 1
      this.onload()
    }
  }
}
</script>

<style scoped lang="less">
.list{
  height: calc(100vh - 40px);
  overflow: auto;
}
 .item{
    padding: 12px 16px;
    box-shadow:0px 0px 0px 0px rgba(197,206,216,1);
    border-bottom: 1px solid #C5CED8;
    background-color: #fff;
    &:last-child{
      border-bottom: 0;
    }
    .top{
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      .title{
        flex: 1;
        font-size:16PX;
        color:rgba(0,14,32,1);
        line-height:20px;
        .urgent{
          color: #E3593D;
        }
      }
    }
    .bottom{
      margin-top: 12px;
      display: flex;
      align-items: center;
      .header{
        margin-right: 8px;
        width: 24px;
        height: 24px;
        border-radius: 50%;
      }
      .name{
        margin-right: 24px;
        flex-shrink: 0;
        max-width: 64px;
        font-size:13PX;
        font-weight:500;
        color:rgba(148,155,164,1);
        line-height:16px;
      }
      .date{
        margin-right: 24px;
        flex-shrink: 0;
        width: 80px;
        font-size:13PX;
        color:rgba(148,155,164,1);
        line-height:20px;
      }
      .approval{
        font-size:13PX;
        color:rgba(148,155,164,1);
        line-height:16px;
      }
    }
  }
</style>
