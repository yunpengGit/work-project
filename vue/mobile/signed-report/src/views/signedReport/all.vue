<template>
  <div class="all-box">
    <FilterBox :showFilter="showFilter" :active="active" @closeFn="closeFilter" @filterFn="filterFn"/>
    <van-tabs v-model="active" @change="tabChange">
      <van-tab title="本单位收文">
        <ListAll :config="allReceived" ref="allReceived" :active="active"/>
      </van-tab>
      <van-tab title="本单位发文">
        <ListAll :config="allPost" ref="allPost" :active="active"/>
      </van-tab>
    </van-tabs>
    <span class="filter" @click="showFilterFn"><SvgIcon href="shaixuan" class="icon"/></span>
    <div class="btn-box">
      <van-button plain type="primary" class="btn" @click="newRost('post')" v-show="showPostBtn">拟稿</van-button>
      <van-button plain type="info" class="btn" @click="newRost('received')" v-show="showReceivedBtn">收文登记</van-button>
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
import { Tab, Tabs, Button } from 'vant'
import ListAll from './ListAll'
import Filter from './Filter'
import api from '@a/signedReport'
Vue.use(Tab)
  .use(Tabs)
  .use(Button)
export default {
  data () {
    return {
      active: +(window.localStorage.getItem('setAllTabActive') || 0),
      showFilter: false,
      allReceived: {
        initFn: 'getAllReceived'
      },
      allPost: {
        initFn: 'getAllPost'
      },
      showReceivedBtn: false,
      showPostBtn: false
    }
  },
  created () {
    // document.querySelector('head > title').innerHTML = '签报'
    this.btnFn()
  },
  methods: {
    async btnFn () {
      console.log(1)
      let data
      await api.getCanCreate().then((res) => {
        data = res.data
      }).catch(err => {
        let msg = new Error(err)
        console.error(msg)
      })
      if (data && data[0]) {
        this.showReceivedBtn = data[0].reveiveCreate === 'Y'
        this.showPostBtn = data[0].sendCreate === 'Y'
      }
    },
    tabChange (val) {
      window.localStorage.setItem('setAllTabActive', val)
    },
    search (val) {
      const refArr = ['allReceived', 'allPost']
      this.$refs[refArr[this.active]].onload(val)
    },
    cancel () {
      // const refArr = ['allReceived', 'allPost']
      this.resetFn()
      // this.$refs[refArr[this.active]].onload(undefined, true)
    },
    filterFn (params, active) {
      const refArr = ['allReceived', 'allPost']
      // 筛选类型全部加载当前默认
      if (active !== '' && active !== -1) {
        this.active = active
      }
      // 处理筛选对象参数
      this.$refs[refArr[this.active]] && this.$refs[refArr[this.active]].onload(params, true)
    },
    closeFilter () {
      this.showFilter = false
    },
    showFilterFn () {
      this.showFilter = true
    },
    newRost (type) {
      this.$store.dispatch('setReceivedOrPost', type)
      this.$router.push('/templateSort')
    },
    resetFn () {
      const refArr = ['allReceived', 'allPost']
      // console.log(refArr[this.active])
      this.$refs[refArr[this.active]] && this.$refs[refArr[this.active]].onload()
    }
  },
  components: {
    ListAll,
    'FilterBox': Filter
  }
}
</script>
<style scoped lang="less">
.box{
  display: flex;
}
.all-box{
  /deep/.van-tabs__line{
    background-color: transparent;
  }
  /deep/.van-tab--active{
    font-weight: 600;
    color: #1E89FF;
  }
  /deep/ .van-tabs__content{
    margin-top: 88px;
  }
  /deep/.van-tabs--line .van-tabs__wrap{
    padding-right: 50px;
    height: 40px;
    top: 48px;
  }
}
.all-box{
  position: relative;
  .filter{
    background-color: #fff;
    position: fixed;
    top: 48px;
    right: 0;
    z-index: 2;
    height: 40px;
    width: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    overflow: hidden;
    &::before{
      position: absolute;
      top: 10px;
      left: 0;
      display: flex;
      content: '';
      width: 1px;
      height: 20px;
      background-color: #E7E7E7;
    }
    .icon{
      width: 18px;
      height: 18px;
    }
  }
}
.btn-box{
  width: 100vw;
  position: fixed;
  left: 0;
  bottom: 0;
  background-color: #fff;
  display: flex;
  justify-content: space-around;
  align-items: center;
  .btn{
    flex-grow: 1;
    border: 0;
    color: rgb(30, 137, 255);
  }
}
</style>
