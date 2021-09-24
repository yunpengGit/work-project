<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-04-06 14:39:39
-->
<template>
  <div class="layout-sidebar" :class="isCollapse ? 'layout-silder-collapse':'' ">
    <div class="main-menu">
      <div class="gl-main-menu" :class="isCollapse ? 'gl-main-menu--collapse':'' ">
        <el-menu :default-active="activeMenu" :collapse="isCollapse" :collapse-transition="false" :unique-opened="true" mode="vertical">
          <sidebar-item v-for="(route, index) in permission_routes" :key="route.path + index" :item="route" :base-path="route.path" />
        </el-menu>
        <div class="foot-button">
          <i
            class="el-icon-s-fold menu-switch"
            @click="toggleSideBar"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'

export default {
  components: { SidebarItem },
  computed: {
    ...mapGetters(['permission_routes', 'sidebar']),
    activeMenu () {
      const route = this.$route
      const { meta, path } = route
      // if set path, the sidebar will highlight the path you set
      if (meta.activeMenu) {
        return meta.activeMenu
      }
      return path
    },
    isCollapse () {
      return !this.sidebar.opened
    }
  },
  methods: {
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
