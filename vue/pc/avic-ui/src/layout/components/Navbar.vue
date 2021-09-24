<template>
  <div class="header-container-box">
    <!-- <breadcrumb id="breadcrumb-container" class="breadcrumb-container" /> -->
    <div class="left-container">
      <div class="logo-box">
        <img :src="logo" alt="logo" width="318" height="38">
      </div>
    </div>
    <div class="right-container">
      <div class="right-menu">
        <template v-if="device!=='mobile'">
          <search id="header-search" class="right-menu-item" />

          <!--<el-tooltip content="商网官网" effect="dark" placement="bottom">-->
          <!--<jee-think-site id="jeethink-site" class="right-menu-item hover-effect" />-->
          <!--</el-tooltip>-->
          <!---->
          <!--<el-tooltip content="购买源码" effect="dark" placement="bottom">-->
          <!--<jee-think-doc id="jeethink-doc" class="right-menu-item hover-effect" />-->
          <!--</el-tooltip>-->

          <screenfull id="screenfull" class="right-menu-item hover-effect" />

          <el-tooltip content="布局大小" effect="dark" placement="bottom">
            <size-select id="size-select" class="right-menu-item hover-effect" />
          </el-tooltip>

        </template>

        <el-dropdown class="avatar-container right-menu-item hover-effect" trigger="click">
          <div class="avatar-wrapper">
            <img :src="avatar" class="user-avatar">
            <i class="el-icon-caret-bottom" />
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/user/profile">
              <el-dropdown-item>个人中心</el-dropdown-item>
            </router-link>
            <!--<el-dropdown-item @click.native="setting = true">-->
            <!--<span>布局设置</span>-->
            <!--</el-dropdown-item>-->
            <el-dropdown-item divided @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <!-- <div class="top-menu">
        <router-link to="/" class="top-menu-item">
          <span>工作台</span>
        </router-link>
        <router-link to="/1" class="top-menu-item">
          <span>我的代办</span>
        </router-link>
        <router-link to="/2" class="top-menu-item">
          <span>数据大屏</span>
        </router-link>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Screenfull from '@/components/Screenfull'
import SizeSelect from '@/components/SizeSelect'
import Search from '@/components/HeaderSearch'
import JeeThinkSite from '@/components/JeeThink/Site'
import JeeThinkDoc from '@/components/JeeThink/Doc'
import logo from '@/assets/logo-img.png'

export default {
  data () {
    return {
      logo: logo
    }
  },
  components: {
    Breadcrumb,
    Screenfull,
    SizeSelect,
    Search,
    JeeThinkSite,
    JeeThinkDoc
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device'
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
  methods: {
    async logout () {
      this.$confirm('确定注销并退出系统吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$store.dispatch('LogOut').then(() => {
          location.href = '/index';
        })
      })
    }
  }
}
</script>