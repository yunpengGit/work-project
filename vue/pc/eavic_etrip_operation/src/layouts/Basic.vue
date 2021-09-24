<template>
    <div>
      <a-layout id="left-menu">
        <side-menu
            mode="inline"
            :menus="menus"
            theme= 'light'
            :collapsed="collapsed"
            :collapsible="true"
            @menuSelect="menuSelect"
          >

          </side-menu>
        <a-layout>
          <CommonHeader :collapsed="collapsed" @toggle="toggle"/>
          <!-- <a-layout-header style="background: #fff; padding: 0">
            <a-icon
              class="trigger"
              :type="collapsed ? 'menu-unfold' : 'menu-fold'"
              @click="() => (collapsed = !collapsed)"
            />
          </a-layout-header> -->
          <a-layout-content
            :style="{ margin: '24px 16px', padding: '24px', background: '#fff', minHeight: '280px' }"
          >
            <router-view />
          </a-layout-content>
        </a-layout>
      </a-layout>
    </div>
</template>

<script>
import Vue from 'vue'
import { Layout, Menu, Icon } from 'ant-design-vue'
import { localRouterMap } from './../router/routerConfig'

import { routesConvert } from './../utils/routeConvert'
import SideMenu from '@/components/Menu/SideMenu'
import CommonHeader from '@/components/CommonHeader/CommonHeader'

Vue.use(Layout)
  .use(Menu)
  .use(Icon)
export default {
  data () {
    return {
      collapsed: false,
      menus: []
    }
  },
  components: {
    SideMenu,
    CommonHeader
  },
  created () {
    const routes = routesConvert(localRouterMap.find(item => item.path === '/'))
    this.menus = (routes && routes.children) || []
  },
  methods: {
    toggle() {
      this.collapsed = !this.collapsed
    },
    menuSelect () {
    }
  }
}
</script>
<style>
#left-menu{
  min-height: 100vh;
}
#left-menu .trigger {
  font-size: 18px;
  line-height: 64px;
  padding: 0 24px;
  cursor: pointer;
  transition: color 0.3s;
}

#left-menu .trigger:hover {
  color: #1890ff;
}

</style>

<style scoped lang="less">

</style>
