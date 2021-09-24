<template>
  <div class="box">
    <van-tabs v-model="active" class="tab" @change="tabChange">
      <van-tab title="待办">
        <Upcoming ref="upcoming"/>
      </van-tab>
      <van-tab title="待阅">
        <Unread ref="unread"/>
      </van-tab>
      <van-tab title="所有签报">
        <All ref="all"/>
      </van-tab>
    </van-tabs>
    <div class="search" @click="showSearchFn"><SvgIcon href="chaxun" class="icon"/></div>
    <van-search
      class="search-input"
      v-show="showSearch"
      v-model="value"
      show-action
      placeholder="请输入搜索关键词"
      @search="onSearch"
      @cancel="onCancel"
    />
  </div>
</template>

<script>
import Vue from 'vue'
import { Tab, Tabs, Search } from 'vant'
import Upcoming from './upcoming'
import Unread from './unread'
import All from './all'
// import api from '@a/signedReport'
// if (process.env.NODE_ENV === 'development') {
//   require('@m/signedReport')
// }
Vue.use(Tab)
  .use(Tabs)
  .use(Search)
export default {
  data () {
    return {
      active: +(window.localStorage.getItem('setTabActive') || 0),
      value: '',
      showSearch: false,
      isReset: false
    }
  },
  created () {
  },
  methods: {
    tabChange (val) {
      window.localStorage.setItem('setTabActive', val)
      this.$store.dispatch('setTabActive', val)
    },
    showSearchFn () {
      this.showSearch = true
    },
    onSearch (val) {
      const refArr = ['upcoming', 'unread', 'all']
      // console.log(refArr[this.active])
      this.$store.dispatch('setSearchText', val)
      this.$refs[refArr[this.active]].search(val)
    },
    onCancel () {
      this.$store.dispatch('setSearchText', '')
      const refArr = ['upcoming', 'unread', 'all']
      console.log(refArr[this.active])
      this.$refs[refArr[this.active]] && this.$refs[refArr[this.active]].cancel()
      this.showSearch = false
    }
  },
  components: {
    Upcoming,
    Unread,
    All
  }
}
</script>

<style scoped lang="less">
/deep/.van-tabs__wrap{
  border-bottom: 1px solid #C5CED8;
}
/deep/.van-tabs__line{
  background-color: #1E89FF;
}
/deep/.van-tab--active{
  font-weight: 600;
}
/deep/.van-tab{
  color: #04101F;
}
/deep/ .van-tabs--line .van-tabs__wrap{
  padding-right: 50px;
  height: 48px;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 2;
}
/deep/ .van-tabs__content{
  margin-top: 48px;
}
.box{
  position: relative;
  .search{
    position: fixed;
    top: 0;
    right: 0;
    z-index: 2;
    height: 48px;
    width: 50px;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    border-left: 1px solid #C5CED8;
    .icon{
      width: 20px;
      height: 20px;
    }
  }
  .search-input{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 48px;
    z-index: 2;
  }
}
</style>
