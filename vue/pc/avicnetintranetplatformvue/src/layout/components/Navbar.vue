<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:30
 * @LastEditors: peng
 * @LastEditTime: 2021-08-26 15:09:27
-->
<template>
  <div class="layout-header">
    <div class="start">
      <div class="header-logo">
        <img :src="logo" alt="航空工业综合业务管理平台">
      </div>
      <span class="jm">（{{ version }}）</span>
      <!-- <div class="header-menus">
        <el-button type="text" @click="goPortal">日常办公</el-button>
      </div> -->
    </div>
    <div class="end">
      <!-- <div class="header-search clearfix">
        <icon-svg name="sousuo" class="search-icon" />
        <el-input v-model="search" placeholder="请输入搜索内容" class="header-search-input" /> -->
      <!-- </div> -->
      <div class="header-sub-menu">
        <!-- <div class="header-sub-menu-item" @click="$router.push('/onlinePeople')"><icon-svg name="zaixianrenyuan" class="icon-tab" /><span>在线人员({{ $store.state.onlineUser.onlineUserCount }})</span></div> -->
        <!-- <div class="header-sub-menu-item"><i class="el-icon-present" /><span>应用中心</span></div> -->
        <!-- <div class="header-sub-menu-item">
          <icon-svg name="yijianxiang" class="icon-tab" />
          <el-badge :value="sugBoxNumber" :max="99" class="el-badge-item">
            <span size="small">意见箱</span>
          </el-badge>
        </div> -->
        <div class="header-sub-menu-item">
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link clearfix">
              <img :src="avtr" alt="" class="avtr">
              <span class="name">{{ userInfo && userInfo.nickName }}</span>
              <icon-svg name="xiala-shaixuan" class="dropdown-icon" />
            <!-- <i class="el-icon-arrow-down el-icon--right" /> -->
            </span>
            <el-dropdown-menu slot="dropdown">
              <!-- <el-dropdown-item>个人中心</el-dropdown-item> -->
              <el-dropdown-item divided command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '@/assets/logo.png'
import avtrImg from '@/assets/avtr.png'
import iconSvg from '@/components/icon-svg'
import store from '@/store'
import { getToken } from '@/utils/auth'
export default {
  components: {
    iconSvg
  },
  data () {
    return {
      logo: logo,
      index: process.env.VUE_APP_INDEX_LINK,
      version: process.env.VUE_APP_VERSION,
      token: getToken(),
      avtr: avtrImg,
      search: '',
      sugBoxNumber: '',
      userInfo: null,
      interval: null
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'secret'
    ]),
    setting: {
      get () {
        return this.$store.state.settings.showSettings
      },
      set (val) {
        this.$store.dispatch('settings/changeSetting', {
          key: 'showSettings',
          value: val
        })
      }
    }
  },
  created () {
    store.dispatch('getSecretLevelFn')
    const command = window.localStorage.getItem('dataTheme')
    if (command && command !== 'undefined') {
      this.handleCommand(command)
    }
    // if (process.env.NODE_ENV === 'development') {
    //   this.$api('common.getInfo').then(res => {
    //     this.userInfo = res.user
    //   })
    // } else {
    this.userInfo = store.getters.userInfo
    // }
    // this.getOnlineUserCount()
    // this.interval = setInterval(() => {
    //   this.getOnlineUserCount()
    // }, 6000)
  },
  beforeDestroy () {
    if (this.interval) {
      clearInterval(this.interval)
    }
  },
  methods: {
    goPortal () {
      window.open(this.index, '_blank')
    },
    handleCommand (command) {
      if (command !== 'logout') {
        this.currentFontSize = command
        window.document.documentElement.setAttribute('data-theme', command)
        window.document.querySelector('body').style.fontSize = command
        window.localStorage.setItem('dataTheme', command)
      } else {
        store.dispatch('LogOut').then(res => {
          window.location.href = res.data.loginUrl
        })
      }
    },
    getOnlineUserCount () {
      store.dispatch('getOnlineUserCount')
    }
  }
}
</script>
<style lang="scss" scoped>
// @import "../../ui/themeVar.scss";
.header-search{
  .search-icon{
    float: left;
    margin: 2px 1px 3px 0;
    color: #00274C;
    font-size: 16px;
  }
  ::v-deep .el-input .el-input__inner{
    padding-left: 0;
  }
}
.warper .layout-header .header-sub-menu-item{
  .dropdown-icon{
    color: #fff;
  }
  cursor: pointer;
  // @include fs();
  & > span{
    display: inline-block;
    vertical-align: text-top;
  }
  .el-dropdown-menu__item{
    text-align: text-top;
  }
  .icon-tab{
    margin-right: 4px;
    width: 16px;
    height: 16px;
    vertical-align: text-top;
  }
  // .name{
  //   // @include fs();
  // }
  .el-badge{
    vertical-align: text-top;
  }
  .el-dropdown{
    vertical-align: text-top;
  }
}
// .warper .layout-header .header-menu ul li a{
//   // @include fs();
// }
.el-dropdown-menu{
  .el-dropdown-menu__item{
    &.active{
      color: #1e89ff;
    }
  }
}
</style>
