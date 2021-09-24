<template>
  <div>
    <van-nav-bar left-arrow title="行程记录" @click-left="back">
      <div class="color-white" slot="right" flex="cross:center">
        <span class="btn" @click="showCheck = !showCheck">{{showCheck?'取消':'批量'}}</span>
        <svg-icon class="search-icon" @click.native="toSearch" href="iconsousuo-" />
      </div>
    </van-nav-bar>
    <div :class="['content', {'has-check-box':showCheck}]">
      <van-tabs v-model="listParam.tickettype" type="card" class="tabs" color="#0188CC">
        <van-tab :name="0" title="国内机票"></van-tab>
        <van-tab :name="1" title="国际机票"></van-tab>
      </van-tabs>
      <van-pull-refresh class="pull-refresh__head" v-model="refreshLoading" @refresh="onRefresh">
        <van-list
          v-model="loading"
          :finished="finished"
          finished-text="没有更多了"
          @load="onLoad"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
        >
          <list-item
            :show-check-box="showCheck"
            v-for="item in list"
            :checkDisable="checkDisable"
            :isChecked.sync="item.checked"
            :key="item.id"
            :item="item"
            @confirmItem="deleteItem(item)"
            @deleteItem="deleteItem(item)"
          />
        </van-list>
      </van-pull-refresh>
    </div>
    <FooterAction
      :show="showCheck"
      :data="checkedList"
      @needRefresh="footerAction"
      @check="checkAll"
    />
  </div>
</template>
<script>
import Vue from 'vue'
import { NavBar, Icon, List, Cell, PullRefresh, Tabs, Tab } from 'vant'
import ListItem from './ListItem'
import FooterAction from './FooterAction'
import ApiJourney from '@/api/journey'

Vue.use(NavBar).use(Icon).use(List).use(Cell).use(PullRefresh).use(Tabs).use(Tab)

export default {
  components: { ListItem, FooterAction },
  data () {
    return {
      list: [],
      loading: false, // 上拉加载更多
      refreshLoading: false, // 下拉刷新
      finished: false,
      error: false,
      showCheck: false, // 展示批量操作
      listParam: null
    }
  },
  created () {
    this.listParam = this.$store.state.journeyList.listParams
    this.showCheck = this.$store.state.journeyList.showCheckbox
    this.$store.dispatch('setJourneyListShowCheckbox', false)
  },
  computed: {
    checkDisable () { // 多选最多可以选择20个
      return this.list.filter(t => t.checked).length >= 20
    },
    checkedList () {
      return this.list.filter(t => t.checked)
    }
  },
  watch: {
    'listParam.tickettype' () {
      this.list = []
      this.listParam.pageNum = 1
      this.loading = true
      this.getList().then(list => {
        this.list = list
        this.loading = false
      })
    }
  },
  methods: {
    checkAll () {
      if (this.checkDisable) {
        this.list.forEach((t, i) => {
          this.$set(this.list, i, { ...t, checked: false })
        })
      } else {
        this.list.forEach((t, i) => {
          if (!this.checkDisable) {
            this.$set(this.list, i, { ...t, checked: true })
          }
        })
      }
    },
    back () {
      this.$store.dispatch('clearListParams')
      this.$router.push('/')
    },
    toSearch () {
      this.$store.dispatch('setJourneyListShowCheckbox', this.showCheck) // 存储是否在进行批量操作
      this.$store.dispatch('setListParams', {
        ...this.listParam,
        pageNum: 0
      })
      this.$router.push('/planeSearchForm')
    },
    getList () {
      return new Promise((resolve, reject) => {
        const userInfo = JSON.parse(localStorage.getItem('userInfo'))
        ApiJourney.journeyList({
          categoryId: userInfo.categoryId,
          obtUserName: userInfo.tel,
          personName: userInfo.userName,
          ...this.listParam
        }).then(res => {
          const { result, list } = res.page
          if (result) {
            resolve(list)
            if (list.length < 10) {
              this.finished = true
            }
          } else {
            this.error = true
            reject(res.page)
          }
        }).catch(e => {
          this.error = true
          reject(e)
        })
      })
    },
    onRefresh () { // 下拉刷新
      this.listParam.pageNum = 1
      this.getList().then(list => {
        this.list = list
        this.refreshLoading = false
      })
    },
    onLoad () { // 上拉加载更多
      this.listParam.pageNum++
      this.getList().then(list => {
        this.loading = false
        this.list = this.list.concat(list)
      }).catch(err => {
        console.error(err)
        this.loading = false
      })
    },
    deleteItem (item) {
      console.log(item, '已被修改')
      this.list = []
      this.listParam.pageNum = 1
      this.loading = true
      this.$nextTick(() => {
        this.getList().then(list => {
          this.list = list
          this.loading = false
        })
      })
    },
    footerAction () { // 批量操作成功
      this.showCheck = false
      this.deleteItem('列表数据')
    }
  }
}
</script>
<style lang="less" scoped>
@import '~vant/es/style/var';
.content.has-check-box {
  padding-bottom: 91px;
}
.color-white {
  color: white;
  .btn {
    margin-right: @padding-xs;
    cursor: pointer;
  }
}
.tabs {
  padding: @padding-xs 0;
}

.search-icon {
  width: 14px;
  height: 14px;
}
</style>

<style scoped>
/deep/ .tabs .van-tabs__nav--card {
  border: 0;
  border-radius: 14px;
  overflow: hidden;
}
/deep/ .tabs .van-ellipsis {
  line-height: 30px;
}
</style>
