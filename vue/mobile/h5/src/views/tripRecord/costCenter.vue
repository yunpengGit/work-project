<template>
  <div class="box">
    <van-search
      v-model="value"
      placeholder="请输入搜索关键词"
      show-action
      shape="round"
      @search="onSearch"
    >
      <div slot="action" @click="onSearch">搜索</div>
    </van-search>
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="我是有底线的"
      @load="onLoad"
    >
      <ul class="content-list">
        <li v-for="(item, index) in list" :key="index" @click="changeCost(item.costName)">{{item.costName}}</li>
      </ul>
    </van-list>
  </div>
</template>

<script>
import Vue from 'vue'
import { Sticky, NavBar, Search, PullRefresh, List, Cell, Dialog, Toast } from 'vant'
import { getCostCenterList, changeCost } from '@/api/tripRecord/costCenter'
import { TOKEN, OBTUSERNAME, CATEGORYID } from '@/store/mutation-types'

Vue.use(Sticky).use(NavBar).use(Search).use(PullRefresh).use(List).use(Cell)
export default {
  data () {
    return {
      url: '',
      journeyId: '',
      value: '',
      list: [],
      loading: false,
      finished: false,
      pageNum: 1,
      pageSize: 10
    }
  },
  created () {
    // this.$changePageTitle('成本中心')
    this.journeyId = this.$route.query.journeyId
  },
  methods: {
    onLoad () {
      this.onSearch(1)
      this.pageNum = this.pageNum++
    },
    onSearch (type) {
      if (type !== 1) {
        this.pageNum = 1
      }
      getCostCenterList(
        {
          obtUserName: Vue.ls.get(OBTUSERNAME),
          categoryId: Vue.ls.get(CATEGORYID),
          token: Vue.ls.get(TOKEN),
          journeyId: this.journeyId,
          costName: this.value,
          pageNum: this.pageNum,
          pageSize: this.pageSize
        }
      ).then(res => {
        if (type === 1) {
          // 下拉刷新
          this.list = this.list.concat(res.page.list)
          this.loading = false
        } else {
          // 查询
          this.list = res.page.list
          this.loading = false
        }
        if (this.pageNum === res.page.totalPage) {
          this.finished = true
        }
      }).catch(e => {
        console.error(e)
      })
    },
    changeCost (costName) {
      Dialog.confirm({
        title: '提示',
        message: '是否确认修改成本中心'
      }).then(() => {
        changeCost({
          obtUserName: Vue.ls.get(OBTUSERNAME),
          categoryId: Vue.ls.get(CATEGORYID),
          token: Vue.ls.get(TOKEN),
          journeyId: this.journeyId,
          cost: costName
        }).then(res => {
          const { state, resultStr } = res.CommonModel
          if (state !== 1) {
            Toast(resultStr)
          } else {
            this.$router.back(-1)
          }
        }).catch(e => {
          console.error(e)
        })
      }).catch(() => {
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .box{
    /deep/.van-search{
      box-sizing: content-box;
      height: 30px;
      .van-search__content{
        height: 30px;
        .van-field__left-icon{
          display: flex;
          justify-content: center;
          align-items: center;
          .van-icon{
            font-size:12px;
          }
        }
        .van-field__body{
          height: 20px;
          font-size: 12px;
        }
      }
      .van-search__action{
        padding: 16px;
        font-size: 14px;
      }
    }
    .content-list{
      padding: 8px 8px 0;
      background-color: #fff;
      li{
        display: flex;
        align-content: center;
        padding: 16px 8px 8px;
        font-size: 14px;
        color: #4A4A4A;
        & + li{
          border-top: 1px solid #DAE3EA;
        }
      }
    }
  }
</style>
