<!--
 * @Descripttion:
 * @Author: zhaohx
 * @Date: 2021-06-24 10:07:18
 * @LastEditors: zhaohx
 * @LastEditTime: 2021-06-25 14:22:28
-->
<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AppLayout',
  data() {
    return {
    }
  },
  components: {
    // TabBar
  },
  methods: {
  }
}
</script>
