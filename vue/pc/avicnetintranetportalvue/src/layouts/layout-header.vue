<template>
  <div class="layout-header page-frame-header">
    <div class="start">
      <div class="header-logo" :class="isText?'header-logo-test':''">
        <router-link to="/"><img :src="logo" alt="航空工业综合业务管理平台"></router-link>
        <!-- <span class="title">航空工业综合业务管理平台</span> -->
      </div>
      <span class="jm">（{{ version }}）</span>
      <header-menus v-if="showHeaderMenus" />
      <!-- <div class="header-menus">
        <el-button type="text" @click="goPortal">日常办公</el-button>
      </div> -->
    </div>
    <div class="end">
      <div class="header-search clearfix">
        <icon-svg name="sousuo" class="search-icon" />
        <el-input v-model="search" placeholder="请输入搜索内容" class="header-search-input" />
      </div>
      <div class="header-sub-menu">
        <!-- <div class="header-sub-menu-item"><icon-svg name="zaixianrenyuan" class="icon-tab" /><span class="online-people">在线人员({{ $store.state.onlineUser.onlineUserCount }})</span></div> -->
        <!-- <div class="header-sub-menu-item"><i class="el-icon-present" /><span>应用中心</span></div> -->
        <!-- <div class="header-sub-menu-item">
          <icon-svg name="yijianxiang" class="icon-tab" />
          <el-badge :value="sugBoxNumber" :max="99" class="el-badge-item">
            <span size="small">意见箱</span>
          </el-badge>
        </div> -->
        <!-- <div class="header-sub-menu-item">
          <size-select />
        </div> -->
        <div class="header-sub-menu-item">
          <!-- <span class="el-dropdown-link clearfix">
            <img :src="avtr" alt="" class="avtr">
            <span class="name">{{ userInfo && userInfo.nickName }}</span>
            <icon-svg name="xiala-shaixuan" class="dropdown-icon" />
          </span> -->
          <el-dropdown @command="handleCommand">
            <span class="el-dropdown-link clearfix">
              <!-- <img :src="avtr" alt="" class="avtr"> -->
              <icon-svg name="user" class="dropdown-icon" />
              <span class="user-name">{{ userInfo && userInfo.nickName }}</span>
              <icon-svg name="xiala-caozuo" class="dropdown-icon dropdown-icon-caozuo" />
            </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item v-for="item of sizeOptions" :key="item.value" :command="item.value" :class="{'active': item.value===currentSize}">
                {{ item.label }}
              </el-dropdown-item>
              <el-dropdown-item command="customWorkbench">自定义工作台</el-dropdown-item>
              <el-dropdown-item command="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { Base64 } from 'js-base64'
import logoImgIndexPrd from '@/assets/logo-index-prd.png'
import logoImgContPrd from '@/assets/logo-cont-prd.png'
import logoImgIndexTest from '@/assets/logo-index-test.png'
import logoImgContTest from '@/assets/logo-cont-test.png'
import avtrImg from '@/assets/avtr.png'
import iconSvg from '@/components/icon-svg'
import HeaderMenus from './HeaderMenus'
// import SizeSelect from '@/components/SizeSelect'
import { getItem } from '@/utils/storage'
import { getToken } from '@/utils/auth'
import filterRoute from './filterRoute'
// import { mapState } from 'vuex'
import store from '@/store'
export default {
  components: { iconSvg, HeaderMenus },
  data () {
    return {
      showHeaderMenus: false,
      filterRoute,
      zoomNum: 10,
      currentFontSize: '14px',
      version: process.env.VUE_APP_VERSION,
      isText: process.env.VUE_APP_ENVTYPE === 'Test',
      token: getToken(),
      avtr: avtrImg,
      search: '',
      sugBoxNumber: '',
      userInfo: null,
      currentSize: window.localStorage.getItem('dataTheme'),
      sizeOptions: [
        // { label: '大号', value: 'medium' },
        { label: '大号字号', value: 'small' },
        { label: '标准字号', value: 'mini' }
      ]
    }
  },
  computed: {
    logo () {
      let logo = null
      let logoCont = null
      if (process.env.VUE_APP_ENVTYPE === 'Test') {
        logo = logoImgIndexTest
        logoCont = logoImgContTest
      } else {
        logo = logoImgIndexPrd
        logoCont = logoImgContPrd
      }
      return (filterRoute.some(e => this.$route.path.indexOf(e) > -1)) ? logo : logoCont
    }
  },
  watch: {
    '$route': {
      handler (n) {
        if (n.name === 'website') {
          this.showHeaderMenus = true
        } else {
          this.showHeaderMenus = false
        }
      },
      immediate: true,
      deep: true
    }
  },
  created () {
    const command = window.localStorage.getItem('dataTheme')
    if (command && command !== 'undefined') {
      this.handleCommand(command)
    }
    this.userInfo = JSON.parse(getItem('userInfo'))
  },
  methods: {
    goPortal () {
      window.open('/', '_blank')
    },
    handleCommand (command) {
      if (command === 'logout') {
        this.logout()
      } else if (command === 'small' || command === 'mini') {
        this.handleSetSize(command)
      } else if (command === 'customWorkbench') {
        this.toCustomWorkbench()
      }
      // if (command === 'zoom-in' || command === 'zoom-out' || command === 'zoom') {
      //   this.zoomFn(command)
      // }
    },
    toCustomWorkbench () {
      const websiteInfo = this.$store.getters.website
      // const sitePages = websiteInfo.sitePages
      // const sites = websiteInfo.filter(e => {
      //   return !e.siteId
      // })
      if (websiteInfo) {
        const sitePages = websiteInfo[0].sitePages
        const pageId = sitePages[0].pageId
        this.$router.push({ path: '/dragHome', query: {
          pageId: Base64.encode(pageId),
          isCustom: true
        }})
      }
    },
    handleSetSize (size) {
      this.currentSize = size
      this.$ELEMENT.size = size
      document.querySelector('body').className = 'data-theme--' + size
      window.localStorage.setItem('dataTheme', size)
      this.refreshView()
      // this.$message({
      //   message: '选择 Size 成功',
      //   type: 'success'
      // })
    },
    refreshView () {
      const { fullPath } = this.$route
      this.$nextTick(() => {
        this.$router.replace({
          // path: '/redirect' + fullPath
          path: fullPath
        })
      })
    },
    zoomFn (command) {
      let num = this.zoomNum
      if (command === 'zoom-in') {
        if (num >= 10 && num < 15) {
          num += 1
        }
      } else if (command === 'zoom-out' && num >= 11) {
        num -= 1
      } else {
        num = 10
      }
      const ele = window.document.querySelector('.app-main')
      if (ele) {
        ele.style.transformOrigin = 'left top'
        ele.style.transform = `scale(${num / 10})`
      }
      this.zoomNum = num
    },
    logout () {
      store.dispatch('LogOut').then(res => {
        window.location.href = res.data.loginUrl
      })
    }
  }
}
</script>
<style lang="scss" scoped>
::v-deep .page-frame .page-frame-header{
  background: rgba(255, 255, 255, .3);
  box-shadow: 3px 3px 6px 3px rgba(0, 0, 0, .3);
}

@import '@/ui/size/mixin.scss';
@mixin del($sc: 1, $fs: 14px){
  .page-frame.no-silder .page-frame-header .end .header-search{
    border: 0;
  }
  .no-silder .layout-header{
    border-bottom: 1px solid rgba($color: #fff, $alpha: 0.12);
  }
  .layout-header{
    min-width: 1366px;
    .header-search{
      border: 0;
      .search-icon{
        float: left;
        margin: 2px 4px 3px 0;
        color: #4D76BD;
        font-size: 16px;
      }
      ::v-deep .el-input .el-input__inner{
        padding-left: 0;
      }
    }
    .user-name{
      margin-left: 5px;
    }
  }
  .page-frame .page-frame-header .end .header-sub-menu-item .dropdown-icon-caozuo{
    margin-left: 4px;
    width: 10px ;
    height: 10px;
  }
  .el-dropdown-menu .el-dropdown-menu__item{
    font-size: 12px;
    color: #191F24;
    &:hover{
        background: #499CF8;
        color: #fff;
      }
    &.active{
      color: #499CF8;
      background-color: #fff;
    }
  }
}
@import '@/ui/size/scale.scss'
</style>
