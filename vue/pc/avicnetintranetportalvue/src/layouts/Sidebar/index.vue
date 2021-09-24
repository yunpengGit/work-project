<!--
 * @Descripttion:
 * @Author: zongmz
 * @Date: 2021-03-31 09:05:31
 * @LastEditors: zongmz
 * @LastEditTime: 2021-06-30 19:22:28
-->
<template>
  <div class="page-frame-sidebar" :class="firstCollapse?'open':''">
    <div class="page-frame-first-sidebar" :class="firstCollapse?'open':''" @mouseenter="firstCollapse=true" @mouseleave="firstCollapse=false">
      <div class="page-frame-first-sidebar-hidden" :class="firstCollapse?'open':''">
        <div class="main-menu">
          <a class="menu-index" href="/" @mouseenter="firstCollapse=true">
            <icon-svg name="shouye" class="menu-icon" /><span class="info">门户首页</span>
          </a>
          <ul v-for="(route, index) in permission_routes" :key="route.path + index" class="menu-ul">
            <router-link v-for="item in showRoutes(route.children)" :key="item.path + index" :to="{path:item.path}">
              <li class="menu-item" @click="openSecond" @mouseenter="firstCollapse=true"><icon-svg :name="item.meta && item.meta.icon" class="menu-icon" /><span class="info">{{ item.meta.title }}</span></li>
            </router-link>
          </ul>
        </div>
      </div>
    </div>
    <div v-if="isChildren" class="page-frame-second-sidebar" :class="secondCollapse?'open':''">
      <div class="menu-content">
        <div class="menu-item">111</div>
      </div>
      <i class="switcher" :class="secondCollapse ? 'unfold-switcher' :'fold-switcher'" @click="secondCollapse = !secondCollapse" />
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import routes from '@/router/routes'
import iconSvg from '@/components/icon-svg'
import { getItem } from '@/utils/storage'
export default {
  components: { iconSvg },
  data () {
    return {
      permission_routes: [],
      firstCollapse: false,
      secondCollapse: false
    }
  },
  computed: {
    ...mapGetters(['sidebar']),
    isChildren () {
      let flag = false
      // console.log(this.permission_routes, 222)
      this.permission_routes.forEach(v => {
        v.children.forEach(s => {
          // console.log(s, 222)
          if (s.children) {
            // console.log(s.children.filter(d => !d.hidden), 222333)
            flag = !!s.children.filter(d => !d.hidden).length
          } else {
            flag = false
          }
        })
      })
      return flag
    }
  },
  watch: {
    '$route': {
      deep: true,
      immediate: true,
      handler: function (newVal, oldVal) {
        this.getRoutes()
      }
    }
  },
  created () {
    this.getRoutes()
  },
  methods: {
    hasPermission (route) {
      if (route.meta && route.meta.roles) {
        const userInfo = JSON.parse(getItem('userInfo'))
        const roles = userInfo && userInfo.roles
        return !!route.meta.roles.find(v => roles.map(d => d.roleKey).includes(v))
      }
      // 若此路由没有权限控制，则所有用户皆可访问
      return true
    },
    showRoutes (routes) {
      return routes.filter(s => !s.hidden && this.hasPermission(s))
    },
    getRoutes () {
      const newRoutes = [...routes].filter(v => !v.hidden && v.name === this.$route.matched[0].name)
      newRoutes.forEach(v => {
        v.children = v.children.filter(s => !s.hidden)
      })
      this.permission_routes = newRoutes
    },
    openSecond () {
      this.firstCollapse = false
      this.secondCollapse = true
    },
    toggleSecond () {
      this.secondCollapse = !this.secondCollapse
    },
    toggleSideBar () {
      this.$store.dispatch('app/toggleSideBar')
    }
  }
}
</script>
